// src/app/mentors/[id]/book/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BookingForm } from '@/components/mentors/booking-form'
import { getMentorById } from '@/lib/sanity/queries'

// Define correct page props for App Router
interface Props {
  params: { id: string };
  searchParams: { date?: string; time?: string };
}

export async function generateMetadata({ 
  params,
  searchParams 
}: Props): Promise<Metadata> {
  const mentor = await getMentorById(params.id);

  if (!mentor) {
    return {
      title: 'Mentor Not Found | CreateHER Fest',
    };
  }
  
  return {
    title: `Book Session with ${mentor.name} | CreateHER Fest`,
    description: `Book a mentoring session with ${mentor.name}${mentor.title ? `, ${mentor.title}` : ''}${mentor.company ? ` at ${mentor.company}` : ''}.`,
  };
}

export default async function BookingPage({ 
  params,
  searchParams 
}: Props) {
  const id = params.id;
  const date = searchParams.date;
  const time = searchParams.time;

  // Validate required query parameters
  if (!date || !time) {
    notFound();
  }
  
  // Fetch mentor data
  const mentor = await getMentorById(id);
  
  if (!mentor) {
    notFound();
  }
  
  // Debug logging of available dates (keep for troubleshooting)
  console.log("Available dates:", mentor.availability.map(day => day.date));
  console.log("Requested date:", date);
  
  // Verify that the selected date and time slot is available
  const selectedDateAvailability = mentor.availability.find(day => 
    // Normalize date formats for comparison
    day.date === date
  );
  
  console.log("Selected date availability:", selectedDateAvailability);
  
  const isTimeSlotAvailable = selectedDateAvailability?.slots.includes(time);
  
  console.log("Is time slot available:", isTimeSlotAvailable);
  
  if (!isTimeSlotAvailable) {
    // If time slot is no longer available, show not available page
    return (
      <main className="min-h-screen bg-[#150E60]">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
          <div className="absolute top-1/4 -right-40 w-[500px] h-[500px] bg-[#473dc6]/40 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -left-40 w-[500px] h-[500px] bg-[#caa3d6]/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#150e60]/30 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto py-16 px-4 md:px-6">
          <div className="max-w-2xl mx-auto bg-[#150e60]/70 border border-[#473dc6]/30 backdrop-blur-sm rounded-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">This time slot is no longer available</h1>
            <p className="text-[#f1eae7]/80 mb-6">
              Someone may have just booked this slot. Please return to the mentor's profile and select another time.
            </p>
            <Link 
              href={`/mentors/${id}`} 
              className="inline-block bg-[#473dc6] hover:bg-[#473dc6]/80 text-white px-4 py-2 rounded-md"
            >
              Return to mentor profile
            </Link>
          </div>
        </div>
      </main>
    );
  }
  
  return (
    <main className="min-h-screen bg-[#150E60]">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        <div className="absolute top-1/4 -right-40 w-[500px] h-[500px] bg-[#473dc6]/40 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-40 w-[500px] h-[500px] bg-[#caa3d6]/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#150e60]/30 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto py-16 px-4 md:px-6">
        {/* Back to mentor profile link */}
        <Link 
          href={`/mentors/${id}`} 
          className="inline-flex items-center text-[#f1eae7]/70 hover:text-[#f1eae7] transition-colors mb-8"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to mentor profile
        </Link>
        
        <div className="max-w-3xl mx-auto">
          <BookingForm 
            mentor={mentor} 
            date={date} 
            time={time}
          />
        </div>
      </div>
    </main>
  );
}