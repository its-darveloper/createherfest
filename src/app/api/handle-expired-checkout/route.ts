// src/app/api/handle-expired-checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_UD_API_URL || 'https://api.ud-sandbox.com/partner/v3';
const API_KEY = process.env.UD_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { domains } = await request.json();
    
    if (!domains || !domains.length) {
      return NextResponse.json({ 
        success: false,
        error: { message: 'Domains are required' } 
      }, { status: 400 });
    }
    
    console.log(`Handling expired checkout for domains:`, domains);
    
    const results = [];
    
    for (const domain of domains) {
      try {
        // Check if we own the domain
        const domainResponse = await axios.get(
          `${API_BASE_URL}/domains/${domain.name}`,
          {
            headers: {
              Authorization: `Bearer ${API_KEY}`
            }
          }
        );
        
        if (domainResponse.data.owner?.type === 'ME') {
          // Return the domain to Unstoppable
          const returnResponse = await axios.post(
            `${API_BASE_URL}/domains/${domain.name}/return`,
            {},
            {
              headers: {
                Authorization: `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          console.log(`Domain ${domain.name} return initiated:`, returnResponse.data);
          
          // Update operation tracking
          await axios.post('/api/store-operation', {
            domain: domain.name,
            operationId: returnResponse.data.operation.id,
            status: 'PENDING',
            isReturn: true
          });
          
          results.push({
            domain: domain.name,
            success: true,
            message: `Domain ${domain.name} has been returned`,
            operation: returnResponse.data.operation
          });
        } else {
          // Domain not owned by us, nothing to do
          results.push({
            domain: domain.name,
            success: true,
            message: `Domain ${domain.name} is not owned by us, no action needed`
          });
        }
      } catch (error: any) {
        console.error(`Error handling expired checkout for domain ${domain.name}:`, error);
        
        results.push({
          domain: domain.name,
          success: false,
          message: `Failed to handle expired checkout for domain ${domain.name}`,
          error: error.response?.data || error.message
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      results
    });
  } catch (error: any) {
    console.error('Error handling expired checkout:', error);
    
    return NextResponse.json({ 
      success: false,
      error: { 
        message: 'Failed to handle expired checkout', 
        details: error.message 
      } 
    }, { status: 500 });
  }
}