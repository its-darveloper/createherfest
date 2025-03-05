// components/debug/AuthDebug.tsx
'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useState, useEffect } from 'react';

export default function AuthDebug() {
  const { user, isLoading, error, login, logout } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [localStorageContent, setLocalStorageContent] = useState<Record<string, any>>({});
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Check all localStorage keys
        const items: Record<string, any> = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            try {
              items[key] = JSON.parse(localStorage.getItem(key) || '');
            } catch {
              items[key] = localStorage.getItem(key);
            }
          }
        }
        setLocalStorageContent(items);
      } catch (error) {
        console.error('Error accessing localStorage:', error);
      }
    }
  }, [user, isLoading]);
  
  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null;
  
  const handleForceLogin = async () => {
    try {
      const UAuth = (await import('@uauth/js')).default;
      const uauth = new UAuth({
        clientID: process.env.NEXT_PUBLIC_CLIENT_ID || '',
        redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000',
        scope: process.env.NEXT_PUBLIC_SCOPES || 'openid wallet profile',
      });
      
      const authorization = await uauth.loginWithPopup();
      console.log('Direct login result:', authorization);
      
      // Manually save user data
      const userData = {
        sub: authorization.sub || authorization.idToken?.sub || '',
        wallet_address: authorization.wallet_address || 
                        authorization.idToken?.wallet_address || 
                        authorization.idToken?.crypto?.eth?.address || '',
        email: authorization.email || authorization.idToken?.email || '',
      };
      
      localStorage.setItem('ud_user', JSON.stringify(userData));
      window.location.reload();
    } catch (error) {
      console.error('Force login error:', error);
    }
  };
  
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button 
        onClick={() => setIsVisible(!isVisible)}
        className="bg-purple-600 text-white p-2 rounded-full"
      >
        🛠️
      </button>
      
      {isVisible && (
        <div className="absolute bottom-12 left-0 bg-black/90 text-white p-4 rounded-lg w-96 max-h-96 overflow-auto">
          <h3 className="font-bold mb-2">Auth Debug</h3>
          <p>Loading: {isLoading ? 'true' : 'false'}</p>
          <p>Error: {error || 'none'}</p>
          <p>User: {user ? 'authenticated' : 'not authenticated'}</p>
          {user && (
            <>
              <p>Sub: {user.sub}</p>
              <p className="truncate">Wallet: {user.wallet_address || 'none'}</p>
              <p>Email: {user.email || 'none'}</p>
            </>
          )}
          
          <div className="mt-2">
            <p className="font-bold">LocalStorage:</p>
            <pre className="bg-gray-800 p-2 rounded text-xs overflow-auto max-h-32">
              {JSON.stringify(localStorageContent, null, 2)}
            </pre>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <button 
              onClick={login}
              className="bg-blue-600 text-white px-2 py-1 text-xs rounded"
            >
              Login
            </button>
            <button 
              onClick={handleForceLogin}
              className="bg-purple-600 text-white px-2 py-1 text-xs rounded"
            >
              Force Login
            </button>
            <button 
              onClick={logout}
              className="bg-red-600 text-white px-2 py-1 text-xs rounded"
            >
              Logout
            </button>
            <button 
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('ud_user');
                  window.location.reload();
                }
              }}
              className="bg-yellow-600 text-white px-2 py-1 text-xs rounded"
            >
              Clear Storage
            </button>
          </div>
        </div>
      )}
    </div>
  );
}