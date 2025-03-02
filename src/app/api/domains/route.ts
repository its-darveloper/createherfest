// app/api/domains/route.ts

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  
  if (!query) {
    return NextResponse.json({ 
      items: [], 
      error: { message: 'Query parameter is required' } 
    }, { status: 400 });
  }
  
  try {
    // Here we would normally call the Unstoppable Domains API
    // For development, we'll create mock data
    const tld = '.she';
    const suggestions = [];
    
    // Main domain
    suggestions.push({
      name: `${query}${tld}`,
      availability: { status: 'AVAILABLE' },
      price: { listPrice: { usdCents: 2000 } }
    });
    
    // Generate additional suggestions
    const suffixes = ['creative', 'digital', 'tech', 'web3'];
    for (const suffix of suffixes) {
      suggestions.push({
        name: `${query}${suffix}${tld}`,
        availability: { status: 'AVAILABLE' },
        price: { listPrice: { usdCents: 2000 } }
      });
    }
    
    return NextResponse.json({ items: suggestions });
    
  } catch (error) {
    console.error('Error fetching domain suggestions:', error);
    return NextResponse.json({ 
      items: [], 
      error: { message: 'Failed to fetch domain suggestions', details: error } 
    }, { status: 500 });
  }
}