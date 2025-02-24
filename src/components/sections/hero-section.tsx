// components/sections/hero.tsx
"use client"

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { typography } from '@/lib/utils/typography'

export function Hero() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden hero-section">
      {/* Background Image */}
      <Image 
        src="/background.png"
        alt="Background"
        fill
        priority
        className="object-cover object-center"
        quality={90}
      />

      {/* Overlay Gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[#473dc6]/60 via-[#4238b8]/60 to-[#372dc6]/60 z-[1]"
      />

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] z-[3]"
        style={{
          backgroundImage: "linear-gradient(90deg, white 1px, transparent 0), linear-gradient(white 1px, transparent 0)",
          backgroundSize: "40px 40px"
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center py-16 md:py-32 hero-content">
        <div className="w-full max-w-4xl mx-auto px-4 flex flex-col items-center">
          {/* Partnership Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-4 md:gap-6 mb-16 md:mb-24"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-white/5 blur-xl rounded-full" />
              <div className="relative h-12 md:h-20 w-[200px] md:w-[320px]">
                <Image 
                  src="/google-women-techmakers.svg" 
                  alt="Google Women Techmakers"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <div className="shimmer-container bg-white/10 backdrop-blur-md border border-white/10 rounded-full 
                          px-4 md:px-8 py-2 md:py-4 shadow-2xl hover:shadow-white/5 transition-all duration-300 text-center
                          relative overflow-hidden group hover:border-white/20">
              <span className={`${typography.caption} text-white/90 text-xs md:text-sm`}>
                In Partnership with Google&apos;s Women Techmakers
              </span>
            </div>
          </motion.div>

          {/* Title Section */}
          <motion.div
            className="text-center mb-16 md:mb-32"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 w-72 md:w-96 h-72 md:h-96 
                            bg-[#caa3d6] rounded-full opacity-20 blur-[100px]" />
              <h1 className={`${typography.title} relative mb-6 md:mb-12 text-6xl md:text-8xl lg:text-8xl`}>
                <span className="text-white drop-shadow-2xl">Create</span>
                <span className="text-[#caa3d6] drop-shadow-2xl">HER</span>
                <br />
                <span className="text-white drop-shadow-2xl">Fest</span>
              </h1>
            </div>
            <p className={`${typography.section} text-white/90 max-w-[90%] md:max-w-2xl mx-auto 
                          text-base md:text-xl lg:text-2xl leading-relaxed 
                          px-4 md:px-0`}>
              Discover | Design | Deliver
            </p>
          </motion.div>

          {/* Buttons */}
          <motion.div
            className="flex items-center gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button 
              asChild
              className="group bg-white/90 hover:bg-white text-[#473dc6] 
                       font-medium rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)]
                       hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]
                       transition-all duration-300 hover:scale-105
                       px-6 md:px-12 py-5 md:py-7 text-base md:text-lg min-w-[160px] md:min-w-[180px]"
            >
              <Link 
                href="https://form.jotform.com/243616450118149"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                <span className="text-base md:text-lg">Register Now</span>
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}