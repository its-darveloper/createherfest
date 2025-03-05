// components/domain/DomainCart.tsx

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2, ShoppingCart, CreditCard, AlertCircle } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function DomainCart({ onProceedToCheckout }: { onProceedToCheckout: () => void }) {
  const { items, removeItem, clearCart, total } = useCart();
  const { user, login } = useAuth();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(false);
  console.log('Cart items in DomainCart component:', items);
  
  // Format price from cents to dollars
  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };
  
  // Check domain availability periodically
  useEffect(() => {
    const checkAvailability = async () => {
      // In a real implementation, we would check availability with the API
      // For now, we'll just simulate it
      setIsChecking(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsChecking(false);
    };
    
    if (items.length > 0) {
      checkAvailability();
      
      // Set up interval to check every minute
      const interval = setInterval(checkAvailability, 60000);
      return () => clearInterval(interval);
    }
  }, [items]);
  
  const handleRemoveItem = (domainName: string) => {
    removeItem(domainName);
    toast({
      title: "Removed from cart",
      description: `${domainName} has been removed from your cart`,
      duration: 3000
    });
  };
  
  const handleClearCart = () => {
    clearCart();
    toast({
      title: "Cart cleared",
      description: "All domains have been removed from your cart",
      duration: 3000
    });
  };
  
  const handleProceedToCheckout = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please connect your wallet to proceed to checkout",
        variant: "destructive",
        duration: 5000
      });
      return;
    }
    
    onProceedToCheckout();
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
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          )}
        </div>
        
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
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Proceed to Checkout
              </Button>
              
              {!user && (
                <div className="p-4 bg-[#1b1653] border border-[#caa3d6]/40 rounded-lg text-white/80 font-inter flex items-start">
                  <AlertCircle className="h-5 w-5 text-[#caa3d6] mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="mb-3">You need to connect your wallet before checkout to receive your domain.</p>
                    <Button 
                      variant="outline" 
                      className="border-[#473dc6] text-[#cfe6ff] hover:bg-[#473dc6]/20 font-urbanist"
                      onClick={login}
                    >
                      Connect Wallet
                    </Button>
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