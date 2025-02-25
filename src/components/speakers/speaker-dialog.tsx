// components/speakers/speaker-dialog.tsx
"use client"

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Linkedin, ExternalLink } from 'lucide-react'
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
  const dialogRef = useRef<HTMLDivElement>(null)
  
  // Close dialog with escape key and clicks outside
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    
    const handleClickOutside = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node) && isOpen) {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEscapeKey)
    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
      document.removeEventListener('mousedown', handleClickOutside)
    }
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
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
          aria-modal="true"
          role="dialog"
          aria-labelledby="speaker-dialog-title"
        >
          {/* Backdrop with subtle blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-[#0A083D]/90 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Dialog */}
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.4, type: 'spring', damping: 25 }}
            className="relative bg-[#150E60] border border-[#473DC6]/40 rounded-3xl
                     max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button with improved style and accessibility */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50
                       text-white/80 hover:text-white transition-all duration-200 border border-white/10
                       focus:outline-none focus:ring-2 focus:ring-[#CAA3D6]/50 focus:ring-offset-2 focus:ring-offset-[#1c144d]"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-hidden">
              {/* Left/Top Column - Speaker Image with cleaner styling */}
              <div className="md:w-2/5 relative flex-shrink-0 bg-[#1C144D]">
                <div className="h-80 md:h-full relative overflow-hidden">
                  {speaker.image ? (
                    <Image
                      src={urlFor(speaker.image).width(800).height(1200).url()}
                      alt={speaker.name}
                      fill
                      className="object-cover object-top"
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
                  
                  {/* Company & expertise tags */}
                  <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
                    {speaker.company && (
                      <div className="bg-[#150E60] rounded-full px-3 py-1 border border-[#473DC6]/40">
                        <span className={`${typography.caption} text-white`}>
                          {speaker.company}
                        </span>
                      </div>
                    )}
                    
                    {speaker.title && speaker.title.includes("AI") && (
                      <div className="bg-[#473DC6] rounded-full px-3 py-1">
                        <span className={`${typography.caption} text-white`}>
                          AI/ML
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Right/Bottom Column - Speaker Info with scrollable area */}
              <div className="md:w-3/5 p-6 md:p-10 relative flex flex-col h-full max-h-[60vh] md:max-h-[90vh] bg-[#1C144D]">
                <div className="overflow-y-auto custom-scrollbar pr-2">
                  {/* Speaker details section */}
                  <div className="mb-6">
                    <h2 className={`${typography.subtitle} text-white mb-2`} id="speaker-dialog-title">
                      {speaker.name}
                    </h2>
                    
                    <p className={`${typography.section} text-[#CAA3D6] mb-6`}>
                      {speaker.title}
                    </p>
                    
                    {speaker.pronouns && (
                      <div className="mb-4">
                        <span className={`${typography.caption} text-white/60 bg-white/10 px-3 py-1 rounded-full`}>
                          {speaker.pronouns}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Bio section */}
                  <div className="mb-8">
                    <h3 className={`${typography.subheading} text-white mb-4`}>
                      About
                    </h3>
                    <div className="prose prose-invert prose-sm md:prose-base max-w-none">
                      {typeof speaker.bio === 'string' ? (
                        <p className={`${typography.body} text-white/80 whitespace-pre-wrap`}>{speaker.bio}</p>
                      ) : (
                        speaker.bio && (
                          <div className={`${typography.body} text-white/80`}>
                            <PortableText 
                              value={speaker.bio}
                              components={{
                                block: {
                                  normal: ({ children }) => <p className="mb-4">{children}</p>,
                                },
                                marks: {
                                  strong: ({ children }) => <strong className="text-white">{children}</strong>,
                                  link: ({ children, value }) => (
                                    <a href={value?.href} target="_blank" rel="noopener noreferrer" 
                                       className="text-[#CAA3D6] hover:text-white transition-colors duration-200">
                                      {children}
                                    </a>
                                  ),
                                },
                              }}
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  
                  {/* Connect section */}
                  {speaker.linkedinUrl && (
                    <div>
                      <h3 className={`${typography.subheading} text-white mb-4`}>
                        Connect with {speaker.name.split(' ')[0]}
                      </h3>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          className="bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30 
                                  text-white rounded-lg group"
                          asChild
                        >
                          <a 
                            href={speaker.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center"
                          >
                            <Linkedin className="w-5 h-5 mr-2" />
                            LinkedIn
                          </a>
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="bg-[#473DC6]/20 border-[#473DC6]/40 hover:bg-[#473DC6]/30 
                                  text-white rounded-lg"
                          onClick={onClose}
                        >
                          <ExternalLink className="w-5 h-5 mr-2" />
                          Close
                        </Button>
                      </div>
                    </div>
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