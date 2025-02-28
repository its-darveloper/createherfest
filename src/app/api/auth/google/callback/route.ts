import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Exchange authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);

    // These are VERY important - store these securely
    console.log('Access Token:', tokens.access_token);
    console.log('Refresh Token:', tokens.refresh_token);

    // In a real app, you'd store these tokens securely
    // For now, we'll just log them and redirect
    return NextResponse.redirect(new URL('/mentors', request.url));
  } catch (error) {
    console.error('Error during token exchange:', error);
    return NextResponse.json({ error: 'Failed to exchange token' }, { status: 500 });
  }
}