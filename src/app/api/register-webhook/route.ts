// src/app/api/register-webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_UD_API_URL || 'https://api.ud-sandbox.com/partner/v3';
const API_KEY = process.env.UD_API_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://createherfest.com';

export async function GET(request: NextRequest) {
  // Simple auth check - you might want to add a proper auth mechanism
  const authKey = request.nextUrl.searchParams.get('auth_key');
  if (authKey !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    // Register webhook for operation status updates
    const operationWebhook = await axios.post(
      `${API_BASE_URL}/webhooks`,
      {
        url: `${APP_URL}/api/webhooks/unstoppable`,
        type: "OPERATION_FINISHED"
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Operation webhook registered:', operationWebhook.data);
    
    return NextResponse.json({
      success: true,
      webhooks: [
        {
          type: "OPERATION_FINISHED",
          id: operationWebhook.data.id,
          url: operationWebhook.data.url
        }
      ]
    });
  } catch (error: any) {
    console.error('Error registering webhooks:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}