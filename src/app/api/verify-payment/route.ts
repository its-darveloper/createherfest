// app/api/verify-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, clientSecret } = await request.json();
    
    // Verify the payment intent exists and matches the client secret
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.client_secret !== clientSecret) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid client secret'
      }, { status: 400 });
    }
    
    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json({ 
        success: false, 
        error: `Payment not successful (status: ${paymentIntent.status})`
      }, { status: 400 });
    }
    
    // Extract domain information from metadata
    const domains = JSON.parse(paymentIntent.metadata.domains || '[]');
    
    // Process domains (in a real implementation, you would handle domain registration here)
    
    return NextResponse.json({
      success: true,
      paymentIntent: {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        status: paymentIntent.status,
      },
      domains
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to verify payment' 
    }, { status: 500 });
  }
}