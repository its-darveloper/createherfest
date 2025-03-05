// components/domain/WalletConnectModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, Loader2, X } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

export default function WalletConnectModal({ 
  isOpen, 
  onClose,
  onSuccess
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const { user, isLoading, login, error } = useAuth();
  
  // If user is already connected, close the modal automatically
  useEffect(() => {
    if (user && user.wallet_address && isOpen) {
      // User is already connected, close modal
      onClose();
      if (onSuccess) onSuccess();
    }
  }, [user, isOpen, onClose, onSuccess]);
  
  // Don't render if user is already connected or modal is closed
  if (!isOpen || (user && user.wallet_address)) {
    return null;
  }
  
  // Handle login
  const handleLogin = async () => {
    try {
      await login();
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('Login failed in modal:', error);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-[#150e60] rounded-xl p-6 max-w-md w-full border border-[#473dc6]/40 shadow-glow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-urbanist text-xl font-semibold text-white">Connect Your Wallet</h2>
          <button 
            onClick={onClose} 
            className="text-white/70 hover:text-white transition-colors duration-200"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="py-6">
          <div className="w-16 h-16 bg-[#473dc6]/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wallet className="h-8 w-8 text-[#cfe6ff]" />
          </div>
          
          <p className="text-white/80 font-inter text-center mb-8">
            Connect your wallet to purchase and receive your .her domain
          </p>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-lg">
              <p className="text-red-400 font-inter text-sm">{error}</p>
            </div>
          )}
          
          <Button 
            onClick={handleLogin}
            className="w-full btn-shimmer bg-[#473dc6] hover:bg-[#5c51e6] text-white py-4 shadow-glow hover:shadow-glow-hover transition-all duration-300 font-urbanist"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-5 w-5" aria-hidden="true" />
                Connect with Unstoppable
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}