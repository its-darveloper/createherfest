// src/lib/sanity/queries.ts
import { createClient } from 'next-sanity';

// Configure your Sanity client with enhanced options
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-03', // Use the API version you need
  useCdn: true, // Use CDN in production
  token: process.env.SANITY_API_TOKEN, // Make sure this is present
  
  // REMOVE this property causing the warning
  // withCredentials: true,
  
  // Keep these if needed
  ignoreBrowserTokenWarning: true,
  perspective: 'published',
});

// Error handling interfaces and utilities
interface SanityError extends Error {
  statusCode?: number;
  response?: {
    body?: {
      error?: {
        description?: string;
      };
    };
  };
}

function handleSanityError(error: SanityError) {
  const statusCode = error.statusCode || 500;
  const message = error.response?.body?.error?.description || error.message;
  
  console.error('Sanity Error:', { statusCode, message });
  
  return {
    statusCode,
    message,
    isSanityError: true,
  };
}

// Safe fetch utility
export async function safeSanityFetch<T>(query: string, params?: any): Promise<T> {
  try {
    return await client.fetch<T>(query, params);
  } catch (error) {
    throw handleSanityError(error as SanityError);
  }
}

// Safe mutation utility
export async function safeSanityMutation<T>(operation: any): Promise<T> {
  try {
    return await operation;
  } catch (error) {
    throw handleSanityError(error as SanityError);
  }
}

// Existing interfaces
export interface Mentor {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  title?: string;
  company?: string;
  location?: string;
  email?: string;
  bio?: string;
  longBio?: string;
  imageUrl?: string;
  expertise: string[];
  education?: string;
  languages?: string[];
  projects?: {
    title: string;
    description: string;
  }[];
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  availability: {
    date: string;
    slots: string[];
  }[];
}

export interface Booking {
  _id: string;
  mentor: {
    _ref: string;
    _type: "reference";
  };
  date: string;
  time: string;
  endTime?: string;
  bookingStatus: 'confirmed' | 'cancelled' | 'completed';
  participantName: string;
  participantEmail: string;
  topic?: string;
  questions?: string;
  teamMembers?: { 
    name: string; 
    email: string; 
  }[];
  googleCalendarEventId?: string;
  googleMeetLink?: string;
  notes?: string;
}

// Existing query interfaces
export interface MentorQueryParams {
  page?: number;
  limit?: number;
  expertise?: string[] | undefined;
  availability?: string[] | undefined;
  search?: string | null;
}

// Existing functions with added error handling
export async function getMentors({
  page = 1,
  limit = 9,
  expertise,
  availability,
  search,
}: MentorQueryParams = {}): Promise<{
  mentors: Mentor[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const start = (page - 1) * limit;
  const end = start + limit;

  // Build the GROQ query based on filters
  let query = `*[_type == "mentor"`;
  const queryParams: Record<string, any> = {};

  // Add search filter if provided
  if (search) {
    query += ` && (name match $search || company match $search || bio match $search)`;
    queryParams.search = `*${search}*`;
  }

  // Add expertise filter if provided
  if (expertise && expertise.length > 0) {
    query += ` && count((expertise[])[@ in $expertise]) > 0`;
    queryParams.expertise = expertise;
  }
  
  // Add availability filter if provided
  if (availability && availability.length > 0) {
    query += ` && count(availability[date in $availableDates]) > 0`;
    queryParams.availableDates = availability;
  }

  // Close the main query condition
  query += `]`;

  // Add sorting and projection
  query += `{
    _id,
    name,
    slug,
    title,
    company,
    location,
    email,
    bio,
    longBio,
    expertise,
    "imageUrl": image.asset->url,
    education,
    languages,
    projects,
    socialLinks,
    availability
  }`;

  // Execute count query first
  const countQuery = `count(*[_type == "mentor"`;
  let countQueryFull = countQuery;
  
  if (search) {
    countQueryFull += ` && (name match $search || company match $search || bio match $search)`;
  }
  
  if (expertise && expertise.length > 0) {
    countQueryFull += ` && count((expertise[])[@ in $expertise]) > 0`;
  }
  
  if (availability && availability.length > 0) {
    countQueryFull += ` && count(availability[date in $availableDates]) > 0`;
  }
  
  countQueryFull += `])`;
  
  const totalCount = await safeSanityFetch<number>(countQueryFull, queryParams);
  
  // Now execute the main query with pagination
  query += ` | order(name asc) [${start}...${end}]`;
  const mentors = await safeSanityFetch<Mentor[]>(query, queryParams);
  
  // Filter out dates with no slots and sort availability for each mentor
  const mentorsWithFilteredAvailability = mentors.map((mentor: Mentor) => {
    // Filter out dates with no available slots
    const filteredAvailability = mentor.availability?.filter(day => 
      day.slots && day.slots.length > 0
    ) || [];
    
    // Sort by date (earliest first)
    const sortedAvailability = filteredAvailability.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    return {
      ...mentor,
      availability: sortedAvailability
    };
  });
  
  return {
    mentors: mentorsWithFilteredAvailability,
    total: totalCount,
    page,
    totalPages: Math.ceil(totalCount / limit),
  };
}

export async function getMentorById(id: string): Promise<Mentor | null> {
  const query = `*[_type == "mentor" && _id == $id][0]{
    _id,
    name,
    slug,
    title,
    company,
    location,
    email,
    bio,
    longBio,
    expertise,
    "imageUrl": image.asset->url,
    education,
    languages,
    projects,
    socialLinks,
    availability
  }`;
  
  const mentor = await safeSanityFetch<Mentor | null>(query, { id });
  
  if (!mentor) return null;
  
  // Sort availability by date
  if (mentor.availability) {
    mentor.availability.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }
  
  return mentor;
}

export async function getMentorBySlug(slug: string): Promise<Mentor | null> {
  const query = `*[_type == "mentor" && slug.current == $slug][0]{
    _id,
    name,
    slug,
    title,
    company,
    location,
    email,
    bio,
    longBio,
    expertise,
    "imageUrl": image.asset->url,
    education,
    languages,
    projects,
    socialLinks,
    availability
  }`;
  
  const mentor = await safeSanityFetch<Mentor | null>(query, { slug });
  
  if (!mentor) return null;
  
  // Sort availability by date
  if (mentor.availability) {
    mentor.availability.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }
  
  return mentor;
}

// New helper functions for booking
export async function isTimeSlotAvailable(
  mentorId: string,
  date: string,
  time: string
): Promise<boolean> {
  const mentor = await getMentorById(mentorId);
  if (!mentor) return false;

  const selectedDate = mentor.availability.find(day => day.date === date);
  return !!selectedDate && selectedDate.slots.includes(time);
}

// Updated function in queries.ts
export async function createBookingWithValidation(
  bookingData: Omit<Booking, '_id'>
): Promise<Booking> {
  try {
    // Validate time slot availability
    const isAvailable = await isTimeSlotAvailable(
      bookingData.mentor._ref,
      bookingData.date,
      bookingData.time
    );

    if (!isAvailable) {
      throw new Error('Time slot is no longer available');
    }

    // Create the booking
    const booking = await createBooking(bookingData);

    // Update mentor availability - critical function that must work
    try {
      await updateMentorAvailability(
        bookingData.mentor._ref,
        bookingData.date,
        bookingData.time
      );
      console.log(`Successfully removed time slot ${bookingData.time} on ${bookingData.date} for mentor ${bookingData.mentor._ref}`);
    } catch (error) {
      // If we failed to update the availability, log it but don't fail the booking process
      console.error(`Failed to update mentor availability: ${error instanceof Error ? error.message : String(error)}`);
      console.error(`Details: mentorId=${bookingData.mentor._ref}, date=${bookingData.date}, time=${bookingData.time}`);
      // Consider adding a background job to retry this operation or flag for admin attention
    }

    return booking;
  } catch (error) {
    console.error(`Booking validation failed: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

export async function updateMentorAvailability(
  mentorId: string, 
  date: string, 
  timeSlot: string
): Promise<any> {
  // First get the current mentor data
  const mentor = await getMentorById(mentorId);
  if (!mentor) throw new Error('Mentor not found');
  
  // Find the specific day in availability
  const dayIndex = mentor.availability.findIndex(day => day.date === date);
  if (dayIndex === -1) throw new Error('Date not found in mentor availability');
  
  // Filter out the booked time slot
  const updatedSlots = mentor.availability[dayIndex].slots.filter(slot => slot !== timeSlot);
  
  // Prepare the patch
  const patch = client.patch(mentorId);
  
  // If there are no slots left for this day, remove the entire day
  if (updatedSlots.length === 0) {
    return safeSanityMutation(
      patch
        .unset([`availability[${dayIndex}]`])
        .commit()
    );
  }
  
  // Otherwise update the slots for this day
  return safeSanityMutation(
    patch
      .set({
        [`availability[${dayIndex}].slots`]: updatedSlots
      })
      .commit()
  );
}

export async function getMentorBookings(mentorId: string): Promise<Booking[]> {
  const query = `*[_type == "booking" && mentor._ref == $mentorId]{
    _id,
    mentor,
    date,
    time,
    bookingStatus,
    participantName,
    participantEmail,
    topic,
    questions,
    teamMembers,
    googleCalendarEventId,
    googleMeetLink,
    notes
  } | order(date asc, time asc)`;
  
  return safeSanityFetch<Booking[]>(query, { mentorId });
}

export async function createBooking(bookingData: Omit<Booking, '_id'>): Promise<Booking> {
  return safeSanityMutation<Booking>(
    client.create({
      _type: 'booking',
      ...bookingData
    })
  );
}

export async function updateBookingStatus(
  bookingId: string, 
  status: 'confirmed' | 'cancelled' | 'completed'
): Promise<any> {
  return safeSanityMutation(
    client.patch(bookingId)
      .set({ bookingStatus: status })
      .commit()
  );
}