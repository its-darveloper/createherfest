// components/speakers/speaker-dialog.tsx
"use client"

import { useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Linkedin } from 'lucide-react'
import { urlFor } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'
import type { Speaker } from '@/types/sanity'
import { typography } from '@/lib/utils/typography'
import { Button } from '@/components/ui/button'

interface SpeakerDialogProps {
  speaker: Speaker
  isOpen: boolean
  onClose: () => void
}

export function SpeakerDialog({ speaker, isOpen, onClose }: SpeakerDialogProps) {
  // Close dialog with escape key
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEscapeKey)
    return () => document.removeEventListener('keydown', handleEscapeKey)
  }, [isOpen, onClose])
  
  // Lock scrolling when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, type: 'spring', damping: 20 }}
            className="relative bg-[#1c144d] border border-[#473DC6]/30 rounded-3xl max-w-4xl w-full max-h-[90vh]
                     overflow-hidden shadow-xl z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/20 hover:bg-black/40
                       text-white/80 hover:text-white transition-colors duration-200"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col md:flex-row h-full overflow-auto">
              {/* Left/Top Column - Speaker Image */}
              <div className="md:w-2/5 relative flex-shrink-0">
                <div className="h-72 md:h-full relative">
                  {speaker.image ? (
                    <Image
                      src={urlFor(speaker.image).width(800).height(1200).url()}
                      alt={speaker.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 40vw"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#473DC6]/30 to-[#CAA3D6]/30 
                                  flex items-center justify-center">
                      <span className="text-white text-7xl font-bold opacity-50">
                        {speaker.name?.charAt(0) || "S"}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l 
                               from-[#1c144d] via-[#1c144d]/70 to-transparent" />
                </div>
              </div>
              
              {/* Right/Bottom Column - Speaker Info */}
              <div className="md:w-3/5 p-6 md:p-10 relative flex flex-col">
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {speaker.company && (
                      <div className="bg-[#473DC6]/20 border border-[#473DC6]/30 rounded-full px-3 py-1">
                        <span className={`${typography.caption} text-[#CAA3D6]`}>
                          {speaker.company}
                        </span>
                      </div>
                    )}
                    {speaker.pronouns && (
                      <div className="bg-white/10 rounded-full px-3 py-1">
                        <span className={`${typography.caption} text-white/70`}>
                          {speaker.pronouns}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <h2 className={`${typography.subtitle} text-white mb-2`}>
                    {speaker.name}
                  </h2>
                  
                  <p className={`${typography.section} text-[#CAA3D6] mb-6`}>
                    {speaker.title}
                  </p>
                  
                  {/* Bio */}
                  <div className="prose prose-invert prose-sm md:prose-base max-w-none mb-8 overflow-y-auto max-h-[40vh] md:max-h-[50vh] custom-scrollbar pr-2">
                    {typeof speaker.bio === 'string' ? (
                      <p className={`${typography.body} text-white/80`}>{speaker.bio}</p>
                    ) : (
                      speaker.bio && (
                        <div className={`${typography.body} text-white/80`}>
                          <PortableText value={speaker.bio} />
                        </div>
                      )
                    )}
                  </div>
                </div>
                
                {/* Social Links */}
                <div className="mt-auto flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                  {speaker.linkedinUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30 
                               text-white rounded-full"
                    >
                      <a 
                        href={speaker.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        <Linkedin className="w-4 h-4 mr-2" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}