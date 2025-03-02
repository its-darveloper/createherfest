// app/api/register/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { domainId } = body;
    
    if (!domainId) {
      return NextResponse.json({ 
        error: { message: 'Domain ID is required' } 
      }, { status: 400 });
    }
    
    // Here we would normally call the Unstoppable Domains API
    // For development, we'll create a mock operation response
    const operation = {
      id: 'op_' + Math.random().toString(36).substring(2, 15),
      status: 'PENDING',
      domain: domainId
    };
    
    return NextResponse.json({ operation });
    
  } catch (error) {
    console.error('Error registering domain:', error);
    return NextResponse.json({ 
      error: { message: 'Failed to register domain', details: error } 
    }, { status: 500 });
  }
}