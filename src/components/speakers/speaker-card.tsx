// components/speakers/speaker-card.tsx
"use client"

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Linkedin, ExternalLink } from 'lucide-react'
import { urlFor } from '@/lib/sanity'
import type { Speaker } from '@/types/sanity'
import { typography } from '@/lib/utils/typography'
import { SpeakerDialog } from './speaker-dialog'

interface SpeakerCardProps {
  speaker: Speaker
}

export function SpeakerCard({ speaker }: SpeakerCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  return (
    <>
      <motion.div 
        className="group relative flex flex-col rounded-2xl overflow-hidden bg-[#1c144d] border border-[#473DC6]/20
                 hover:border-[#473DC6]/60 transition-all duration-300 h-full cursor-pointer"
        onClick={() => setIsDialogOpen(true)}
        whileHover={{ 
          y: -5,
          transition: { duration: 0.2 }
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Speaker Image */}
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          {speaker.image ? (
            <Image
              src={urlFor(speaker.image).width(600).height(800).url()}
              alt={speaker.name}
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#473DC6]/30 to-[#CAA3D6]/30 flex items-center justify-center">
              <span className="text-white text-4xl font-bold opacity-50">
                {speaker.name?.charAt(0) || "S"}
              </span>
            </div>
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c144d] via-transparent to-transparent opacity-90" />
          
          {/* Company badge (if available) */}
          {speaker.company && (
            <div className="absolute top-4 right-4 bg-[#1c144d]/80 backdrop-blur-sm rounded-full px-3 py-1
                         border border-[#473DC6]/30 text-xs text-white/70">
              {speaker.company}
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-6 flex-grow flex flex-col">
          <h3 className={`${typography.heading} text-white group-hover:text-[#CAA3D6] 
                       transition-colors duration-300 mb-1`}>
            {speaker.name}
          </h3>
          
          <p className={`${typography.body} text-white/60 mb-4`}>
            {speaker.title}
          </p>
          
          {/* Social */}
          <div className="mt-auto flex items-center justify-between">
            {speaker.pronouns && (
              <span className={`${typography.caption} text-white/50`}>
                {speaker.pronouns}
              </span>
            )}
            <div className="ml-auto flex gap-2">
              {speaker.linkedinUrl && (
                <a 
                  href={speaker.linkedinUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 
                           transition-colors duration-200 text-white/70 hover:text-white"
                  aria-label={`View ${speaker.name}'s LinkedIn profile`}
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              <button 
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 
                         transition-colors duration-200 text-white/70 hover:text-white"
                aria-label={`View ${speaker.name}'s details`}
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* View more indicator */}
          <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-[#473DC6]/0 
                       group-hover:bg-[#473DC6]/70 flex items-center justify-center
                       transform scale-0 group-hover:scale-100 transition-all duration-300">
            <ExternalLink className="w-4 h-4 text-white" />
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