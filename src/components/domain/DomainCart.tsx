// components/domain/DomainCart.tsx (enhanced error handling)
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2, ShoppingCart, CreditCard, AlertCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import axios from 'axios';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function DomainCart({ onProceedToCheckout }: { onProceedToCheckout: () => void }) {
  const { items, removeItem, clearCart, total, updateItemAvailability } = useCart();
  const { user, login } = useAuth();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(false);
  const [isReserving, setIsReserving] = useState(false);
  const [hasReserved, setHasReserved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reservationError, setReservationError] = useState<string | null>(null);
  
  // Format price from cents to dollars
  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };
  
  // Check domain availability periodically
  const checkAvailability = useCallback(async () => {
    if (items.length === 0) return;
    
    setIsChecking(true);
    try {
      console.log('Checking availability for domains:', items.map(item => item.suggestion.name));
      const response = await axios.post('/api/availability', {
        domains: items.map(item => item.suggestion.name)
      });
      
      console.log('Availability response:', response.data);
      
      if (response.data.items && Array.isArray(response.data.items)) {
        // Update cart items with current availability
        const availabilityMap = new Map(
          response.data.items.map((result: any) => [
            result.name,
            result.availability?.status === 'AVAILABLE'
          ])
        );
        
        // For each cart item, update availability
        items.forEach(item => {
          const isAvailable = availabilityMap.get(item.suggestion.name);
          // Only update if we have a definitive answer
          if (isAvailable !== undefined) {
            updateItemAvailability(item.suggestion.name, Boolean(isAvailable));
            
            if (!isAvailable) {
              toast({
                title: "Domain no longer available",
                description: `${item.suggestion.name} is no longer available and will be removed from your cart`,
                variant: "destructive",
                duration: 5000
              });
              
              // Remove unavailable item after a short delay to allow toast to be seen
              setTimeout(() => {
                removeItem(item.suggestion.name);
              }, 2000);
            }
          }
        });
      } else if (response.data.error) {
        console.error('Availability check error:', response.data.error);
        // Only show toast on first error, not on every check
        if (!error) {
          setError('There was a problem checking domain availability. Some domains might not be available.');
        }
      }
    } catch (error) {
      console.error('Error checking domain availability:', error);
      setError('There was a problem checking domain availability. Please try refreshing.');
    } finally {
      setIsChecking(false);
    }
  }, [items, updateItemAvailability, toast, removeItem, error]);
  
  // Initial availability check
  useEffect(() => {
    const checkAvailability = async () => {
      if (items.length === 0) return;
      
      setIsChecking(true);
      try {
        // Actually check availability with API
        const domainNames = items.map(item => item.suggestion.name);
        const response = await axios.post('/api/availability', { 
          domains: domainNames,
          _nocache: Date.now() // Force fresh request
        });
        
        // Update availability status for each domain
        if (response.data && response.data.items) {
          response.data.items.forEach(item => {
            const isAvailable = item.availability?.status === 'AVAILABLE';
            updateItemAvailability(item.name, isAvailable);
          });
        }
      } catch (error) {
        console.error('Error checking domain availability:', error);
      } finally {
        setIsChecking(false);
      }
    };
    
    // Check immediately when cart contents change
    if (items.length > 0) {
      checkAvailability();
      
      // Then check periodically every 30 seconds
      const interval = setInterval(checkAvailability, 30000);
      return () => clearInterval(interval);
    }
  }, [items, updateItemAvailability]);
  
  // Clear reservations when user navigates away or component unmounts
  useEffect(() => {
    return () => {
      if (hasReserved && user?.wallet_address) {
        // Release any domain reservations
        items.forEach(async (item) => {
          try {
            await axios.delete('/api/reserve-domain', {
              data: {
                domainName: item.suggestion.name,
                userId: user.wallet_address
              }
            });
            console.log(`Released reservation for ${item.suggestion.name}`);
          } catch (err) {
            console.error(`Failed to release reservation for ${item.suggestion.name}:`, err);
          }
        });
      }
    };
  }, [hasReserved, items, user?.wallet_address]);
  
  const handleRemoveItem = (domainName: string) => {
    // If the domain was reserved, release the reservation
    if (hasReserved && user?.wallet_address) {
      axios.delete('/api/reserve-domain', {
        data: {
          domainName,
          userId: user.wallet_address
        }
      }).catch(err => {
        console.error(`Failed to release reservation for ${domainName}:`, err);
      });
    }
    
    removeItem(domainName);
    toast({
      title: "Removed from cart",
      description: `${domainName} has been removed from your cart`,
      duration: 3000
    });
  };
  
  const handleClearCart = () => {
    // Release all reservations if any
    if (hasReserved && user?.wallet_address) {
      items.forEach(async (item) => {
        try {
          await axios.delete('/api/reserve-domain', {
            data: {
              domainName: item.suggestion.name,
              userId: user.wallet_address
            }
          });
        } catch (err) {
          console.error(`Failed to release reservation for ${item.suggestion.name}:`, err);
        }
      });
      setHasReserved(false);
    }
    
    clearCart();
    toast({
      title: "Cart cleared",
      description: "All domains have been removed from your cart",
      duration: 3000
    });
  };
  
  const verifyReservations = async () => {
    const failedReservations: string[] = [];
    
    for (const item of items) {
      try {
        const response = await axios.get(
          `/api/reserve-domain?domain=${item.suggestion.name}&userId=${user?.wallet_address}`
        );
        
        if (!response.data.reserved || !response.data.ownReservation) {
          failedReservations.push(item.suggestion.name);
        }
      } catch (error) {
        console.error(`Error verifying reservation for ${item.suggestion.name}:`, error);
        failedReservations.push(item.suggestion.name);
      }
    }
    
    return failedReservations;
  };
  
  const handleProceedToCheckout = async () => {
    setReservationError(null);
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please connect your wallet to proceed to checkout",
        variant: "destructive",
        duration: 5000
      });
      return;
    }
    
    // Verify all domains are still available
    const unavailableDomains = items.filter(item => !item.available);
    if (unavailableDomains.length > 0) {
      toast({
        title: "Unavailable domains",
        description: `Some domains in your cart are no longer available: ${unavailableDomains.map(d => d.suggestion.name).join(', ')}`,
        variant: "destructive",
        duration: 5000
      });
      
      // Remove unavailable domains from cart
      unavailableDomains.forEach(item => {
        removeItem(item.suggestion.name);
      });
      
      if (items.length === unavailableDomains.length) {
        return; // No domains left to checkout
      }
    }
    
    // Reserve domains before proceeding to checkout
    setIsReserving(true);
    
    try {
      const reservationPromises = items.map(item => 
        axios.post('/api/reserve-domain', {
          domainName: item.suggestion.name,
          userId: user.wallet_address
        })
      );
      
      const results = await Promise.allSettled(reservationPromises);
      
      // Check if any reservations failed
      const failedReservations = results
        .map((result, index) => ({ 
          result, 
          domain: items[index].suggestion.name 
        }))
        .filter(({ result }) => result.status === 'rejected' || 
                               (result.status === 'fulfilled' && !result.value.data.success));
      
      if (failedReservations.length > 0) {
        const failedDomains = failedReservations.map(({ domain }) => domain);
        
        toast({
          title: "Reservation failed",
          description: `Could not reserve some domains: ${failedDomains.join(', ')}. They may have been claimed by someone else.`,
          variant: "destructive",
          duration: 5000
        });
        
        // Remove failed domains from cart
        failedDomains.forEach(domain => {
          removeItem(domain);
        });
        
        await checkAvailability();
        
        if (items.length === 0) {
          return; // No domains left to checkout
        }
      }
      
      // Double check that reservations are in place
      const failedVerifications = await verifyReservations();
      
      if (failedVerifications.length > 0) {
        setReservationError(`Some domains aren't properly reserved: ${failedVerifications.join(', ')}. Please try again.`);
        
        // Try to release any failed reservations
        for (const domain of failedVerifications) {
          try {
            await axios.delete('/api/reserve-domain', {
              data: {
                domainName: domain,
                userId: user.wallet_address
              }
            });
          } catch (error) {
            console.error(`Failed to release reservation for ${domain}:`, error);
          }
        }
        
        setIsReserving(false);
        return;
      }
      
      setHasReserved(true);
      onProceedToCheckout();
    } catch (error) {
      console.error('Error reserving domains:', error);
      toast({
        title: "Reservation error",
        description: "There was an error reserving your domains. Please try again.",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setIsReserving(false);
    }
  };

  const handleRetryAvailabilityCheck = () => {
    setError(null);
    checkAvailability();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="shimmer-container bg-[#150e60] rounded-xl p-6 border border-[#473dc6]/40 shadow-glow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-urbanist text-subtitle-md text-white">Your Domain Cart</h2>
          {items.length > 0 && (
            <Button 
              variant="outline" 
              className="border-red-500/70 text-red-400 hover:bg-red-500/10 hover:border-red-500" 
              onClick={handleClearCart}
              disabled={isReserving}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          )}
        </div>
        
        {error && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg mb-4 flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-yellow-500">{error}</p>
              <Button 
                variant="link" 
                size="sm" 
                className="text-yellow-500 p-0 h-auto mt-1"
                onClick={handleRetryAvailabilityCheck}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry Check
              </Button>
            </div>
          </div>
        )}
        
        {reservationError && (
          <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg mb-4">
            <p className="text-red-400">{reservationError}</p>
          </div>
        )}
        
        {items.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[#473dc6]/30 rounded-lg bg-[#1b1653]">
            <ShoppingCart className="h-16 w-16 mx-auto text-[#cfe6ff]/30 mb-4" />
            <p className="text-white/70 font-inter mb-4">Your cart is empty</p>
            <Link href="/claim">
              <Button className="btn-shimmer bg-[#473dc6] hover:bg-[#5c51e6] text-white shadow-glow hover:shadow-glow-hover transition-all duration-300 font-urbanist">
                Search for Domains
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8 max-h-96 overflow-y-auto custom-scrollbar pr-2">
              {items.map((item, index) => (
                <motion.div 
                  key={item.suggestion.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="shimmer-container"
                >
                  <div className="flex justify-between items-center p-4 bg-[#1b1653] border border-[#473dc6]/40 hover:border-[#caa3d6]/70 rounded-xl transition-all duration-300">
                    <div>
                      <p className="font-urbanist font-semibold text-lg text-white">{item.suggestion.name}</p>
                      <p className="text-[#cfe6ff] font-inter">{formatPrice(item.suggestion.price?.listPrice?.usdCents || 0)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {isChecking ? (
                        <Loader2 className="h-5 w-5 animate-spin text-[#caa3d6]" />
                      ) : item.available ? (
                        <span className="text-green-400 text-sm font-inter px-2 py-1 bg-green-500/10 rounded-full">Available</span>
                      ) : (
                        <span className="text-red-400 text-sm font-inter px-2 py-1 bg-red-500/10 rounded-full">Unavailable</span>
                      )}
                      <Button 
                        variant="ghost" 
                        className="text-red-400 hover:bg-red-500/10 rounded-full w-8 h-8 p-0"
                        onClick={() => handleRemoveItem(item.suggestion.name)}
                        aria-label={`Remove ${item.suggestion.name}`}
                        disabled={isReserving}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="border-t border-[#473dc6]/30 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-white/80 font-inter text-lg">Total</span>
                <span className="font-urbanist font-semibold text-xl text-[#cfe6ff]">{formatPrice(total)}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <Button 
                className="w-full btn-shimmer bg-[#473dc6] hover:bg-[#5c51e6] text-white py-6 text-lg shadow-glow hover:shadow-glow-hover transition-all duration-300 font-urbanist"
                onClick={handleProceedToCheckout}
                disabled={isReserving || isChecking || items.length === 0 || items.some(item => !item.available)}
              >
                {isReserving ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Reserving Domains...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Proceed to Checkout
                  </>
                )}
              </Button>
              
              {!user && (
                <div className="p-4 bg-[#1b1653] border border-[#caa3d6]/40 rounded-lg text-white/80 font-inter flex items-start">
                  <AlertCircle className="h-5 w-5 text-[#caa3d6] mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="mb-3">You need to connect your wallet before checkout to receive your domain.</p>
                    <Button 
  variant="outline" 
  className="border-[#473dc6] text-[#cfe6ff] hover:bg-[#473dc6]/20 font-urbanist"
  onClick={(e) => login()}
>
  Connect Wallet
</Button>
                  </div>
                </div>
              )}
              
              {items.some(item => !item.available) && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 font-inter flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p>Some domains in your cart are no longer available. Please remove them to continue.</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Cart benefit callout */}
      {items.length > 0 && (
        <div className="mt-8 p-5 bg-[#1b1653]/80 border border-[#473dc6]/30 rounded-lg shadow-glow">
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-[#473dc6]/20 flex items-center justify-center mr-4 flex-shrink-0">
              <svg className="w-5 h-5 text-[#cfe6ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-urbanist font-semibold text-white mb-1">Your domains are reserved for 15 minutes</h3>
              <p className="text-white/70 font-inter text-sm">Complete checkout to secure your .her domains. Your selection is temporarily reserved, but others can claim them if checkout isn't completed.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}