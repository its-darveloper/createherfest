// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get('stripe-signature')!;
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
  
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handleSuccessfulPayment(paymentIntent);
      break;
    }
    
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handleFailedPayment(paymentIntent);
      break;
    }
    
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
  
  return NextResponse.json({ received: true });
}

async function handleSuccessfulPayment(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Extract domain information from metadata
    const domains = JSON.parse(paymentIntent.metadata.domains || '[]');
    
    // In a real implementation, you would:
    // 1. Register the domains if not already registered
    // 2. Transfer the domains to the user's wallet
    // 3. Update your database with the completed order
    
    console.log(`Payment succeeded for domains: ${domains.join(', ')}`);
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
}

async function handleFailedPayment(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Extract domain information from metadata
    const domains = JSON.parse(paymentIntent.metadata.domains || '[]');
    
    // In a real implementation, you would:
    // 1. Return any reserved domains
    // 2. Update your database with the failed order
    
    console.log(`Payment failed for domains: ${domains.join(', ')}`);
  } catch (error) {
    console.error('Error handling failed payment:', error);
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};