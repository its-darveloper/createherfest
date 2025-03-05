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
    const response = await axios.post(
      `${API_BASE_URL}/domain/details`,
      { domains },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Domain availability response:', response.data);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error checking domain availability:', error.response?.data || error.message);
    return NextResponse.json({ 
      items: [],
      error: { 
        message: 'Failed to check domain availability', 
        details: error.response?.data || error.message 
      } 
    }, { status: 500 });
  }
}