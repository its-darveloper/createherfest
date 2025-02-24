// components/sections/upcoming-workshops.tsx
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, ArrowUpRight, Layers, Code, Glasses } from "lucide-react"
import { getRecentWorkshops, urlFor } from "@/lib/sanity"
import { format, parseISO } from "date-fns"
import type { Workshop } from "@/types/sanity"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { typography } from "@/lib/utils/typography"

// Track-specific icons
function TrackIcon({ track }: { track: string }) {
  switch (track?.toLowerCase()) {
    case 'ai-ml':
      return <Code className="w-4 h-4 text-blue-300" />
    case 'ar-vr':
      return <Glasses className="w-4 h-4 text-purple-300" />
    case 'blockchain':
      return <Layers className="w-4 h-4 text-green-300" />
    default:
      return <Layers className="w-4 h-4 text-[#CAA3D6]" />
  }
}

function WorkshopCard({ workshop }: { workshop: Workshop }) {
  const isFuture = new Date(workshop.date) > new Date()
  
  return (
    <div className="relative group h-[480px] overflow-hidden rounded-3xl flex flex-col">
      {/* Card background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1b175a] to-[#150E60] opacity-70 z-0 
                     group-hover:opacity-90 transition-opacity duration-300"/>
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-[0.03] z-0"/>
      
      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-b from-[#473DC6]/30 to-transparent z-0"/>
      
      {/* Card content */}
      <div className="relative p-7 z-10 h-full flex flex-col">
        {/* Date/time badge */}
        <div className="mb-5 flex items-center">
          <div className="mr-4 min-w-16 h-16 rounded-2xl bg-[#473DC6]/20 border border-[#473DC6]/30
                        flex flex-col items-center justify-center text-center">
            <span className={`${typography.caption} text-[#CAA3D6] uppercase`}>
              {format(parseISO(workshop.date), "MMM")}
            </span>
            <span className="text-white text-xl font-bold">
              {format(parseISO(workshop.date), "dd")}
            </span>
          </div>
          <div>
            <div className="flex items-center text-white/70 mb-1">
              <Clock className="w-4 h-4 mr-2 opacity-70" />
              <span className={`${typography.caption}`}>{format(parseISO(workshop.date), "h:mm a")} ET</span>
            </div>
            {workshop.track && (
              <div className="flex items-center text-[#CAA3D6]">
                <TrackIcon track={workshop.track} />
                <span className={`${typography.caption} ml-2`}>{workshop.track}</span>
              </div>
            )}
          </div>
        </div>

        {/* Workshop title - no truncation */}
        <h3 className={`${typography.heading} text-white mb-3 group-hover:text-[#CAA3D6] transition-colors duration-300`}>
          {workshop.title}
        </h3>
        
        {/* Description - scrollable container with fixed height */}
        <div className="h-[180px] overflow-y-auto mb-6 custom-scrollbar pr-1">
          <p className={`${typography.body} text-white/70`}>
            {workshop.description}
          </p>
        </div>
        
        {/* Speaker info */}
        {workshop.speaker && (
          <div className="mt-auto py-4 border-t border-white/10">
            <div className="flex items-center">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#473DC6]/30 shadow-glow flex-shrink-0">
                {workshop.speaker.image ? (
                  <Image
                    src={urlFor(workshop.speaker.image).width(160).height(160).url()}
                    alt={workshop.speaker.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                ) : (
                  <div className="w-full h-full bg-[#473DC6]/30 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">
                      {workshop.speaker.name?.charAt(0) || "S"}
                    </span>
                  </div>
                )}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className={`${typography.body} font-medium text-white truncate`}>
                  {workshop.speaker.name}
                </p>
                <p className={`${typography.caption} text-[#CAA3D6] truncate`}>
                  {workshop.speaker.title}
                  {workshop.speaker.company && ` @ ${workshop.speaker.company}`}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Register button */}
        <Button 
          className="mt-4 w-full bg-[#473DC6] hover:bg-[#5e50ff] text-white 
                   shadow-md hover:shadow-lg transition-all duration-300 
                   rounded-xl group-hover:translate-y-0 translate-y-1"
          asChild
          disabled={!workshop.workshopUrl}
        >
          {workshop.workshopUrl ? (
            <Link
              href={workshop.workshopUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              {isFuture ? "Register Now" : "Watch Recording"}
              <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          ) : (
            <span>Coming Soon</span>
          )}
        </Button>
      </div>
      
      {/* Hover decoration */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#473DC6]/20 rounded-full blur-xl 
                     opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  )
}

function WorkshopDetail({ workshop }: { workshop: Workshop }) {
  const isFuture = new Date(workshop.date) > new Date()
  
  return (
    <div className="bg-[#1b175a]/70 rounded-3xl overflow-hidden border border-[#473DC6]/30">
      <div className="grid md:grid-cols-12 gap-6 p-8">
        {/* Speaker sidebar */}
        <div className="md:col-span-3 flex flex-col items-center md:items-start">
          {workshop.speaker && (
            <>
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden 
                           border-2 border-[#473DC6]/30 shadow-glow mb-4">
                {workshop.speaker.image ? (
                  <Image
                    src={urlFor(workshop.speaker.image).width(300).height(300).url()}
                    alt={workshop.speaker.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 96px, 128px"
                  />
                ) : (
                  <div className="w-full h-full bg-[#473DC6]/30 flex items-center justify-center">
                    <span className="text-white text-3xl font-semibold">
                      {workshop.speaker.name?.charAt(0) || "S"}
                    </span>
                  </div>
                )}
              </div>
              
              <h3 className={`${typography.subheading} text-white mb-2 text-center md:text-left`}>
                {workshop.speaker.name}
              </h3>
              
              <p className={`${typography.body} text-[#CAA3D6] mb-4 text-center md:text-left`}>
                {workshop.speaker.title}
                {workshop.speaker.company && (
                  <>
                    <br />@ {workshop.speaker.company}
                  </>
                )}
              </p>
            </>
          )}
        </div>
        
        {/* Workshop content */}
        <div className="md:col-span-9">
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#473DC6]/20 text-white/80">
              <Clock className="w-4 h-4 mr-2" />
              <span className={typography.caption}>
                {format(parseISO(workshop.date), "MMMM d, yyyy · h:mm a")} ET
              </span>
            </div>
            
            {workshop.track && (
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#473DC6]/20 text-[#CAA3D6]">
                <TrackIcon track={workshop.track} />
                <span className={`${typography.caption} ml-2`}>{workshop.track}</span>
              </div>
            )}
            
            {workshop.duration && (
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#473DC6]/20 text-white/80">
                <span className={typography.caption}>{workshop.duration} min</span>
              </div>
            )}
          </div>
          
          <h2 className={`${typography.subtitle} text-white mb-4`}>
            {workshop.title}
          </h2>
          
          <div className={`${typography.body} text-white/80 mb-8`}>
            {workshop.description}
          </div>
          
          <Button 
            className="bg-[#473DC6] hover:bg-[#5e50ff] text-white 
                     shadow-md hover:shadow-lg transition-all duration-300 px-8"
            asChild
            disabled={!workshop.workshopUrl}
          >
            {workshop.workshopUrl ? (
              <Link
                href={workshop.workshopUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                {isFuture ? "Register Now" : "Watch Recording"}
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            ) : (
              <span>Coming Soon</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export function UpcomingWorkshops() {
  const [activeView, setActiveView] = useState<'all' | 'details'>('all')
  const [selectedWorkshop, setSelectedWorkshop] = useState<string | null>(null)
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const data = await getRecentWorkshops()
        setWorkshops(data)
        if (data.length > 0) {
          setSelectedWorkshop(data[0]._id)
        }
      } catch (error) {
        console.error("Error fetching workshops:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorkshops()
  }, [])

  const activeWorkshop = workshops.find(w => w._id === selectedWorkshop) || workshops[0]

  if (isLoading) {
    return (
      <section className="relative w-full bg-[#150E60] py-20 md:py-28 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-block bg-white/5 px-5 py-2 rounded-full mb-6 w-60 h-8 animate-pulse"></div>
            <div className="h-16 bg-white/5 rounded-2xl mb-6 w-full max-w-lg mx-auto animate-pulse"></div>
            <div className="h-8 bg-white/5 rounded-xl w-3/4 mx-auto animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-3xl bg-white/5 h-[480px] animate-pulse">
                <div className="h-full bg-gradient-to-b from-[#1b175a]/50 to-[#150E60]/50"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (workshops.length === 0) {
    return null
  }

  return (
    <section className="relative bg-[#150E60] py-20 md:py-28 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#0F0A40]/80 to-transparent"></div>
        <div className="absolute -top-1/4 right-0 w-1/2 h-1/2 bg-[#473DC6]/5 rounded-full blur-[150px] opacity-80"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-[#CAA3D6]/5 rounded-full blur-[150px] opacity-60"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16 relative">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-[#473DC6]/30 blur-xl rounded-full transform scale-150 opacity-30"></div>
            <div className="shimmer-container relative backdrop-blur-sm bg-[#473DC6]/10 border border-[#473DC6]/30 
                         px-6 py-2 rounded-full mb-6 overflow-hidden hover:border-white/20 transition-all duration-300">
              <span className={`${typography.caption} text-[#CAA3D6] uppercase tracking-widest`}>
                UPCOMING WORKSHOPS
              </span>
            </div>
          </div>
          
          <h2 className={`${typography.title} text-white mb-5 text-3xl md:text-4xl`}>
            Learn from Industry Experts
          </h2>
          
          <p className={`${typography.section} text-white/80 max-w-3xl mx-auto mb-10`}>
            Dive into transformative workshops led by pioneers who are reshaping 
            technology and empowering women in tech.
          </p>
          
          {/* View Toggle */}
          <div className="flex justify-center mb-10">
            <div className="relative inline-flex bg-[#1b175a]/60 backdrop-blur-md border border-[#473DC6]/20 rounded-full p-1">
              <button
                className={`px-6 py-2.5 rounded-full transition-all duration-300 ${
                  activeView === 'all' 
                    ? 'bg-[#473DC6] text-white shadow-md' 
                    : 'text-white/70 hover:text-white'
                }`}
                onClick={() => setActiveView('all')}
              >
                All Workshops
              </button>
              <button
                className={`px-6 py-2.5 rounded-full transition-all duration-300 ${
                  activeView === 'details' 
                    ? 'bg-[#473DC6] text-white shadow-md' 
                    : 'text-white/70 hover:text-white'
                }`}
                onClick={() => setActiveView('details')}
              >
                Workshop Details
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeView === 'all' ? (
            <motion.div
              key="grid-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
            >
              {workshops.map((workshop, index) => (
                <motion.div
                  key={workshop._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    ease: [0.23, 1, 0.32, 1]
                  }}
                  className="h-[480px] cursor-pointer"
                  onClick={() => {
                    setSelectedWorkshop(workshop._id)
                    setActiveView('details')
                  }}
                >
                  <WorkshopCard workshop={workshop} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="detail-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-5xl mx-auto"
            >
              {/* Workshop selector */}
              <div className="flex overflow-x-auto pb-6 mb-8 hide-scrollbar">
                <div className="flex space-x-4">
                  {workshops.map((workshop) => (
                    <button
                      key={workshop._id}
                      onClick={() => setSelectedWorkshop(workshop._id)}
                      className={`
                        whitespace-nowrap px-4 py-2 rounded-full transition-all duration-200
                        ${workshop._id === selectedWorkshop 
                          ? 'bg-[#473DC6]/30 border-[#CAA3D6] text-white border' 
                          : 'bg-white/5 hover:bg-white/10 text-white/70 border border-transparent'}
                      `}
                    >
                      <span className={typography.caption}>
                        {format(parseISO(workshop.date), "MMM d")} • {workshop.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
              {activeWorkshop && <WorkshopDetail workshop={activeWorkshop} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}