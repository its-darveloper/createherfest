// app/api/domain-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_UD_API_URL || 'https://api.ud-sandbox.com/partner/v3';
const API_KEY = process.env.UD_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { operationIds } = await request.json();
    
    if (!operationIds || !operationIds.length) {
      return NextResponse.json({
        error: { message: 'Operation IDs are required' }
      }, { status: 400 });
    }
    
    const results = await Promise.all(operationIds.map(async (opId) => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/operations/${opId}`,
          {
            headers: {
              Authorization: `Bearer ${API_KEY}`
            }
          }
        );
        
        return {
          operationId: opId,
          status: response.data.status,
          data: response.data
        };
      } catch (error: any) {
        return {
          operationId: opId,
          status: 'ERROR',
          error: error.response?.data || error.message
        };
      }
    }));
    
    return NextResponse.json({ results });
  } catch (error: any) {
    return NextResponse.json({
      error: { message: 'Failed to check operation status', details: error.message }
    }, { status: 500 });
  }
}