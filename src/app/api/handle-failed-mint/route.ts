// app/api/handle-failed-mint/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import Stripe from 'stripe';

const API_BASE_URL = process.env.NEXT_PUBLIC_UD_API_URL || 'https://api.ud-sandbox.com/partner/v3';
const API_KEY = process.env.UD_API_KEY;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY as string;

// Initialize Stripe
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const { domainName, operationId, paymentIntentId } = await request.json();
    
    if (!domainName || !operationId) {
      return NextResponse.json({ 
        error: { message: 'Domain name and operation ID are required' } 
      }, { status: 400 });
    }
    
    console.log(`Handling failed mint for domain ${domainName}, operation ${operationId}`);
    
    // First check the operation status to confirm it's failed
    try {
      const operationCheck = await axios.get(
        `${API_BASE_URL}/operations/${operationId}`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`
          }
        }
      );
      
      if (operationCheck.data.status !== 'FAILED') {
        console.log(`Operation ${operationId} status is ${operationCheck.data.status}, not FAILED. No action needed.`);
        return NextResponse.json({
          success: false,
          message: `Domain operation is not in FAILED state, it's ${operationCheck.data.status}`,
          status: operationCheck.data.status
        });
      }
      
      console.log(`Confirmed operation ${operationId} is in FAILED state, proceeding to return domain`);
      
      // Check if domain exists and is still owned by us
      const domainCheck = await axios.get(
        `${API_BASE_URL}/domains/${domainName}`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`
          }
        }
      );
      
      const isOwned = domainCheck.data.owner?.type === 'ME';
      let domainReturned = false;
      
      // Return domain if we own it
      if (isOwned) {
        try {
          const returnResponse = await axios.post(
            `${API_BASE_URL}/domains/${domainName}/return`,
            {},
            {
              headers: {
                Authorization: `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          console.log(`Domain ${domainName} return initiated:`, returnResponse.data);
          domainReturned = true;
        } catch (returnError: any) {
          console.error(`Error returning domain ${domainName}:`, returnError.message);
          // Continue with refund even if return fails
        }
      } else {
        console.log(`Domain ${domainName} is not owned by this account. May have been returned already.`);
      }
      
      // Process refund if payment intent ID provided
      let refundResult = null;
      if (paymentIntentId) {
        try {
          console.log(`Processing refund for payment intent ${paymentIntentId}`);
          
          // Get the payment intent to verify it exists and is charged
          const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
          
          if (paymentIntent.status === 'succeeded') {
            // Create a refund
            const refund = await stripe.refunds.create({
              payment_intent: paymentIntentId,
              reason: 'requested_by_customer',
              metadata: {
                domain: domainName,
                reason: 'Failed domain registration',
                operationId: operationId
              }
            });
            
            console.log(`Refund processed successfully:`, refund.id);
            refundResult = {
              success: true,
              refundId: refund.id,
              status: refund.status
            };
          } else {
            console.log(`Payment intent ${paymentIntentId} is not in succeeded state, cannot refund`);
            refundResult = {
              success: false,
              message: `Payment intent ${paymentIntentId} is in ${paymentIntent.status} state, cannot refund`
            };
          }
        } catch (stripeError: any) {
          console.error(`Error processing refund:`, stripeError.message);
          refundResult = {
            success: false,
            message: stripeError.message
          };
        }
      } else {
        console.log('No payment intent ID provided, skipping refund');
      }
      
      return NextResponse.json({
        success: true,
        message: `Failed mint for ${domainName} handled`,
        domainReturned: domainReturned,
        refund: refundResult
      });
      
    } catch (error: any) {
      console.error(`Error handling failed mint for ${domainName}:`, error.message);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      
      return NextResponse.json({ 
        success: false,
        message: `Failed to handle failed mint for ${domainName}`,
        error: error.response?.data || error.message
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error in failed mint handler:', error.message);
    
    return NextResponse.json({ 
      success: false,
      message: 'Failed to process failed mint',
      error: error.message
    }, { status: 500 });
  }
}