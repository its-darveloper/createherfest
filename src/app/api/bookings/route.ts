// src/app/api/bookings/route.ts

import { NextResponse } from "next/server";
import {
  getMentorById,
  createBookingWithValidation,
  Booking,
} from "@/lib/sanity/queries";
import { v4 as uuidv4 } from "uuid";

// Set a higher timeout for API routes if supported by your hosting provider
export const config = {
  maxDuration: 60, // 60 seconds timeout
};

export async function POST(request: Request) {
  try {
    // Log the raw request for debugging
    console.log("Processing booking request");
    
    const requestBody = await request.json();
    const { mentorId, date, time, name, email, topic } = requestBody;
    
    console.log(
      "Received booking request with data:",
      JSON.stringify(requestBody, null, 2)
    );
    
    // Validate required fields
    if (!mentorId || !date || !time || !name || !email || !topic) {
      console.error("Missing required fields in booking request");
      return NextResponse.json(
        { error: "Missing required fields", details: { mentorId, date, time, name, email, topic } },
        { status: 400 }
      );
    }

    // Fetch mentor and validate availability
    console.log(`Fetching mentor data for ID: ${mentorId}`);
    const mentor = await getMentorById(mentorId);
    
    if (!mentor) {
      console.error(`Mentor not found with ID: ${mentorId}`);
      return NextResponse.json({ error: "Mentor not found" }, { status: 404 });
    }

    console.log(`Found mentor: ${mentor.name}`);

    // Calculate time details
    const startDate = new Date(`${date}T${time}:00`);
    const endDate = new Date(startDate.getTime() + 30 * 60000);
    const endTime = `${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`;

    // Generate a temporary Meet link for fallback
    const tempMeetLink = `https://meet.google.com/${generateMeetCode()}`;
    console.log(`Generated temporary meet link: ${tempMeetLink}`);

    // Prepare booking data
    const bookingData: Omit<Booking, "_id"> = {
      mentor: {
        _type: "reference" as const,
        _ref: mentorId,
      },
      date,
      time,
      endTime,
      bookingStatus: "confirmed" as const,
      participantName: name,
      participantEmail: email,
      teamMembers: requestBody.teamMembers || [],
      topic,
      questions: requestBody.questions || "",
      googleCalendarEventId: `temp-${uuidv4().substring(0, 8)}`,
      googleMeetLink: tempMeetLink, // Use the generated Meet link
    };

    console.log("Creating booking in Sanity with data:", JSON.stringify(bookingData, null, 2));
    
    // Create booking first so we have the actual ID
    let booking;
    try {
      booking = await createBookingWithValidation(bookingData);
      console.log(`Booking created with ID: ${booking._id}`);
    } catch (sanityError) {
      console.error("Error creating booking in Sanity:", sanityError);
      return NextResponse.json(
        { 
          error: "Failed to create booking in database", 
          details: sanityError instanceof Error ? sanityError.message : String(sanityError)
        },
        { status: 500 }
      );
    }

    // Trigger Make workflow with the actual booking ID
    const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL;
    console.log(`Make webhook URL configured: ${makeWebhookUrl ? 'Yes' : 'No'}`);
    
    let makeResponse;
    try {
      if (makeWebhookUrl) {
        const webhookPayload = {
          bookingId: booking._id, // Use the actual Sanity document ID
          mentorId,
          mentorName: mentor.name,
          mentorEmail: mentor.email,
          date,
          time,
          participantName: name,
          participantEmail: email,
          teamMembers: Array.isArray(requestBody.teamMembers)
            ? requestBody.teamMembers
            : [],
          topic,
          questions: requestBody.questions || "",
          googleMeetLink: tempMeetLink, // Pass the temporary Meet link
        };

        console.log("Sending webhook payload to Make:", JSON.stringify(webhookPayload, null, 2));

        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        // Only add Authorization header if secret exists
        if (process.env.MAKE_WEBHOOK_SECRET) {
          headers["Authorization"] =
            `Bearer ${process.env.MAKE_WEBHOOK_SECRET}`;
          console.log("Including authorization header with webhook request");
        } else {
          console.log("No webhook secret configured, sending unauthenticated request");
        }

        makeResponse = await fetch(makeWebhookUrl, {
          method: "POST",
          headers,
          body: JSON.stringify(webhookPayload),
        });

        const responseText = await makeResponse.text();
        console.log("Webhook response status:", makeResponse.status);
        console.log("Webhook response body:", responseText);

        if (!makeResponse.ok) {
          console.error("Make workflow failed:", responseText);
        }
      } else {
        console.warn("No Make webhook URL configured - skipping webhook call");
      }
    } catch (makeError) {
      console.error("Make webhook error details:", makeError instanceof Error ? {
        name: makeError.name,
        message: makeError.message,
        stack: makeError.stack
      } : makeError);
    }

    // Prepare response with the actual Meet link
    console.log("Sending successful booking response");
    return NextResponse.json({
      success: true,
      bookingId: booking._id,
      googleMeetLink: tempMeetLink,
      redirectUrl: `/mentors/booking-confirmation?mentor=${mentorId}&date=${date}&time=${time}&bookingId=${booking._id}&meetLink=${encodeURIComponent(tempMeetLink)}`,
      details: {
        calendarCreated: false, // Will be created by Make.com
        bookingSaved: true,
        makeTriggered: !!makeResponse?.ok,
      },
    });
  } catch (error) {
    console.error("Full booking error:", error);

    // Log the full error details
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown server error',
        details: error instanceof Error ? error.stack : null
      },
      { status: 500 }
    );
  }
}

// Helper function to generate a Google Meet compatible code
function generateMeetCode() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  // Google Meet codes follow pattern: xxx-xxxx-xxx
  let part1 = "";
  for (let i = 0; i < 3; i++) {
    part1 += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }

  let part2 = "";
  for (let i = 0; i < 4; i++) {
    part2 += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }

  let part3 = "";
  for (let i = 0; i < 3; i++) {
    part3 += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }

  return `${part1}-${part2}-${part3}`;
}