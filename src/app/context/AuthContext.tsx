// src/app/context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import UAuth from '@uauth/js';
import WalletConnectProvider from '@walletconnect/web3-provider';

interface UAuthUser {
  sub: string;
  wallet_address: string;
  email?: string;
  wallet_type?: string;
}

interface AuthContextType {
  user: UAuthUser | null;
  isLoading: boolean;
  error: string | null;
  login: (provider?: string) => Promise<UAuthUser | undefined>;
  logout: () => Promise<void>;
  loginWithWalletConnect: () => Promise<UAuthUser | undefined>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initialize UAuth outside the component to avoid recreation
const uauth = new UAuth({
  clientID: process.env.NEXT_PUBLIC_CLIENT_ID || '',
  redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000',
  scope: process.env.NEXT_PUBLIC_SCOPES || 'openid wallet profile',
});

// Initialize WalletConnect provider
const initWalletConnect = () => {
  return new WalletConnectProvider({
    infuraId: process.env.NEXT_PUBLIC_INFURA_ID || '',
    rpc: {
      1: 'https://mainnet.infura.io/v3/' + process.env.NEXT_PUBLIC_INFURA_ID,
      137: 'https://polygon-mainnet.infura.io/v3/' + process.env.NEXT_PUBLIC_INFURA_ID,
    },
    // Optional: Specify chains, bridge URL, etc. based on your needs
  });
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UAuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [walletConnectProvider, setWalletConnectProvider] = useState<WalletConnectProvider | null>(null);
  
  // Check if user is already authenticated on initial load and page changes
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        console.log('Checking authentication...');
        
        // First check localStorage for cached auth
        const storedUser = localStorage.getItem('ud_user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            console.log('Found stored user:', parsedUser);
            setUser(parsedUser);
            
            // If the user was connected via WalletConnect, re-initiate the provider
            if (parsedUser.wallet_type === 'wallet_connect') {
              try {
                const provider = initWalletConnect();
                setWalletConnectProvider(provider);
                // Note: We don't enable() the provider here to avoid prompting the QR code
                // The user will need to reconnect manually if they want to use the wallet
              } catch (error) {
                console.warn('Failed to initialize WalletConnect provider:', error);
              }
            }
            
            setIsLoading(false);
            return;
          } catch (error) {
            console.error('Error parsing stored user:', error);
            localStorage.removeItem('ud_user');
          }
        }
        
        // If no stored user, check UAuth
        try {
          const authorization = await uauth.user();
          
          if (authorization) {
            console.log('User authenticated via UAuth, full response:', authorization);
            
            // Extract wallet address - check multiple possible locations
            let walletAddress = '';
            
            if (authorization.wallet_address) {
              walletAddress = authorization.wallet_address;
            } else if (authorization.idToken?.wallet_address) {
              walletAddress = authorization.idToken.wallet_address;
            } else if (authorization.idToken?.crypto?.eth?.address) {
              walletAddress = authorization.idToken.crypto.eth.address;
            }
            
            console.log('Extracted wallet address:', walletAddress);
            
            const userData = {
              sub: authorization.sub || authorization.idToken?.sub || '',
              wallet_address: walletAddress,
              email: authorization.email || authorization.idToken?.email || '',
              wallet_type: 'unstoppable'
            };
            
            console.log('Storing user data:', userData);
            setUser(userData);
            localStorage.setItem('ud_user', JSON.stringify(userData));
          }
        } catch (error) {
          console.log('Not authenticated via UAuth:', error);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Method to connect with WalletConnect
  const loginWithWalletConnect = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Create a new provider instance
      const provider = initWalletConnect();
      setWalletConnectProvider(provider);
      
      // Enable session (triggers QR Code modal)
      await provider.enable();
      
      // Get accounts
      const accounts = provider.accounts;
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }
      
      const walletAddress = accounts[0].toLowerCase();
      
      // Store user data
      const userData = {
        sub: `wallet_${walletAddress.substring(0, 8)}`,
        wallet_address: walletAddress,
        wallet_type: 'wallet_connect'
      };
      
      setUser(userData);
      localStorage.setItem('ud_user', JSON.stringify(userData));
      
      return userData;
    } catch (error: any) {
      console.error('WalletConnect error:', error);
      setError(error.message || 'Failed to connect wallet. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Main login method with provider option
  const login = async (provider = 'unstoppable') => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (provider === 'walletconnect') {
        return await loginWithWalletConnect();
      } else {
        // Default is Unstoppable Login
        console.log('Starting Unstoppable login process...');
        const authorization = await uauth.loginWithPopup();
        
        if (authorization) {
          console.log('Login successful, full response:', authorization);
          
          // Extract wallet address - check multiple possible locations
          let walletAddress = '';
          
          if (authorization.wallet_address) {
            walletAddress = authorization.wallet_address;
          } else if (authorization.idToken?.wallet_address) {
            walletAddress = authorization.idToken.wallet_address;
          } else if (authorization.idToken?.crypto?.eth?.address) {
            walletAddress = authorization.idToken.crypto.eth.address;
          }
          
          console.log('Extracted wallet address:', walletAddress);
          
          // Store the user data
          const userData = {
            sub: authorization.sub || authorization.idToken?.sub || '',
            wallet_address: walletAddress,
            email: authorization.email || authorization.idToken?.email || '',
            wallet_type: 'unstoppable'
          };
          
          console.log('User data being stored:', userData);
          
          setUser(userData);
          
          // Store in localStorage for persistence across page refreshes
          localStorage.setItem('ud_user', JSON.stringify(userData));
          console.log('User data stored in localStorage');
          
          return userData;
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to login with the selected provider');
      
      // Development fallback (for testing - remove in production)
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock user for development');
        const mockUser = {
          sub: 'alice.her',
          wallet_address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
          email: 'alice@example.com',
          wallet_type: 'unstoppable'
        };
        setUser(mockUser);
        localStorage.setItem('ud_user', JSON.stringify(mockUser));
        return mockUser;
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout method
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Disconnect WalletConnect if it was used
      if (walletConnectProvider) {
        await walletConnectProvider.disconnect();
        setWalletConnectProvider(null);
      } else if (user?.wallet_type === 'unstoppable') {
        // Try to logout from UAuth
        try {
          await uauth.logout().catch(err => {
            console.warn('UAuth logout had an issue:', err);
          });
        } catch (error) {
          console.warn('Error during UAuth logout:', error);
        }
      }
      
      // Always clean up local state
      setUser(null);
      localStorage.removeItem('ud_user');
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add event listener for WalletConnect disconnect
  useEffect(() => {
    if (walletConnectProvider) {
      walletConnectProvider.on('disconnect', () => {
        console.log('WalletConnect disconnected');
        setUser(null);
        localStorage.removeItem('ud_user');
      });
      
      // Clean up listener
      return () => {
        walletConnectProvider.removeListener('disconnect', () => {
          console.log('WalletConnect disconnect listener removed');
        });
      };
    }
  }, [walletConnectProvider]);
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      error, 
      login, 
      logout, 
      loginWithWalletConnect 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};