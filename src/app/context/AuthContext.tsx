// app/context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import UAuth from '@uauth/js';

interface UAuthUser {
  sub: string;
  wallet_address: string;
  email?: string;
}

interface AuthContextType {
  user: UAuthUser | null;
  isLoading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initialize UAuth outside the component to avoid recreation
const uauth = new UAuth({
  clientID: process.env.NEXT_PUBLIC_CLIENT_ID || '',
  redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000',
  scope: process.env.NEXT_PUBLIC_SCOPES || 'openid wallet profile',
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UAuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
  
  const login = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Starting login process...');
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
        };
        
        console.log('User data being stored:', userData);
        
        setUser(userData);
        
        // Store in localStorage for persistence across page refreshes
        localStorage.setItem('ud_user', JSON.stringify(userData));
        console.log('User data stored in localStorage');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to login with Unstoppable Domains');
      
      // Development fallback
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock user for development');
        const mockUser = {
          sub: 'alice.her',
          wallet_address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
          email: 'alice@example.com'
        };
        setUser(mockUser);
        localStorage.setItem('ud_user', JSON.stringify(mockUser));
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      setIsLoading(true);
      
      try {
        // Try to logout from UAuth but don't block on failure
        await uauth.logout().catch(err => {
          console.warn('UAuth logout had an issue:', err);
        });
      } catch (error) {
        console.warn('Error during UAuth logout:', error);
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
  
  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, logout }}>
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