// components/domain/StripeCheckoutForm.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Load Stripe outside of component to avoid recreating Stripe object
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ 
  onSuccess, 
  onError 
}: { 
  onSuccess: () => void; 
  onError: (error: string) => void; 
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    // Confirm payment
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/claim/success`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message || 'An unexpected error occurred');
      onError(error.message || 'Payment failed');
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess();
    } else {
      setErrorMessage('Payment status unhandled. Please try again.');
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {errorMessage && (
        <div className="p-4 bg-red-500/20 border border-red-500/40 rounded-lg">
          <p className="text-red-400 font-inter">{errorMessage}</p>
        </div>
      )}
      
      <Button 
        type="submit"
        className="w-full btn-shimmer bg-[#473dc6] hover:bg-[#5c51e6] text-white py-6 text-lg shadow-glow hover:shadow-glow-hover transition-all duration-300 font-urbanist"
        disabled={isProcessing || !stripe || !elements}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          'Pay Now'
        )}
      </Button>
    </form>
  );
}

export default function StripeCheckoutForm({ 
  amount, 
  onSuccess, 
  onError,
  domainNames 
}: { 
  amount: number; 
  onSuccess: () => void; 
  onError: (error: string) => void;
  domainNames: string[];
}) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  // Create payment intent only once
  useEffect(() => {
    // Prevent creating multiple payment intents
    if (clientSecret || isInitializing) return;
    
    const createPaymentIntent = async () => {
      try {
        setIsInitializing(true);
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            amount, 
            domainNames
          }),
        });
        
        const data = await response.json();
        
        if (data.error) {
          onError(data.error);
          return;
        }
        
        setClientSecret(data.clientSecret);
      } catch (err: any) {
        onError(err.message || 'Failed to initialize payment');
      } finally {
        setIsInitializing(false);
      }
    };
    
    createPaymentIntent();
  }, [amount, domainNames, onError, clientSecret, isInitializing]);

  return (
    <div>
      {clientSecret ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm onSuccess={onSuccess} onError={onError} />
        </Elements>
      ) : (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-[#caa3d6]" />
          <p className="ml-2 text-white/70 font-inter">Initializing payment...</p>
        </div>
      )}
    </div>
  );
}