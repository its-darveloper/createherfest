"use client"

import React from 'react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Lightbulb, Code, Calendar, ArrowRight, Users, Award, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { typography } from '@/lib/utils/typography'

export function EventSeries() {
  const [selectedPhase, setSelectedPhase] = useState<number>(0)

  const eventPhases = [
    {
      title: "Learn-a-thon",
      dates: "DEC 9 - FEB 28",
      description: "During the Learn-a-thon, participants will learn from industry leaders in AI/ML, AR/VR, and Blockchain. The goal is to develop technical skills and learn to think like innovators, preparing for future phases.",
      icon: BookOpen,
      color: "#37D5D6",
      stats: [
        { value: "30+", label: "Workshops", icon: Calendar },
        { value: "50+", label: "Experts", icon: Users },
        { value: "400+ hours", label: "Content", icon: Clock }
      ],
      features: [
        "Live interactive sessions", 
        "Hands-on technical workshops",
        "Connect with fellow innovators",
        "Preparation for Idea- & Hackathon"
      ],
      progressColor: "from-[#37D5D6] to-[#37D5D6]/50"
    },
    {
      title: "Idea-thon",
      dates: "FEB 28 - MAR 2",
      description: "A collaborative brainstorming event where participants refine ideas and develop project concepts based on skills acquired during the Learn-a-thon, focusing on real-world impact and innovation.",
      icon: Lightbulb,
      color: "#4E6BFF",
      stats: [
        { value: "100+", label: "Resources", icon: Clock },
        { value: "10+", label: "Mentors", icon: Users },
        // { value: "$2K", label: "In prizes", icon: Award }
      ],
      features: [
        "Team formation support",
        "Access to mentor guidance",
        "Extensive resource library",
        "Pitch development assistance"
      ],
      progressColor: "from-[#4E6BFF] to-[#4E6BFF]/50"
    },
    {
      title: "Hackathon",
      dates: "MAR 3 - MAR 8",
      description: "Participants will bring their ideas to life by building working prototypes in a competitive hackathon format. Teams will develop solutions aligned with the UN Sustainable Development Goals and compete for prizes up to $3,500.",
      icon: Code,
      color: "#CAA3D6",
      stats: [
        { value: "5", label: "Days", icon: Calendar },
        { value: "$3.5K", label: "In prizes", icon: Award },
        { value: "4", label: "Categories", icon: Lightbulb }
      ],
      features: [
        "Technical workshops",
        "24/7 mentor support",
        "API & tool access",
        "Virtual demo day"
      ],
      progressColor: "from-[#CAA3D6] to-[#CAA3D6]/50"
    }
  ]

  return (
    <section className="relative bg-[#150E60] py-16 md:py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-[#473DC6]/30 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-[#CAA3D6]/20 rounded-full blur-[128px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-12 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="shimmer-container inline-block backdrop-blur-sm bg-[#473DC6]/10 border border-[#473DC6]/30 
                     px-6 py-2 rounded-full mb-6 overflow-hidden hover:border-white/20 transition-all duration-300"
          >
            <span className={`${typography.caption} text-[#CAA3D6] uppercase tracking-widest`}>
              EVENT SERIES
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className={`${typography.title} text-white mb-6 text-3xl md:text-4xl`}
          >
            Your Journey to Tech Innovation
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className={`${typography.section} text-white/80 max-w-3xl mx-auto`}
          >
            Join us on a transformative three-phase journey designed to empower women in tech through learning, ideation, and creation
          </motion.p>
        </div>

        {/* Event Series Container */}
        <div className="max-w-5xl mx-auto relative z-10">
          {/* Phase Navigation */}
          <div className="mb-8 md:mb-16">
            {/* Vertical timeline for mobile, horizontal for desktop */}
            <div className="flex flex-col md:flex-row md:items-center w-full">
              {eventPhases.map((phase, index) => (
                <div key={index} className="flex-1 relative mb-4 md:mb-0">
                  {/* Phase button */}
<motion.button
  onClick={() => setSelectedPhase(index)}
  className={`
    relative flex flex-row md:flex-col items-center md:justify-center w-full p-4 md:py-6 z-10
    transition-all duration-300 group
    ${selectedPhase === index 
      ? 'opacity-100' 
      : 'opacity-70 hover:opacity-90'}
  `}
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.98 }}
>
  {/* Icon circle with improved sizing and positioning */}
  <motion.div 
    className={`
      relative flex items-center justify-center rounded-full
      border border-white/20 transition-all duration-300
      ${selectedPhase === index 
        ? 'border-opacity-40' 
        : 'border-opacity-20'}
    `}
    animate={{ 
      width: selectedPhase === index ? 56 : 52,
      height: selectedPhase === index ? 56 : 52,
      backgroundColor: selectedPhase === index 
        ? `${phase.color}20` 
        : 'rgba(255,255,255,0.05)'
    }}
  >
    {/* Phase Icon */}
    {React.createElement(phase.icon, {
      className: "w-6 h-6",
      strokeWidth: 1.5,
      style: { color: phase.color }
    })}
    
    {/* Number badge - more subtle styling */}
    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#473DC6]/80 
                   flex items-center justify-center
                   border border-[#150E60]/80">
      <span className="text-white/90 text-xs">
        {index + 1}
      </span>
    </div>
  </motion.div>
  
  {/* Title & subtitle with improved spacing */}
  <div className="text-left md:text-center ml-4 md:ml-0 md:mt-6">
    <h3 className={`${typography.body} md:${typography.subheading} text-white mb-2`}>
      {phase.title}
    </h3>
    <p className={`${typography.caption} text-white/60 text-xs md:text-sm `}>
      {phase.dates}
    </p>
  </div>
  
  {/* Selected indicator - adjusted position */}
  {selectedPhase === index && (
    <motion.div
      layoutId="selected-phase"
      className="absolute md:-bottom-8 -right-1 md:right-auto md:left-1/2 
                top-1/2 md:top-auto h-full md:h-0.5 w-1 md:w-16 
                rounded-full transform md:-translate-x-1/2 -translate-y-1/2 md:translate-y-0"
      style={{ 
        backgroundColor: phase.color,
      }}
    />
  )}
</motion.button>

{/* Connection lines - simplified and repositioned */}
{index < eventPhases.length - 1 && (
  <>
    {/* Vertical line for mobile */}
    <div className="md:hidden absolute left-[26px] top-[60px] h-[calc(100%-32px)] w-[2px]">
      <div className="w-full h-full bg-white/10" />
    </div>
    
    {/* Horizontal line for desktop - repositioned */}
    <div className="hidden md:block absolute bottom-[76px] right-0 w-full h-[1px]">
      <div className="w-full h-full bg-white/10" />
    </div>
  </>
)}
                </div>
              ))}
            </div>
          </div>

          {/* Phase Details */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPhase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="relative rounded-3xl overflow-hidden"
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#1b175a]/80 to-[#150E60]/80" />
              
              {/* Background pattern */}
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-[0.03]" />
              
              {/* Card content */}
              <div className="relative z-10 p-6 md:p-12">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
                  {/* Left side: Phase info */}
                  <div className="flex-1">
                    <div className="flex items-start mb-6">
                      <div 
                        className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mr-4 md:mr-6 border border-white/10 mb"
                        style={{ 
                          backgroundColor: `${eventPhases[selectedPhase].color}20`, 
                          boxShadow: `0 0 20px ${eventPhases[selectedPhase].color}30`
                        }}
                      >
                        {React.createElement(eventPhases[selectedPhase].icon, {
                          className: "w-7 h-7 md:w-8 md:h-8",
                          strokeWidth: 1.5,
                          style: { color: eventPhases[selectedPhase].color }
                        })}
                      </div>
                      <div>
                        <h3 className={`${typography.heading} text-white mb-1 md:mb-2`}>
                          {eventPhases[selectedPhase].title}
                        </h3>
                        <p className={`${typography.caption} text-white/60`}>
                          {eventPhases[selectedPhase].dates}
                        </p>
                      </div>
                    </div>

                    <p className={`${typography.body} md:${typography.section} text-white/80 mb-6 md:mb-8`}>
                      {eventPhases[selectedPhase].description}
                    </p>

                    {/* Phase stats */}
                    {eventPhases[selectedPhase].stats && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
                        {eventPhases[selectedPhase].stats.map((stat, i) => (
                          <div 
                            key={i}
                            className="bg-white/5 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/10"
                          >
                            <div className="flex items-center mb-1 md:mb-2">
                              {React.createElement(stat.icon, {
                                className: "w-4 h-4 mr-2 text-white/60"
                              })}
                              <span className={`${typography.caption} text-white/60`}>
                                {stat.label}
                              </span>
                            </div>
                            <div className={`${typography.subheading} md:${typography.heading} text-white md:text-lg sm:text-base`}>
                              {stat.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <Button 
                      className={`
                        bg-[#473dc6] hover:bg-[#5246e5] text-white px-6 md:px-8 py-4 md:py-6
                        transition-all duration-300 rounded-xl group shadow-md w-full sm:w-auto
                        hover:shadow-xl hover:shadow-[#473dc6]/20 btn-shimmer
                      `}
                      asChild
                    >
                      <Link 
                        href="https://form.jotform.com/243616450118149" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center"
                      >
                        <span className={typography.body}>Register Now</span>
                        <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>

                  {/* Right side: Features */}
                  <div className="w-full lg:w-80 xl:w-96 mt-6 lg:mt-0">
                    <div className="bg-[#473DC6]/10 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-[#473DC6]/20">
                      <h4 className={`${typography.subheading} text-white mb-4 md:mb-6`}>
                        What to expect
                      </h4>
                      <ul className="space-y-3 md:space-y-4">
                        {eventPhases[selectedPhase].features.map((feature, i) => (
                          <motion.li 
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start"
                          >
                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#473DC6]/30 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full" style={{ backgroundColor: eventPhases[selectedPhase].color }} />
                            </div>
                            <span className={`${typography.body} text-white/90`}>{feature}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="mt-8 md:mt-12">
                  <div className="flex justify-between mb-2">
                    <span className={`${typography.caption} text-white/60`}>Progress</span>
                    <span className={`${typography.caption} text-white/60`}>
                      Phase {selectedPhase + 1} of {eventPhases.length}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full bg-gradient-to-r ${eventPhases[selectedPhase].progressColor}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(selectedPhase + 1) * 33.33}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}