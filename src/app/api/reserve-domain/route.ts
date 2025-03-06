// src/app/api/reserve-domains/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_UD_API_URL || 'https://api.ud-sandbox.com/partner/v3';
const API_KEY = process.env.UD_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { domains, walletAddress } = await request.json();
    
    if (!domains || !domains.length) {
      return NextResponse.json({ 
        success: false,
        error: { message: 'Domain names are required' } 
      }, { status: 400 });
    }
    
    console.log(`Attempting to reserve domains:`, domains);
    
    // Process domains one by one to reserve them
    const results = [];
    let allSuccessful = true;
    
    for (const domainName of domains) {
      try {
        console.log(`Checking availability for ${domainName}...`);
        
        // Check if domain is still available
        const availabilityCheck = await axios.get(
          `${API_BASE_URL}/domains/${domainName}`,
          {
            headers: {
              Authorization: `Bearer ${API_KEY}`
            }
          }
        );
        
        if (availabilityCheck.data.availability?.status === 'AVAILABLE' || 
            availabilityCheck.data.owner?.type === 'NONE') {
          console.log(`Domain ${domainName} is available, reserving...`);
          
          // Register domain to the partner account (reserve it)
          const reservationResponse = await axios.post(
            `${API_BASE_URL}/domains`,
            { name: domainName },
            {
              headers: {
                Authorization: `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          console.log(`Domain ${domainName} reservation initiated:`, reservationResponse.data);
          
          // Store operation data
          await axios.post('/api/store-operation', {
            domain: domainName,
            operationId: reservationResponse.data.operation.id,
            status: 'PENDING',
            walletAddress,
            needsTransfer: true,
            isReservation: true
          });
          
          results.push({
            domain: domainName,
            success: true,
            message: `Domain ${domainName} has been reserved`,
            operation: reservationResponse.data.operation
          });
        } else if (availabilityCheck.data.owner?.type === 'ME') {
          // We already own this domain, it's already reserved
          console.log(`Domain ${domainName} is already reserved by us`);
          
          results.push({
            domain: domainName,
            success: true,
            message: `Domain ${domainName} was already reserved`,
            alreadyReserved: true
          });
        } else {
          // Domain is not available
          console.log(`Domain ${domainName} is not available`);
          
          results.push({
            domain: domainName,
            success: false,
            message: `Domain ${domainName} is no longer available`,
            error: { code: 'DOMAIN_UNAVAILABLE' }
          });
          
          allSuccessful = false;
        }
      } catch (error: any) {
        console.error(`Error reserving domain ${domainName}:`, error);
        
        results.push({
          domain: domainName,
          success: false,
          message: `Failed to reserve domain ${domainName}`,
          error: error.response?.data || error.message
        });
        
        allSuccessful = false;
      }
    }
    
    return NextResponse.json({
      success: allSuccessful,
      results
    });
  } catch (error: any) {
    console.error('Error in domain reservation process:', error);
    
    return NextResponse.json({ 
      success: false,
      error: { 
        message: 'Failed to reserve domains', 
        details: error.message 
      } 
    }, { status: 500 });
  }
}