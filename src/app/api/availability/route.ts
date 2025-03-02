// app/api/availability/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { domains } = body;
    
    if (!domains || !Array.isArray(domains)) {
      return NextResponse.json({ 
        items: [], 
        error: { message: 'Invalid domains array' } 
      }, { status: 400 });
    }
    
    // Here we would normally call the Unstoppable Domains API
    // For development, we'll simulate all domains being available
    const items = domains.map(domain => ({
      name: domain,
      availability: { status: 'AVAILABLE' }
    }));
    
    return NextResponse.json({ items });
    
  } catch (error) {
    console.error('Error checking domain availability:', error);
    return NextResponse.json({ 
      items: [], 
      error: { message: 'Failed to check domain availability', details: error } 
    }, { status: 500 });
  }
}