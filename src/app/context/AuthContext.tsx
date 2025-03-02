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
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const uauth = new UAuth({
  clientID: process.env.NEXT_PUBLIC_CLIENT_ID || '',
  redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000',
  scope: 'openid wallet profile',
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UAuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authorization = await uauth.user();
        if (authorization) {
          setUser({
            sub: authorization.sub,
            wallet_address: authorization.wallet_address || '',
            email: authorization.email,
          });
        }
      } catch (error) {
        console.log('Not authenticated');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async () => {
    try {
      setIsLoading(true);
      const authorization = await uauth.loginWithPopup();
      
      if (authorization) {
        setUser({
          sub: authorization.sub,
          wallet_address: authorization.wallet_address || '',
          email: authorization.email,
        });
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      await uauth.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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