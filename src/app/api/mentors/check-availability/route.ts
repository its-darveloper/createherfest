// src/app/api/mentors/check-availability/route.ts
import { NextResponse } from 'next/server';
import { getMentorById } from '@/lib/sanity/queries';


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mentorId = searchParams.get('mentorId');
    const date = searchParams.get('date');
    const time = searchParams.get('time');
    
    if (!mentorId || !date || !time) {
      return NextResponse.json({ available: false, error: 'Missing required parameters' }, { status: 400 });
    }
    
    const mentor = await getMentorById(mentorId);
    
    if (!mentor) {
      return NextResponse.json({ available: false, error: 'Mentor not found' }, { status: 404 });
    }
    
    // Normalize the date format to ensure consistent comparison
    const normalizedDate = date;  // Assuming date is already in 'YYYY-MM-DD' format
    
    // Find the availability for this date
    const selectedDateAvailability = mentor.availability.find(day => {
      // Normalize the stored date format as well to ensure consistent comparison
      const storedDate = day.date;
      return storedDate === normalizedDate;
    });
    
    // Check if the time slot is available
    const isTimeSlotAvailable = selectedDateAvailability?.slots.includes(time);
    
    // Return availability status
    if (isTimeSlotAvailable) {
      return NextResponse.json({ available: true });
    } else {
      return NextResponse.json({ 
        available: false, 
        error: 'This time slot is no longer available',
        dates: mentor.availability.map(a => a.date) // For debugging
      });
    }
  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json({ available: false, error: 'Failed to check availability' }, { status: 500 });
  }
}