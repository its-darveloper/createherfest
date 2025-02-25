// components/speakers/speaker-card.tsx
"use client"

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { urlFor } from '@/lib/sanity'
import type { Speaker } from '@/types/sanity'
import { typography } from '@/lib/utils/typography'
import { SpeakerDialog } from './speaker-dialog'

interface SpeakerCardProps {
  speaker: Speaker
}

export function SpeakerCard({ speaker }: SpeakerCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [, setIsHovered] = useState(false)
  
  return (
    <>
      <motion.div 
        className="group relative flex flex-col rounded-3xl overflow-hidden bg-[#150E60] 
                 border border-[#473DC6]/20 hover:border-[#473DC6]/40 transition-all duration-300 h-full
                 cursor-pointer shadow-md hover:shadow-lg"
        onClick={() => setIsDialogOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ 
          y: -6,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Speaker Image - No heavy overlay */}
        <div className="relative aspect-[1/1] w-full overflow-hidden">
          {speaker.image ? (
            <Image
              src={urlFor(speaker.image).width(600).height(600).url()}
              alt={speaker.name}
              fill
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#473DC6]/30 to-[#CAA3D6]/30 flex items-center justify-center">
              <span className="text-white text-4xl font-bold opacity-50">
                {speaker.name?.charAt(0) || "S"}
              </span>
            </div>
          )}
          
          {/* Optional topic/expertise tag positioned at top */}
          {speaker.title && (speaker.title.includes("AI") || speaker.title.includes("ML")) && (
            <div className="absolute top-3 left-3 bg-[#473DC6] px-3 py-1 rounded-full z-10">
              <span className={`${typography.caption} text-white`}>
                AI/ML
              </span>
            </div>
          )}
          
          {/* Company tag */}
          {speaker.company && (
            <div className="absolute top-3 right-3 bg-[#1C144D] px-3 py-1 rounded-full border border-[#473DC6]/40 z-10">
              <span className={`${typography.caption} text-white`}>
                {speaker.company}
              </span>
            </div>
          )}
        </div>
        
        {/* Info container - Clean with minimal styling */}
        <div className="p-5 flex-grow flex flex-col bg-[#1C144D]">
          <h3 className={`${typography.heading} text-white group-hover:text-[#CAA3D6] 
                       transition-colors duration-300 mb-1`}>
            {speaker.name}
          </h3>
          
          <p className={`${typography.body} text-white/70 mb-3`}>
            {speaker.title}
          </p>
          
          {/* Bottom row with pronouns */}
          <div className="mt-auto flex items-center justify-between">
            {speaker.pronouns && (
              <span className={`${typography.caption} text-white/50`}>
                {speaker.pronouns}
              </span>
            )}
            
            {/* Simple view more button */}
            <button 
              className="rounded-full p-2 bg-white/5 hover:bg-white/10 transition-colors
                       border border-white/10 hover:border-white/20"
              aria-label={`View ${speaker.name}'s details`}
            >
              <ExternalLink className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* Dialog for expanded view */}
      <SpeakerDialog 
        speaker={speaker} 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
      />
    </>
  )
}