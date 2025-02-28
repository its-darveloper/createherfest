// src/components/mentors/mentor-card.tsx
"use client"

import { CalendarDays, Clock, ExternalLink, Sparkles, Shield, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Mentor {
  id: string
  name: string
  title: string
  company: string
  expertise: string[] | null | undefined; // Allow null or undefined
  bio: string
  imageUrl: string
  availability: {
    date: string
    slots: string[]
  }[]
}

interface MentorCardProps {
  mentor: Mentor
}

export function MentorCard({ mentor }: MentorCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const totalSlots = mentor.availability.reduce(
    (acc, day) => acc + day.slots.length, 
    0
  )

  const nextAvailableDate = mentor.availability.length > 0 
    ? formatDate(mentor.availability[0].date)
    : "No availability"
    
  const expertiseLabels = (mentor.expertise || []).map(exp => {
    if (exp === "ai_ml") return "AI/ML";
    if (exp === "ar_vr") return "AR/VR";
    if (exp === "ux_ui") return "UX/UI";
    return exp;
  });

  // Get expertise primary color
  const getPrimaryExpertiseColor = () => {
    const expertise = mentor.expertise?.[0] || "";
    switch(expertise) {
      case 'ai_ml': return 'from-[#cfe6ff] to-[#95c2ff]';
      case 'blockchain': return 'from-[#f9c58d] to-[#f6a14f]';
      case 'ar_vr': return 'from-[#caa3d6] to-[#b37fc6]';
      case 'ux_ui': return 'from-[#90caf9] to-[#64b5f6]';
      default: return 'from-[#473dc6] to-[#6658db]';
    }
  }

  return (
    <Card className="group overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl hover:border-white/20 transition-all duration-500 relative shadow-lg hover:shadow-xl hover:-translate-y-1">
      {/* Subtle animated glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className={`absolute -inset-1 bg-gradient-to-r ${getPrimaryExpertiseColor()} opacity-20 blur-xl rounded-xl`}></div>
      </div>

      <CardHeader className="p-0 relative">
        {/* Dynamic background with circuit pattern */}
        <div className="relative h-48 w-full">
          {/* Base gradient */}
          <div className={`absolute inset-0 bg-gradient-to-b ${getPrimaryExpertiseColor()} opacity-20`}></div>
          
          {/* Circuit pattern overlay */}
          <div className="absolute inset-0  bg-no-repeat bg-cover opacity-5 mix-blend-overlay"></div>
          
          {/* Animated shimmer effect */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-30 animate-shimmer-slow"></div>
          
          {/* Header content gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#150e60] to-transparent opacity-50"></div>

          {/* Expertise badges with glassmorphism */}
          <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 max-w-[80%]">
            {expertiseLabels.slice(0, 3).map((skill, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="bg-white/10 backdrop-blur-lg text-white border border-white/20 shadow-sm flex items-center gap-1 px-3 py-1"
              >
                {index === 0 && <Sparkles className="w-3 h-3 text-white/70" />}
                {skill}
              </Badge>
            ))}
            {expertiseLabels.length > 3 && (
              <Badge 
                variant="secondary" 
                className="bg-white/10 backdrop-blur-lg text-white border border-white/20"
              >
                +{expertiseLabels.length - 3} more
              </Badge>
            )}
          </div>
          
          {/* Mentor avatar with improved styling */}
          <div className="absolute -bottom-12 right-6">
            <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-white/10 shadow-xl group-hover:scale-105 transition-transform duration-300">
              {/* Gradient overlay for the image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
              
              {mentor.imageUrl ? (
                <Image
                  src={mentor.imageUrl}
                  alt={mentor.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#473dc6]/80 to-[#6658db]/80">
                  <span className="text-2xl font-bold text-white">
                    {mentor.name.charAt(0)}
                  </span>
                </div>
              )}
              
              {/* Animation indicator badge for featured mentors */}
              <div className="absolute top-1 left-1 z-20">
                <span className="flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#cfe6ff]/80 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-[#cfe6ff] items-center justify-center">
                    <Star className="h-2 w-2 text-[#150e60]" />
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative pt-16 pb-4 px-6 z-10">
        <CardTitle className="text-xl text-white group-hover:text-[#cfe6ff] transition-colors mb-1 flex items-center">
          {mentor.name}
          {/* Verified icon for some mentors */}
          {mentor.company && mentor.company.includes("Google") && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Shield className="h-4 w-4 ml-2 text-[#cfe6ff]" />
              </TooltipTrigger>
              <TooltipContent className="bg-[#150e60] border border-[#473dc6]/50 text-white">
                <p>Verified Expert</p>
              </TooltipContent>
            </Tooltip>
          )}
        </CardTitle>
        
        <CardDescription className="text-[#f1eae7]/70 mb-4">
          {mentor.title} {mentor.company ? `at ${mentor.company}` : ''}
        </CardDescription>
        
        <p className="text-[#f1eae7]/80 text-sm line-clamp-3 mb-4">
          {mentor.bio}
        </p>
        
        <div className="flex flex-col space-y-2">
          <div className="flex items-center text-[#f1eae7]/70 text-sm">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-[#473dc6]/20 mr-2">
              <CalendarDays className="h-3.5 w-3.5 text-[#caa3d6]" />
            </div>
            <span>Next available: {nextAvailableDate}</span>
          </div>
          
          <div className="flex items-center text-[#f1eae7]/70 text-sm">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-[#473dc6]/20 mr-2">
              <Clock className="h-3.5 w-3.5 text-[#caa3d6]" />
            </div>
            <span>{totalSlots} available time {totalSlots === 1 ? 'slot' : 'slots'}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center pt-0 px-6 pb-6 relative z-10">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link 
                href={`/mentors/${mentor.id}`} 
                className="text-[#f1eae7]/70 text-sm hover:text-[#cfe6ff] transition-colors flex items-center group/link"
              >
                View Profile 
                <ExternalLink className="h-3 w-3 ml-1 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              </Link>
            </TooltipTrigger>
            <TooltipContent className="bg-[#150e60] border border-[#473dc6]/50 text-white">
              <p>See full bio and all availability</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button 
          asChild
          className={`relative overflow-hidden ${totalSlots === 0 ? 'bg-[#2b2b2b]/50 text-[#f1eae7]/50' : 'bg-gradient-to-r from-[#473dc6] to-[#6658db] hover:from-[#6658db] hover:to-[#473dc6] text-white shadow-lg hover:shadow-[#473dc6]/40'} rounded-full px-4 transition-all duration-300`}
          disabled={totalSlots === 0}
        >
          <Link href={totalSlots > 0 ? `/mentors/${mentor.id}` : "#"}>
            {totalSlots > 0 && (
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-30 animate-shimmer group-hover:animate-shimmer-fast"></span>
            )}
            <span className="relative">Book Session</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}