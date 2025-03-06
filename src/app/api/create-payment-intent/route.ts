// src/app/api/create-payment-intent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const { amount, domainNames, checkoutStartTime } = await request.json();
    
    if (!amount) {
      return NextResponse.json(
        { error: 'Amount is required' },
        { status: 400 }
      );
    }
    
    // Validate checkout hasn't expired
    if (checkoutStartTime) {
      const now = Date.now();
      const checkoutExpirationTime = checkoutStartTime + (2 * 60 * 1000); // 2 minutes
      
      if (now > checkoutExpirationTime) {
        return NextResponse.json(
          { error: 'Checkout session has expired' },
          { status: 400 }
        );
      }
    }
    
    console.log('Creating payment intent for amount:', amount, 'domains:', domainNames);
    
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency: 'usd',
      metadata: {
        domains: JSON.stringify(domainNames || []), // Store domain names in metadata
        checkoutStartTime: checkoutStartTime ? checkoutStartTime.toString() : undefined
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}