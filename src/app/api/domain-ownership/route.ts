// app/api/domain-ownership/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_UD_API_URL || 'https://api.ud-sandbox.com/partner/v3';
const API_KEY = process.env.UD_API_KEY;

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get('domain');
  
  if (!domain) {
    return NextResponse.json({ 
      error: { message: 'Domain parameter is required' } 
    }, { status: 400 });
  }
  
  try {
    console.log(`Checking ownership for domain: ${domain}`);
    
    const response = await axios.get(
      `${API_BASE_URL}/domains/${domain}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`
        }
      }
    );
    
    // Check if we own the domain
    const isOwned = response.data.owner?.type === 'ME';
    
    console.log(`Domain ${domain} ownership status:`, {
      isOwned,
      ownerType: response.data.owner?.type,
    });
    
    return NextResponse.json({
      isOwned,
      owner: response.data.owner,
      domain: response.data
    });
  } catch (error: any) {
    console.error(`Error checking domain ownership for ${domain}:`, error.message);
    
    if (error.response?.status === 404) {
      return NextResponse.json({ isOwned: false, exists: false });
    }
    
    return NextResponse.json({ 
      error: { message: 'Failed to check domain ownership', details: error.message } 
    }, { status: 500 });
  }
}