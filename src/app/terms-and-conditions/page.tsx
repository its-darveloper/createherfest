"use client"

import { motion } from 'framer-motion'
import { Scale, BookOpen, Brain, FileCheck, AlertTriangle } from 'lucide-react'
import { typography } from '@/lib/utils/typography'

interface FloatingElementProps {
  shape: string
  size: string
  position: string
  color: string
  delay?: number
  duration?: number
  scale?: number[]
}

function FloatingElement({ 
  shape, 
  size, 
  position, 
  color,
  delay = 0,
  duration = 20,
  scale = [0.8, 1.2]
}: FloatingElementProps) {
  return (
    <motion.div
      className={`absolute ${size} ${position} backdrop-blur-3xl rounded-3xl`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        opacity: [0.1, 0.3, 0.1],
        scale: scale,
        rotate: [0, 180],
        y: ['0%', '-20%', '0%']
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay: delay
      }}
      style={{
        clipPath: shape,
        background: `linear-gradient(to bottom right, ${color}20, ${color}05)`
      }}
    />
  )
}

export default function TermsPage() {
  const termHighlights = [
    {
      icon: BookOpen,
      title: "Event Participation",
      content: "Registration is required for all CreateHER Fest activities. Participants must provide accurate information and follow our Code of Conduct.",
      color: "text-[#37D5D6]",
      bgColor: "bg-[#37D5D6]/10"
    },
    {
      icon: Brain,
      title: "Intellectual Property",
      content: "Your projects remain your IP, but you grant us license to showcase your work. Event materials are for personal use only.",
      color: "text-[#4E6BFF]",
      bgColor: "bg-[#4E6BFF]/10"
    },
    {
      icon: Scale,
      title: "Event Rules",
      content: "All submissions must be original work. Teams must follow event guidelines and be registered participants.",
      color: "text-[#CAA3D6]",
      bgColor: "bg-[#CAA3D6]/10"
    }
  ]

  return (
    <section className="relative w-full bg-[#150E60] overflow-hidden py-16 md:py-24">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <FloatingElement
          shape="polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)"
          size="w-72 md:w-96 h-72 md:h-96"
          position="-top-20 -left-20"
          color="#37D5D6"
          delay={0}
        />
        <FloatingElement
          shape="circle(50% at 50% 50%)"
          size="w-40 md:w-48 h-40 md:h-48"
          position="bottom-1/4 right-1/4"
          color="#4E6BFF"
          delay={3}
        />
      </div>

      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-12 md:mb-20"
        >
          <div className="shimmer-container inline-block bg-[#473DC6]/20 px-4 py-2 rounded-full mb-6
                        border border-[#473DC6]/30 hover:border-white/20 transition-all duration-300">
            <span className={`${typography.caption} text-[#CAA3D6] uppercase tracking-widest`}>
              Terms & Conditions
            </span>
          </div>
          <h1 className={`${typography.title} text-white mb-6 md:text-4xl sm:text-3xl`}>
            Event Guidelines & Rules
          </h1>
          <p className={`${typography.section} text-white/80 max-w-3xl mx-auto`}>
            By participating in CreateHER Fest events, you agree to these terms and conditions 
            designed to ensure a positive experience for all participants.
          </p>
        </motion.div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto mb-12 md:mb-16 px-4">
          {termHighlights.map((term, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`${term.bgColor} border border-white/10 rounded-2xl p-6 md:p-8 
                         backdrop-blur-sm hover:bg-white/10 hover:border-white/20 
                         transition-all duration-300 transform hover:-translate-y-2
                         relative z-10`}
            >
              <div className={`mb-6 ${term.color} w-12 md:w-16 h-12 md:h-16 p-3 md:p-4 rounded-full 
                              flex items-center justify-center bg-white/10`}>
                <term.icon 
                  className="w-6 md:w-8 h-6 md:h-8" 
                  strokeWidth={1.5}
                />
              </div>
              <h3 className={`${typography.subheading} text-white mb-4`}>
                {term.title}
              </h3>
              <p className={`${typography.body} text-white/70`}>
                {term.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {/* Event Participation Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-white/10"
            >
              <h2 className={`${typography.heading} text-white mb-6`}>Event Participation</h2>
              <div className="space-y-4">
                <div>
                  <h3 className={`${typography.subheading} text-white mb-2`}>Registration</h3>
                  <p className={`${typography.body} text-white/70`}>
                    You must register for CreateHER Fest to participate in workshops, the Idea-thon, and Hackathon. 
                    You agree to provide accurate and complete information during registration.
                  </p>
                </div>
                <div>
                  <h3 className={`${typography.subheading} text-white mb-2`}>Eligibility</h3>
                  <p className={`${typography.body} text-white/70`}>
                    CreateHER Fest is open to individuals who meet the event's eligibility requirements. 
                    Participation may be limited based on specific event rules or sponsorship conditions.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Intellectual Property Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-white/10"
            >
              <h2 className={`${typography.heading} text-white mb-6`}>Intellectual Property</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#473DC6]/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#CAA3D6]" />
                  </div>
                  <p className={`${typography.body} text-white/70`}>
                    <strong className="text-white">Your Content:</strong> Any projects or materials you create 
                    during the event remain your intellectual property. However, by submitting content during 
                    the event, you grant CreateHER Fest and its partners and sponsors a non-exclusive license 
                    to showcase or promote your work.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#473DC6]/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#CAA3D6]" />
                  </div>
                  <p className={`${typography.body} text-white/70`}>
                    <strong className="text-white">Event Materials:</strong> Materials provided during the event 
                    (e.g., workshops, presentations) are the intellectual property of the respective facilitators 
                    and are for personal use only.
                  </p>
                </li>
              </ul>
            </motion.div>

            {/* Liability Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-[#473DC6]/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-[#473DC6]/20"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#473DC6]/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-[#CAA3D6]" />
                </div>
                <div>
                  <h2 className={`${typography.heading} text-white mb-4`}>Liability</h2>
                  <div className="space-y-4">
                    <p className={`${typography.body} text-white/70`}>
                      <strong className="text-white">No Warranty:</strong> CreateHER Fest is provided "as is," 
                      and we make no guarantees about the availability or quality of services.
                    </p>
                    <p className={`${typography.body} text-white/70`}>
                      <strong className="text-white">Limitation of Liability:</strong> CreateHER Fest and its 
                      organizers are not responsible for any damages, loss, or injury resulting from your 
                      participation in the event.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-white/10"
            >
              <h2 className={`${typography.heading} text-white mb-4`}>Contact Information</h2>
              <p className={`${typography.body} text-white/70`}>
                For questions regarding these Terms & Conditions, please contact us at{' '}
                <a 
                  href="mailto:info@createherfest.com"
                  className="text-[#CAA3D6] hover:text-white transition-colors duration-300"
                >
                  info@createherfest.com
                </a>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}