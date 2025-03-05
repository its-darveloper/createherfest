// app/api/domains/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_UD_API_URL || 'https://api.ud-sandbox.com/partner/v3';
const API_KEY = process.env.UD_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ items: [] });
  }

  try {
    const response = await axios.get(
      `${API_BASE_URL}/suggestions/domains?query=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Domain suggestions response:', response.data);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching domain suggestions:', error.response?.data || error.message);
    return NextResponse.json({ 
      items: [],
      error: { 
        message: 'Failed to fetch domain suggestions', 
        details: error.response?.data || error.message 
      } 
    }, { status: 500 });
  }
}