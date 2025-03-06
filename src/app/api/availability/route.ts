// app/api/availability/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_UD_API_URL || 'https://api.ud-sandbox.com/partner/v3';
const API_KEY = process.env.UD_API_KEY;

export async function POST(request: Request) {
  const body = await request.json();
  const domains = body.domains;

  if (!domains || !domains.length) {
    return NextResponse.json({ items: [] });
  }

  try {
    console.log('Checking availability for domains:', domains);
    
    // Try individual domain lookups instead of batch
    const results = [];
    
    for (const domain of domains) {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/domains/${domain}`,
          {
            headers: {
              Authorization: `Bearer ${API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        results.push({
          name: domain,
          availability: response.data.availability || { status: 'UNKNOWN' }
        });
      } catch (domainError) {
        console.log(`Error checking domain ${domain}:`, domainError.message);
        
        // If domain not found, assume it's available
        if (domainError.response?.status === 404) {
          results.push({
            name: domain,
            availability: { status: 'AVAILABLE' }
          });
        } else {
          results.push({
            name: domain,
            availability: { status: 'UNKNOWN' }
          });
        }
      }
    }

    return NextResponse.json({ items: results });
  } catch (error: any) {
    console.error('Error checking domain availability:', error.response?.data || error.message);
    return NextResponse.json({ 
      items: domains.map(domain => ({
        name: domain,
        availability: { status: 'UNKNOWN' }
      })),
      error: { 
        message: 'Failed to check domain availability', 
        details: error.response?.data || error.message 
      } 
    });
  }
}