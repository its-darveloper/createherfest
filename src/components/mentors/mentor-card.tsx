// src/components/mentors/mentor-card.tsx
"use client"

import { CalendarDays, Clock, ExternalLink } from "lucide-react"
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

  return (
    <Card className="overflow-hidden bg-[#150e60]/70 border-[#473dc6]/30 backdrop-blur-sm hover:border-[#473dc6]/60 transition-all">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full bg-gradient-to-b from-[#473dc6]/30 to-[#150e60]">
          <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 max-w-[80%]">
            {expertiseLabels.slice(0, 3).map((skill, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="bg-[#150e60]/80 text-white border border-[#473dc6]/50"
              >
                {skill}
              </Badge>
            ))}
            {expertiseLabels.length > 3 && (
              <Badge 
                variant="secondary" 
                className="bg-[#150e60]/80 text-white border border-[#473dc6]/50"
              >
                +{expertiseLabels.length - 3} more
              </Badge>
            )}
          </div>
          
          <div className="absolute bottom-0 right-6 translate-y-1/2">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#150e60]">
              {mentor.imageUrl ? (
                <Image
                  src={mentor.imageUrl}
                  alt={mentor.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#2b2b2b]">
                  <span className="text-2xl font-bold text-[#f1eae7]">
                    {mentor.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-16 pb-4 px-6">
        <CardTitle className="text-xl text-white mb-1">{mentor.name}</CardTitle>
        <CardDescription className="text-[#f1eae7]/70 mb-4">
          {mentor.title} {mentor.company ? `at ${mentor.company}` : ''}
        </CardDescription>
        
        <p className="text-[#f1eae7]/80 text-sm line-clamp-3 mb-4">
          {mentor.bio}
        </p>
        
        <div className="flex flex-col space-y-2">
          <div className="flex items-center text-[#f1eae7]/70 text-sm">
            <CalendarDays className="h-4 w-4 mr-2 text-[#caa3d6]" />
            <span>Next available: {nextAvailableDate}</span>
          </div>
          
          <div className="flex items-center text-[#f1eae7]/70 text-sm">
            <Clock className="h-4 w-4 mr-2 text-[#caa3d6]" />
            <span>{totalSlots} available time {totalSlots === 1 ? 'slot' : 'slots'}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center pt-0 px-6 pb-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link 
                href={`/mentors/${mentor.id}`} 
                className="text-[#f1eae7]/70 text-sm hover:text-[#cfe6ff] transition-colors flex items-center"
              >
                View Profile <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
            </TooltipTrigger>
            <TooltipContent className="bg-[#2b2b2b] text-[#f1eae7]">
              <p>See full bio and all availability</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button 
          asChild
          className="bg-[#473dc6] hover:bg-[#473dc6]/80 text-white"
          disabled={totalSlots === 0}
        >
          <Link href={totalSlots > 0 ? `/mentors/${mentor.id}` : "#"}>
            Book Session
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}