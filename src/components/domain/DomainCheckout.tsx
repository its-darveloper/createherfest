// components/domain/DomainCheckout.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Check, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import StripeCheckoutForm from './StripeCheckoutForm';
import WalletConnectModal from './WalletConnectModal';
import axios from 'axios';
import Link from 'next/link';

export default function DomainCheckout({ onSuccess }: { onSuccess: () => void }) {
  const { items, total, clearCart, updateItemOperation } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [partialSuccess, setPartialSuccess] = useState(false);
  const [successfulDomains, setSuccessfulDomains] = useState<string[]>([]);
  const [failedDomains, setFailedDomains] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minute countdown
  const [error, setError] = useState('');
  const [showWalletModal, setShowWalletModal] = useState(false);
  
  // Format price from cents to dollars
  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };
  
  // Reset modal state if user already has a connected wallet
  useEffect(() => {
    if (user?.wallet_address && showWalletModal) {
      setShowWalletModal(false);
    }
  }, [user, showWalletModal]);
  
  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0 && !isSuccess) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSuccess) {
      setError("Your checkout session has expired. Please try again.");
      setTimeout(() => {
        router.push('/claim');
      }, 3000);
    }
  }, [timeLeft, isSuccess, router]);
  
  // Format the countdown timer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Handle showing wallet modal with check
  const handleShowWalletModal = () => {
    if (!user?.wallet_address) {
      setShowWalletModal(true);
    }
  };
  
  const handlePaymentSuccess = async () => {
    setIsProcessing(true);
    
    try {
      // Track operations in local storage for status page
      const storedOperations = JSON.parse(localStorage.getItem('DOMAIN_OPERATIONS') || '[]');
      
      console.log('Starting checkout process with wallet:', user?.wallet_address);
      
      // Process domain registration and transfer
      const response = await axios.post('/api/checkout', {
        domains: items.map(item => ({ 
          name: item.suggestion.name,
          operationId: item.operationId 
        })),
        walletAddress: user?.wallet_address,
        payment: true
      });
      
      console.log('Checkout response received:', response.data);
      
      if (response.data.success || (response.data.results && response.data.results.some((r: any) => r.success))) {
        // Store operations for status tracking
        const newOperations = response.data.results
          .filter((result: any) => result.success && result.operation && result.operation.id)
          .map((result: any) => ({
            name: result.domain,
            operationId: result.operation.id,
            status: 'PENDING',
            lastUpdated: new Date().toISOString(),
            walletAddress: user?.wallet_address,
            needsTransfer: result.needsTransfer
          }));
        
        // Instead of just storing in localStorage, ensure data is sent to the server API
        newOperations.forEach(async (operation) => {
          try {
            await axios.post('/api/store-operation', {
              domain: operation.name,
              operationId: operation.operationId,
              status: operation.status,
              walletAddress: user?.wallet_address,
              needsTransfer: operation.needsTransfer
            });
            console.log(`Stored operation for ${operation.name} in server database`);
          } catch (err) {
            console.error(`Failed to store operation for ${operation.name}:`, err);
          }
        });
        
        // Check if we need to transfer any domains later
        const domainsNeedingTransfer = response.data.results.filter((r: any) => r.needsTransfer);
        if (domainsNeedingTransfer.length > 0) {
          console.log('Some domains need transfer later:', domainsNeedingTransfer);
        }
        
        if (response.data.success) {
          // All successful
          setIsSuccess(true);
        } else {
          // Some failures
          const successful = response.data.results
            .filter((r: any) => r.success)
            .map((r: any) => r.domain);
            
          const failed = response.data.results
            .filter((r: any) => !r.success)
            .map((r: any) => r.domain);
          
          setSuccessfulDomains(successful);
          setFailedDomains(failed);
          setPartialSuccess(true);
        }
        
        // Redirect to domain status page after a delay
        setTimeout(() => {
          clearCart();
          router.push('/domains/status');
        }, 3000);
      } else {
        // All failures
        setError(response.data.error?.message || "Failed to process your domains");
      }
    } catch (error: any) {
      console.error('Domain processing error:', error);
      console.error('Error details:', error.response?.data);
      setError(error.response?.data?.error?.message || "Failed to process your domains. Please contact support.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handlePaymentError = (message: string) => {
    setError(message);
  };
  
  // Handle successful wallet connection
  const handleWalletSuccess = () => {
    console.log('Wallet connected successfully');
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="shimmer-container bg-[#150e60] rounded-xl p-6 border border-[#473dc6]/40 shadow-glow">
        <h2 className="font-urbanist text-subtitle-md text-white mb-6">Complete Your Purchase</h2>
        
        {isSuccess ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-[#473dc6]/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-[#cfe6ff]" />
            </div>
            <h3 className="font-urbanist text-xl font-semibold text-white mb-3">Purchase Complete!</h3>
            <p className="text-white/80 font-inter mb-8 max-w-md mx-auto">
              Your domains have been registered and will be transferred to your wallet shortly.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Button 
                className="btn-shimmer bg-[#473dc6] hover:bg-[#5c51e6] text-white shadow-glow hover:shadow-glow-hover transition-all duration-300 font-urbanist"
                onClick={() => router.push('/claim')}
              >
                Search More Domains
              </Button>
              <Button 
                className="btn-shimmer bg-[#150e60] hover:bg-[#1f1670] text-white shadow-glow hover:shadow-glow-hover transition-all duration-300 font-urbanist"
                onClick={() => router.push('/domains/status')}
              >
                View My Domains
              </Button>
            </div>
          </motion.div>
        ) : partialSuccess ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-[#473dc6]/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-10 w-10 text-[#caa3d6]" />
            </div>
            <h3 className="font-urbanist text-xl font-semibold text-white mb-3">Partial Success</h3>
            <p className="text-white/80 font-inter mb-4 max-w-md mx-auto">
              Some domains were successfully registered, but others could not be processed.
            </p>
            
            <div className="mb-4 max-w-md mx-auto">
              <h4 className="text-[#cfe6ff] font-medium mb-2">Successful Domains:</h4>
              <ul className="text-white/80">
                {successfulDomains.map(domain => (
                  <li key={domain}>{domain}</li>
                ))}
              </ul>
            </div>
            
            <div className="mb-6 max-w-md mx-auto">
              <h4 className="text-[#caa3d6] font-medium mb-2">Failed Domains:</h4>
              <ul className="text-white/80">
                {failedDomains.map(domain => (
                  <li key={domain}>{domain}</li>
                ))}
              </ul>
            </div>
            
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Button 
                className="btn-shimmer bg-[#473dc6] hover:bg-[#5c51e6] text-white shadow-glow hover:shadow-glow-hover transition-all duration-300 font-urbanist"
                onClick={() => router.push('/claim')}
              >
                Search More Domains
              </Button>
              <Button 
                className="btn-shimmer bg-[#150e60] hover:bg-[#1f1670] text-white shadow-glow hover:shadow-glow-hover transition-all duration-300 font-urbanist"
                onClick={() => router.push('/domains/status')}
              >
                View My Domains
              </Button>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="mb-8">
              <div className="flex justify-between items-center p-4 bg-[#1b1653] rounded-lg mb-6 border border-[#473dc6]/30">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-[#caa3d6]" />
                  <span className="text-white/80 font-inter">Time remaining to complete checkout:</span>
                </div>
                <span className="font-urbanist font-bold text-[#cfe6ff]">{formatTime(timeLeft)}</span>
              </div>
              
              <h3 className="font-urbanist text-lg font-semibold text-white mb-4">Order Summary</h3>
              <div className="space-y-3 mb-6 bg-[#1b1653] rounded-lg border border-[#473dc6]/30 p-4">
                {items.map((item) => (
                  <div 
                    key={item.suggestion.name} 
                    className="flex justify-between items-center p-3 border-b border-[#473dc6]/20"
                  >
                    <span className="font-urbanist text-white">{item.suggestion.name}</span>
                    <span className="text-[#cfe6ff] font-inter">{formatPrice(item.suggestion.price?.listPrice?.usdCents || 0)}</span>
                  </div>
                ))}
                
                <div className="flex justify-between items-center pt-3 text-lg font-semibold">
                  <span className="text-white/80 font-inter">Total</span>
                  <span className="font-urbanist text-[#cfe6ff]">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
            
            {/* Domain Delivery - Add Wallet Connect Button */}
            <div className="mb-8">
              <h3 className="font-urbanist text-lg font-semibold text-white mb-4">Domain Delivery</h3>
              <div className="p-4 bg-[#1b1653] border border-[#473dc6]/40 rounded-lg">
                <div className="flex items-start">
                  <ShieldCheck className="h-5 w-5 text-[#caa3d6] mt-0.5 mr-3 flex-shrink-0" />
                  <div className="w-full">
                    <p className="font-urbanist font-medium text-white mb-1">Wallet Address</p>
                    
                    {!user?.wallet_address ? (
                      <div className="space-y-4">
                        <p className="text-red-400 font-inter">No wallet connected</p>
                        <Button
                          onClick={handleShowWalletModal}
                          className="w-full btn-shimmer bg-[#473dc6] hover:bg-[#5c51e6] text-white py-2 rounded-lg shadow-glow hover:shadow-glow-hover transition-all duration-300"
                        >
                          Connect Wallet to Continue
                        </Button>
                      </div>
                    ) : (
                      <>
                        <p className="text-[#cfe6ff]/80 break-all font-mono text-sm">
                          {user.wallet_address}
                        </p>
                        <p className="text-white/60 text-xs mt-2">
                          Connected as: <span className="text-[#cfe6ff]">{user.sub}</span>
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Payment Section - Only show when wallet is connected */}
            {user?.wallet_address && (
              <div className="mb-8">
                <h3 className="font-urbanist text-lg font-semibold text-white mb-4">Payment Information</h3>
                <div className="p-4 bg-[#1b1653] border border-[#473dc6]/40 rounded-lg">
                  <StripeCheckoutForm 
                    amount={total} 
                    onSuccess={handlePaymentSuccess} 
                    onError={handlePaymentError}
                    domainNames={items.map(item => item.suggestion.name)}
                  />
                </div>
              </div>
            )}
            
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-lg">
                <p className="text-red-400 font-inter">{error}</p>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Wallet Connection Modal */}
      <WalletConnectModal 
        isOpen={showWalletModal} 
        onClose={() => setShowWalletModal(false)}
        onSuccess={handleWalletSuccess}
      />
    </div>
  );
}