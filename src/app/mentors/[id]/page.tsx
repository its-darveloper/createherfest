// src/app/mentors/[id]/page.tsx
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Calendar, Clock, Briefcase, Award, User, MapPin, ExternalLink, Linkedin, Twitter } from 'lucide-react'
import { AvailabilityCalendar } from '@/components/mentors/availability-calendar'
import { getMentorById } from '@/lib/sanity/queries'

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const id = params.id;
  const mentor = await getMentorById(id);
  
  if (!mentor) {
    return {
      title: 'Mentor Not Found | CreateHER Fest',
    };
  }
  
  const expertiseString = mentor.expertise ? mentor.expertise.join(", ") : "";
  
  return {
    title: `${mentor.name} - Mentor Profile | CreateHER Fest`,
    description: `Book a mentoring session with ${mentor.name}${mentor.title ? `, ${mentor.title}` : ''}${mentor.company ? ` at ${mentor.company}` : ''}${expertiseString ? `. Expertise in ${expertiseString}` : ''}.`,
  };
}

export default async function MentorProfilePage({ params }: any) {
  const id = params.id;
  const mentor = await getMentorById(id);
  
  if (!mentor) {
    notFound();
  }
  
  // Get expertise labels for display - map from IDs if needed
  const expertiseLabels = mentor.expertise.map(exp => {
    // If the expertise is a full ID (like "ai_ml"), convert it to display label
    if (exp === "ai_ml") return "AI/ML";
    if (exp === "ar_vr") return "AR/VR";
    if (exp === "ux_ui") return "UX/UI";
    // Otherwise use the value as is
    return exp;
  });
  
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
        {/* Back to mentors link */}
        <Link 
          href="/mentors" 
          className="inline-flex items-center text-[#f1eae7]/70 hover:text-[#f1eae7] transition-colors mb-8"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to all mentors
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Mentor info */}
          <div className="lg:col-span-1">
            <Card className="bg-[#150e60]/70 border-[#473dc6]/30 backdrop-blur-sm overflow-hidden">
              {/* Profile header */}
              <div className="relative h-32 bg-gradient-to-r from-[#473dc6]/50 to-[#caa3d6]/30">
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 left-1/4 w-12 h-12 rounded-full bg-white/20"></div>
                  <div className="absolute bottom-1/3 right-1/4 w-8 h-8 rounded-full bg-white/10"></div>
                </div>
              </div>
              
              {/* Profile image */}
              <div className="flex justify-center -mt-16 px-6">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#150e60]">
                  {mentor.imageUrl ? (
                    <Image
                      src={mentor.imageUrl}
                      alt={mentor.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#2b2b2b]">
                      <span className="text-4xl font-bold text-[#f1eae7]">
                        {mentor.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Mentor details */}
              <div className="px-6 py-4 text-center">
                <h1 className="text-2xl font-bold text-white mb-1">{mentor.name}</h1>
                
                {mentor.title && (
                  <p className="text-[#f1eae7]/70 mb-1">{mentor.title}</p>
                )}
                
                {mentor.company && (
                  <div className="flex items-center justify-center text-[#f1eae7]/70 text-sm mb-4">
                    <Briefcase className="h-4 w-4 mr-1" />
                    <span>{mentor.company}</span>
                  </div>
                )}
                
                {mentor.location && (
                  <div className="flex items-center justify-center text-[#f1eae7]/70 text-sm mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{mentor.location}</span>
                  </div>
                )}
                
                {/* Expertise */}
                {expertiseLabels.length > 0 && (
                  <div className="my-4">
                    <p className="text-[#f1eae7]/80 text-sm mb-2">Areas of Expertise</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {expertiseLabels.map((skill, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="bg-[#473dc6]/30 text-white border border-[#473dc6]/50"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <Separator className="my-4 bg-[#473dc6]/30" />
                
                {/* Education and Languages */}
                {mentor.education && (
                  <div className="mb-4">
                    <div className="flex items-center text-[#f1eae7]/80 text-sm mb-2">
                      <Award className="h-4 w-4 mr-2 text-[#caa3d6]" />
                      <span className="font-medium">Education</span>
                    </div>
                    <p className="text-[#f1eae7]/70 text-sm">{mentor.education}</p>
                  </div>
                )}
                
                {mentor.languages && mentor.languages.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center text-[#f1eae7]/80 text-sm mb-2">
                      <User className="h-4 w-4 mr-2 text-[#caa3d6]" />
                      <span className="font-medium">Languages</span>
                    </div>
                    <p className="text-[#f1eae7]/70 text-sm">{mentor.languages.join(", ")}</p>
                  </div>
                )}
                
                {/* Social links */}
                <div className="flex justify-center space-x-4 mt-6">
                  {mentor.socialLinks?.linkedin && (
                    <a 
                      href={mentor.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#f1eae7]/70 hover:text-[#f1eae7]"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                  {mentor.socialLinks?.twitter && (
                    <a 
                      href={mentor.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#f1eae7]/70 hover:text-[#f1eae7]"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                  {mentor.socialLinks?.website && (
                    <a 
                      href={mentor.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#f1eae7]/70 hover:text-[#f1eae7]"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  )}
                </div>
                
                {/* Book session button */}
                <div className="mt-6">
                  <Button
                    asChild
                    className="w-full bg-[#473dc6] hover:bg-[#473dc6]/80 text-white"
                    disabled={!mentor.availability || mentor.availability.length === 0}
                  >
                    <Link href={mentor.availability && mentor.availability.length > 0 ? `#availability` : "#"}>
                      Book a Session
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Right column - Bio, projects, availability */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            {(mentor.bio || mentor.longBio) && (
              <Card className="bg-[#150e60]/70 border-[#473dc6]/30 backdrop-blur-sm p-6">
                <h2 className="text-xl font-semibold text-white mb-4">About {mentor.name.split(' ')[0]}</h2>
                <div className="text-[#f1eae7]/80 space-y-4">
                  {mentor.bio && <p>{mentor.bio}</p>}
                  {mentor.longBio && <p>{mentor.longBio}</p>}
                </div>
              </Card>
            )}
            
            {/* Projects and Experience */}
            {mentor.projects && mentor.projects.length > 0 && (
              <Card className="bg-[#150e60]/70 border-[#473dc6]/30 backdrop-blur-sm p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Projects & Experience</h2>
                <div className="space-y-4">
                  {mentor.projects.map((project, index) => (
                    <div key={index} className="border-l-2 border-[#473dc6]/50 pl-4 py-1">
                      <h3 className="text-white font-medium">{project.title}</h3>
                      <p className="text-[#f1eae7]/70 text-sm">{project.description}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
            
            {/* Availability */}
            {mentor.availability && mentor.availability.length > 0 && (
              <Card id="availability" className="bg-[#150e60]/70 border-[#473dc6]/30 backdrop-blur-sm p-6 scroll-mt-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-white">Availability</h2>
                  <div className="flex items-center text-[#f1eae7]/70">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">All sessions are 30 minutes</span>
                  </div>
                </div>
                
                {/* Calendar Component */}
                <AvailabilityCalendar mentorId={mentor._id} availability={mentor.availability} />
                
                <div className="mt-6 flex justify-center">
                  <Button
                    asChild
                    className="bg-[#473dc6] hover:bg-[#473dc6]/80 text-white"
                    disabled={!mentor.availability || mentor.availability.length === 0}
                  >
                    <a href="#availability">
                      Book a Session
                    </a>
                  </Button>
                </div>
              </Card>
            )}
            
            {/* No Availability Notice */}
            {(!mentor.availability || mentor.availability.length === 0) && (
              <Card className="bg-[#150e60]/70 border-[#473dc6]/30 backdrop-blur-sm p-6">
                <div className="flex flex-col items-center justify-center py-8">
                  <Calendar className="h-12 w-12 text-[#caa3d6] mb-4" />
                  <h2 className="text-xl font-semibold text-white mb-2">No Available Sessions</h2>
                  <p className="text-[#f1eae7]/70 text-center max-w-md">
                    This mentor currently has no available time slots. Please check back later or browse other mentors.
                  </p>
                  <Button
                    asChild
                    className="mt-6 bg-[#473dc6] hover:bg-[#473dc6]/80 text-white"
                  >
                    <Link href="/mentors">
                      Find Another Mentor
                    </Link>
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}