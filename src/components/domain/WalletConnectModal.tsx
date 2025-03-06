// src/components/domain/WalletConnectModal.tsx

// Update imports
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
  const [connectionMethod, setConnectionMethod] = useState<string | null>(null);
  
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
  
  // Handle login with specific provider
  const handleLogin = async (provider: string) => {
    try {
      setConnectionMethod(provider);
      await login(provider);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error(`Login failed with ${provider}:`, error);
      setConnectionMethod(null);
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
          
          <div className="space-y-4">
            <Button 
              onClick={() => handleLogin('unstoppable')}
              className="w-full btn-shimmer bg-[#473dc6] hover:bg-[#5c51e6] text-white py-4 shadow-glow hover:shadow-glow-hover transition-all duration-300 font-urbanist"
              disabled={isLoading && connectionMethod === 'unstoppable'}
            >
              {isLoading && connectionMethod === 'unstoppable' ? (
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
            
            <Button 
              onClick={() => handleLogin('walletconnect')}
              className="w-full bg-[#3b99fc] hover:bg-[#1f84fc] text-white py-4 shadow-glow hover:shadow-glow-hover transition-all duration-300 font-urbanist"
              disabled={isLoading && connectionMethod === 'walletconnect'}
            >
              {isLoading && connectionMethod === 'walletconnect' ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                  Connecting...
                </>
              ) : (
                <>
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="#fff">
                    <path d="M6 9.73791C9.00974 6.72817 13.9903 6.72817 17 9.73791L17.2302 9.96809C17.322 10.0599 17.322 10.208 17.2302 10.2998L16.0266 11.5035C15.9806 11.5494 15.9065 11.5494 15.8606 11.5035L15.5431 11.186C13.3931 9.03602 9.60691 9.03602 7.45695 11.186L7.11263 11.5303C7.06671 11.5763 6.99264 11.5763 6.94672 11.5303L5.74308 10.3267C5.65123 10.2348 5.65123 10.0867 5.74308 9.99485L6 9.73791ZM19.3502 12.0881L20.4229 13.1608C20.5147 13.2527 20.5147 13.4007 20.4229 13.4926L15.1024 18.8131C15.0106 18.9049 14.8625 18.9049 14.7706 18.8131L11.0303 15.0728C11.0073 15.0498 10.9707 15.0498 10.9477 15.0728L7.20749 18.8131C7.11565 18.9049 6.9676 18.9049 6.87575 18.8131L1.55526 13.4926C1.46341 13.4007 1.46341 13.2527 1.55526 13.1608L2.62794 12.0881C2.71979 11.9963 2.86784 11.9963 2.95969 12.0881L6.70007 15.8285C6.72307 15.8515 6.75963 15.8515 6.78263 15.8285L10.5229 12.0881C10.6147 11.9963 10.7628 11.9963 10.8546 12.0881L14.595 15.8285C14.618 15.8515 14.6546 15.8515 14.6776 15.8285L18.4179 12.0881C18.5098 11.9963 18.6578 11.9963 18.7497 12.0881H19.3502Z" />
                  </svg>
                  Connect with WalletConnect
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}