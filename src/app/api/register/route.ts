// app/api/register/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_UD_API_URL || 'https://api.ud-sandbox.com/partner/v3';
const API_KEY = process.env.UD_API_KEY;

export async function POST(request: Request) {
  const body = await request.json();
  const domainId = body.domainId;

  if (!domainId) {
    return NextResponse.json({ 
      error: { message: 'Domain ID is required' } 
    }, { status: 400 });
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/domains`,
      { domain: domainId },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Domain registration response:', response.data);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error registering domain:', error.response?.data || error.message);
    return NextResponse.json({ 
      operation: { id: '', status: 'FAILED', domain: '' },
      error: { 
        message: 'Failed to register domain', 
        details: error.response?.data || error.message 
      } 
    }, { status: 500 });
  }
}