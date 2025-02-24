// app/api/bookings/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Initialize Supabase client with ANON KEY (for testing)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(request: Request) {
    try {
      console.log('API route called: POST /api/bookings');

      // 1. Parse request body as JSON
      const requestData = await request.json();

      // 2. Validate request data
      const { mentorId, menteeName, timeSlotId, additionalParticipantEmails } = requestData; // Get additionalParticipantEmails

      if (!mentorId) {
        console.error('Validation error: mentorId is missing');
        return NextResponse.json({ error: "Mentor ID is required" }, { status: 400 });
      }
      if (!menteeName) {
        console.error('Validation error: menteeName is missing');
        return NextResponse.json({ error: "Mentee Name is required" }, { status: 400 });
      }
      if (!timeSlotId) {
        console.error('Validation error: timeSlotId is missing');
        return NextResponse.json({ error: "Time Slot ID is required" }, { status: 400 });
      }

      // Validate additionalParticipantEmails (optional, basic array check for now)
      if (additionalParticipantEmails && !Array.isArray(additionalParticipantEmails)) {
        console.error('Validation error: additionalParticipantEmails must be an array');
        return NextResponse.json({ error: "Additional Participant Emails must be an array" }, { status: 400 });
      }

      console.log('Request body validated:', { mentorId, menteeName, timeSlotId, additionalParticipantEmails });

      // 3. Insert booking data into Supabase
      const insertData = {
        mentor_id: mentorId,
        user_name: menteeName,
        slot_key: timeSlotId,
        status: 'pending',
        additional_participant_emails: additionalParticipantEmails || [] // Use provided emails or default to empty array
      };

      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert([insertData])
        .select();

      if (bookingError) {
        console.error('Supabase insert error:', bookingError);
        return NextResponse.json(
          { error: "Failed to create booking in database", details: bookingError.message },
          { status: 500 }
        );
      }

      console.log('Booking created successfully in Supabase:', bookingData);

      // 4. Return success response
      return NextResponse.json(
        { message: 'Booking created successfully!', booking: bookingData },
        { status: 201 }
      );

    } catch (error) {
      console.error('Error in POST /api/bookings:', error);
      if (error instanceof SyntaxError && error.message.includes("JSON")) {
        return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
      }
      return NextResponse.json(
        { error: 'Internal server error', details: String(error) },
        { status: 500 }
      );
    }
}