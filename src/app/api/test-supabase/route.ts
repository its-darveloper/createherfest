// app/api/test-supabase/route.ts
import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('mentors') // Try querying the 'mentors' table
      .select('*')
      .limit(1); // Just get one record for testing

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json({ error: `Supabase query failed: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data }, { status: 200 });

  } catch (error: any) {
    console.error("Error initializing Supabase or querying:", error);
    return NextResponse.json({ error: `Failed to connect to Supabase: ${error.message}` }, { status: 500 });
  }
}