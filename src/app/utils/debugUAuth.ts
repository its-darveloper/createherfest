// app/utils/debugUAuth.ts
'use client';

import UAuth from '@uauth/js';

export default function debugUAuth() {
  console.log('UAuth Debug Info:');
  console.log('Client ID:', process.env.NEXT_PUBLIC_CLIENT_ID || 'Not set');
  console.log('Redirect URI:', process.env.NEXT_PUBLIC_REDIRECT_URI || 'Not set');
  console.log('Scopes:', process.env.NEXT_PUBLIC_SCOPES || 'Not set');
  
  try {
    const uauth = new UAuth({
      clientID: process.env.NEXT_PUBLIC_CLIENT_ID || '',
      redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000',
      scope: process.env.NEXT_PUBLIC_SCOPES || 'openid wallet messaging:notifications:optional',
    });
    
    console.log('UAuth instance created successfully');
    return uauth;
  } catch (error) {
    console.error('Error creating UAuth instance:', error);
    return null;
  }
}