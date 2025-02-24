//app/api/mentors/[mentorId]/route.ts

// app/api/mentors/[mentorId]/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// Define the GET handler function for this route
export async function GET(
  request: Request, //  You can use 'Request' from 'next/server' or 'node-fetch'
  { params }: { params: { mentorId: string } } // Destructure route parameters
) {
  const mentorId = params.mentorId;

  if (!mentorId) {
    return NextResponse.json({ error: "Mentor ID is required" }, { status: 400 });
  }

  try {
    const { data: mentor, error: mentorError } = await supabase
      .from('mentors')
      .select('availability') // Only fetch the availability column
      .eq('id', mentorId)
      .single(); // Expecting only one mentor with this ID

    if (mentorError) {
      console.error("Supabase error fetching mentor availability:", mentorError);
      return NextResponse.json({ error: "Failed to fetch mentor availability", details: mentorError.message }, { status: 500 });
    }

    if (!mentor) {
      return NextResponse.json({ error: "Mentor not found" }, { status: 404 });
    }

    // Availability is already in JSON format from database (jsonb column)
    const availability = mentor.availability;

    return NextResponse.json({ availability }, { status: 200 });

  } catch (error: any) {
    console.error("Error in GET /api/mentors/[mentorId]/availability:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}