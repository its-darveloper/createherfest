// app/api/retry-transfer/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_UD_API_URL || 'https://api.ud-sandbox.com/partner/v3';
const API_KEY = process.env.UD_API_KEY;
const MAX_RETRIES = 3;

export async function POST(request: NextRequest) {
  try {
    const { domainName, walletAddress } = await request.json();
    
    if (!domainName || !walletAddress) {
      console.error('Missing required fields:', { domainName, walletAddress });
      return NextResponse.json({ 
        error: { message: 'Domain name and wallet address are required' } 
      }, { status: 400 });
    }
    
    // Normalize wallet address format
    const normalizedWalletAddress = walletAddress.toLowerCase();
    
    console.log(`Retry transfer for domain ${domainName} to wallet ${normalizedWalletAddress}`);
    
    // Check if domain exists and is owned by us
    try {
      console.log(`Checking ownership for domain ${domainName}...`);
      const domainCheck = await axios.get(
        `${API_BASE_URL}/domains/${domainName}`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`
          }
        }
      );
      
      console.log('Domain owner:', domainCheck.data.owner);
      const isOwned = domainCheck.data.owner?.type === 'ME';
      
      if (!isOwned) {
        console.error(`Domain ${domainName} is not owned by this account. Owner:`, domainCheck.data.owner);
        return NextResponse.json({ 
          success: false,
          message: `Domain ${domainName} is not owned by this account`,
          owner: domainCheck.data.owner
        }, { status: 400 });
      }
      
      // Add a delay to ensure all blockchain transactions are processed
      console.log('Waiting 3 seconds before attempting transfer...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Domain exists and is owned by us, retry the transfer with retry logic
      let retries = 0;
      let lastError = null;
      
      while (retries < MAX_RETRIES) {
        try {
          console.log(`Transfer attempt ${retries + 1}/${MAX_RETRIES}...`);
          
          const response = await axios.patch(
            `${API_BASE_URL}/domains/${domainName}`,
            {
              owner: {
                type: 'USER',
                address: normalizedWalletAddress
              }
            },
            {
              headers: {
                Authorization: `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          console.log(`Domain ${domainName} transfer retry initiated:`, response.data);
          
          return NextResponse.json({
            success: true,
            message: `Domain ${domainName} transfer retry initiated`,
            operation: response.data.operation
          });
        } catch (error: any) {
          lastError = error;
          retries++;
          console.error(`Transfer attempt ${retries}/${MAX_RETRIES} failed:`, error.message);
          
          if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
          }
          
          if (retries < MAX_RETRIES) {
            // Wait with exponential backoff before retrying
            const delay = 1000 * Math.pow(2, retries);
            console.log(`Waiting ${delay}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
      
      // If we get here, all retries failed
      console.error(`All ${MAX_RETRIES} transfer attempts failed.`);
      
      return NextResponse.json({ 
        success: false,
        message: `Failed to transfer domain ${domainName} after ${MAX_RETRIES} attempts`,
        error: lastError.response?.data || lastError.message,
        details: lastError.response?.data
      }, { status: 500 });
      
    } catch (error: any) {
      console.error(`Error checking domain ${domainName}:`, error.message);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      
      if (error.response?.status === 404) {
        return NextResponse.json({ 
          success: false,
          message: `Domain ${domainName} not found` 
        }, { status: 404 });
      }
      
      return NextResponse.json({ 
        success: false,
        error: error.response?.data || error.message,
        details: error.response?.data
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error in domain transfer process:', error.message);
    
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}