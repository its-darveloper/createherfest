// src/app/mentors/booking-confirmation/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { Calendar, CheckCircle, Clock, Mail, AlertTriangle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getMentorById } from '@/lib/sanity/queries'
import { format, parseISO } from 'date-fns'

export const metadata: Metadata = {
  title: 'Booking Confirmation | CreateHER Fest',
  description: 'Your mentor session has been confirmed.',
};

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function BookingConfirmationPage(props: PageProps) {
  // Extract searchParams properties safely
  const searchParams = new URLSearchParams();
  Object.entries(props.searchParams).forEach(([key, value]) => {
    if (typeof value === 'string') {
      searchParams.set(key, value);
    } else if (Array.isArray(value)) {
      searchParams.set(key, value[0] || '');
    }
  });

  // Get values safely from searchParams
  const mentorId = searchParams.get('mentor') || '';
  const date = searchParams.get('date') || '';
  const time = searchParams.get('time') || '';
  const meetLink = searchParams.get('meetLink') || '';
  const hasError = searchParams.get('error') === 'true';
  
  // Redirect if required params are missing
  if (!mentorId || !date || !time) {
    redirect('/mentors');
  }
  
  // Fetch mentor data - handle case where mentor might not be found
  let mentor;
  try {
    mentor = await getMentorById(mentorId);
    if (!mentor) {
      // If mentor isn't found, we'll show a generic confirmation
      console.warn(`Mentor not found for ID: ${mentorId}`);
    }
  } catch (error) {
    console.error('Error fetching mentor details:', error);
    // Continue without mentor data
  }
  
  // Format the date and time for display - FIXED DATE PARSING
  let formattedDate = "Unknown date";
  let formattedTime = "Unknown time";
  
  try {
    // Use this approach for more reliable date parsing
    // This handles the date string consistently regardless of browser timezone
    // First ensure we're working with just the date part (YYYY-MM-DD)
    const datePart = date.split('T')[0];
    
    // Create a date object at noon UTC to avoid timezone issues
    const dateObj = parseISO(`${datePart}T12:00:00Z`);
    
    // Format the date for display
    formattedDate = format(dateObj, "EEEE, MMMM d, yyyy");
    
    // Format time slot (e.g., "10:00" -> "10:00 AM")
    const formatTimeSlot = (timeSlot: string) => {
      const [hours, minutes] = timeSlot.split(':');
      const hour = parseInt(hours, 10);
      const period = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${period}`;
    };
    
    formattedTime = formatTimeSlot(time);
  } catch (e) {
    console.error('Error formatting date/time:', e);
    console.error('Date string received:', date);
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
        <div className="max-w-2xl mx-auto">
          <Card className="bg-[#150e60]/70 border-[#473dc6]/30 backdrop-blur-sm p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-full bg-[#473dc6]/20 flex items-center justify-center">
                {hasError ? (
                  <AlertTriangle className="h-8 w-8 text-amber-400" />
                ) : (
                  <CheckCircle className="h-8 w-8 text-[#caa3d6]" />
                )}
              </div>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {hasError 
                ? "Your Session is Partially Confirmed" 
                : "Your Mentor Session is Confirmed!"}
            </h1>
            
            <p className="text-[#f1eae7]/80 mb-8">
              {hasError 
                ? "We encountered some technical issues, but your session with " + (mentor?.name || "your mentor") + " can still proceed as scheduled."
                : "You've successfully booked a session with " + (mentor?.name || "your mentor") + ". Use the Google Meet link below to join your session."}
            </p>
            
            {hasError && (
              <Alert className="bg-amber-600/20 border-amber-600/50 text-amber-200 mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Some features were unavailable</AlertTitle>
                <AlertDescription>
                  We had trouble saving your booking or sending calendar invitations, but we've generated a Google Meet link so your session can still proceed.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="bg-[#2b2b2b]/20 border border-[#473dc6]/30 rounded-lg p-6 mb-8">
              {mentor && (
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#473dc6]/50">
                    {mentor.imageUrl ? (
                      <Image
                        src={mentor.imageUrl}
                        alt={mentor.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-[#150e60]/70">
                        <span className="text-[#f1eae7]/70 text-sm">No Image</span> 
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <h2 className="text-xl font-semibold text-white mb-2">
                {mentor?.name || "Your Mentor"}
              </h2>
              
              {mentor && (
                <p className="text-[#f1eae7]/70 mb-4">
                  {mentor.title || ''} {mentor.title && mentor.company ? 'at' : ''} {mentor.company || ''}
                </p>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-[#caa3d6]" />
                  <span className="text-[#f1eae7]">{formattedDate}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-[#caa3d6]" />
                  <span className="text-[#f1eae7]">{formattedTime} (30 minutes)</span>
                </div>
              </div>
              
              {meetLink && (
                <div className="mt-6 pt-4 border-t border-[#473dc6]/30">
                  <div className="flex items-center">
                    <ExternalLink className="h-5 w-5 mr-3 text-[#caa3d6]" />
                    <a 
                      href={meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#f1eae7] hover:text-white break-all text-left underline"
                    >
                      {meetLink}
                    </a>
                  </div>
                  <p className="text-[#f1eae7]/60 text-sm mt-2 text-left">
                    Click the link above to join your session at the scheduled time
                  </p>
                </div>
              )}
            </div>
            
            {!hasError && (
              <div className="bg-[#473dc6]/20 p-4 rounded-md text-left mb-8">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 mr-3 text-[#caa3d6] mt-0.5" />
                  <div>
                    <h3 className="font-medium text-white mb-1">Check Your Email</h3>
                    <p className="text-[#f1eae7]/80 text-sm">
                      We've sent a calendar invitation with a Google Meet link to your email. If you don't see it in your inbox, please check your spam folder.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {mentor && (
                <Button
                  asChild
                  variant="outline"
                  className="border-[#473dc6]/30 bg-[#2b2b2b]/30 text-[#f1eae7] hover:bg-[#473dc6]/20 hover:text-white"
                >
                  <Link href={`/mentors/${mentorId}`}>
                    View Mentor Profile
                  </Link>
                </Button>
              )}
              
              <Button
                asChild
                className="bg-[#473dc6] hover:bg-[#473dc6]/80 text-white"
              >
                <Link href="/mentors">
                  Browse More Mentors
                </Link>
              </Button>
            </div>
            
            {hasError && (
              <p className="text-[#f1eae7]/60 text-sm mt-6">
                Note: We recommend saving the Google Meet link somewhere safe, as calendar invitations may not have been sent.
              </p>
            )}
          </Card>
        </div>
      </div>
    </main>
  )
}