// components/speakers/speakers-hero.tsx
"use client"

import { motion } from 'framer-motion'
import { typography } from '@/lib/utils/typography'

// Enhanced animated gradient background element
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Main gradient blobs */}
      <div className="absolute -top-1/4 left-1/4 w-1/2 h-1/2 bg-[#473dc6]/30 rounded-full blur-[120px] opacity-60 animate-pulse" 
           style={{ animationDuration: '15s' }}></div>
      <div className="absolute -bottom-1/4 right-1/4 w-1/2 h-1/2 bg-[#caa3d6]/30 rounded-full blur-[120px] opacity-50 animate-pulse"
           style={{ animationDuration: '20s', animationDelay: '2s' }}></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-[0.03]"></div>
      
      {/* Subtle moving light beam */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-r from-transparent via-[#473dc6]/10 to-transparent 
                    -rotate-45 blur-3xl animate-moveLeftRight opacity-30"
           style={{ animationDuration: '25s' }}></div>
      
      {/* Accent lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#caa3d6]/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#473dc6]/30 to-transparent"></div>
    </div>
  )
}

export function SpeakersHero() {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      <AnimatedBackground />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center"
          >
            <div className="shimmer-container inline-block backdrop-blur-sm bg-[#473DC6]/10 border border-[#473DC6]/30 
                         px-6 py-2 rounded-full mb-6 overflow-hidden hover:border-white/20 transition-all duration-300">
              <span className={`${typography.caption} text-[#CAA3D6] uppercase tracking-widest`}>
                Meet Our Speakers
              </span>
            </div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className={`${typography.title} text-white mb-6 text-center relative`}
            >
              <span className="relative z-10">Meet the</span>{' '}
              <span className="text-[#CAA3D6] relative">
                LeadHERs
                <span className="absolute -inset-1 bg-[#CAA3D6]/20 blur-xl rounded-full -z-10 opacity-70"></span>
              </span>
              
              {/* Text shadow effect */}
              <span className="absolute inset-0 text-white/5 blur-xl transform scale-105 -z-10">
                Meet the LeadHERs
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className={`${typography.section} text-white/80 max-w-3xl mx-auto text-center`}
            >
              Discover an exceptional community of facilitators who are driving innovation 
              and inclusivity. Our experts bring knowledge, passion, and inspiration to every session.
            </motion.p>
            
            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap gap-6 md:gap-12 justify-center mt-12"
            >
              <div className="text-center px-4">
                <p className={`${typography.heading} text-white mb-1`}>30+ Facilitators</p>
                <p className={`${typography.caption} text-white/60`}>Industry experts</p>
              </div>
              <div className="text-center px-4">
                <p className={`${typography.heading} text-white mb-1`}>20+ Workshops</p>
                <p className={`${typography.caption} text-white/60`}>Cutting-edge topics</p>
              </div>
              <div className="text-center px-4">
                <p className={`${typography.heading} text-white mb-1`}>Explore</p>
                <p className={`${typography.caption} text-white/60`}>Diverse expertise</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-auto opacity-10">
          <path fill="#473DC6" fillOpacity="0.5" d="M0,224L80,218.7C160,213,320,203,480,213.3C640,224,800,256,960,240C1120,224,1280,160,1360,128L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  )
}