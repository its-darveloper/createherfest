// app/claim/success/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useCart } from '@/app/context/CartContext';

export default function SuccessPage() {
  const router = useRouter();
  const { clearCart } = useCart();
  const [countdown, setCountdown] = useState(5);
  
  useEffect(() => {
    // Clear the cart
    clearCart();
    
    // Redirect to domain status page after countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/domains/status');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [router, clearCart]);
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#150e60] rounded-xl p-8 border border-[#473dc6]/40 shadow-glow text-center"
      >
        <div className="w-20 h-20 bg-[#473dc6]/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-[#cfe6ff]" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-4">Payment Successful!</h1>
        
        <p className="text-white/80 mb-6 max-w-md mx-auto">
          Your payment has been processed successfully. Your domains are now being registered and will be transferred to your wallet shortly.
        </p>
        
        <p className="text-white/60 mb-8">
          Redirecting to your domain status page in {countdown} seconds...
        </p>
        
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => router.push('/domains/status')}
            className="bg-[#473dc6] hover:bg-[#5c51e6] text-white"
          >
            View My Domains
          </Button>
          
          <Button
            onClick={() => router.push('/claim')}
            className="bg-[#1b1653] hover:bg-[#242060] text-white"
          >
            Search More Domains
          </Button>
        </div>
      </motion.div>
    </div>
  );
}