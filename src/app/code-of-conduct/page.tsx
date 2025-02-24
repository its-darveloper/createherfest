"use client"

import { motion } from 'framer-motion'
import { Shield, Heart, MessageCircle, Users, AlertCircle } from 'lucide-react'
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

export default function CodeOfConductPage() {
  const highlightGroups = [
    {
      icon: Shield,
      title: "Our Ultimate Goal",
      content: "CreateHER Fest is dedicated to empowering women and non-binary individuals in technology, fostering innovation, collaboration, and inclusion. We exist to create a safe environment, fostering inclusivity and access while encouraging collaboration and learning.",
      color: "text-[#37D5D6]",
      bgColor: "bg-[#37D5D6]/10"
    },
    {
      icon: Heart,
      title: "Zero Tolerance for Harassment",
      content: "Harassment of any kind, including but not limited to verbal abuse, discriminatory jokes, unwanted sexual attention, and physical intimidation, is strictly prohibited. This applies to all forms of communication and interactions.",
      color: "text-[#4E6BFF]",
      bgColor: "bg-[#4E6BFF]/10"
    },
    {
      icon: MessageCircle,
      title: "Be Mindful of Your Words",
      content: "Avoid discriminatory, offensive, or harmful language, including microaggressions. Please be considerate of cultural differences and sensitivities. Consider what you are saying and how it would feel if it were said to or about you.",
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
          size="w-32 md:w-40 h-32 md:h-40"
          position="top-1/4 left-1/3"
          color="#37D5D6"
          delay={2}
          scale={[0.9, 1.1]}
        />
        <FloatingElement
          shape="polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
          size="w-60 md:w-72 h-60 md:h-72"
          position="top-1/3 right-0"
          color="#4E6BFF"
          delay={1}
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
              Code of Conduct
            </span>
          </div>
          <h1 className={`${typography.title} text-white mb-6 md:text-4xl sm:text-3xl`}>
            Creating a Safe and Inclusive Space
          </h1>
          <p className={`${typography.section} text-white/80 max-w-3xl mx-auto`}>
            We are committed to creating an excellent experience for everyone, regardless of gender identity 
            and expression, sexual orientation, disabilities, neurodiversity, physical appearance, ethnicity, 
            nationality, race, age, religion, or other protected category.
          </p>
        </motion.div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto mb-12 md:mb-16 px-4">
          {highlightGroups.map((group, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`${group.bgColor} border border-white/10 rounded-2xl p-6 md:p-8 
                         backdrop-blur-sm hover:bg-white/10 hover:border-white/20 
                         transition-all duration-300 transform hover:-translate-y-2
                         relative z-10`}
            >
              <div className={`mb-6 ${group.color} w-12 md:w-16 h-12 md:h-16 p-3 md:p-4 rounded-full 
                              flex items-center justify-center bg-white/10`}>
                <group.icon 
                  className="w-6 md:w-8 h-6 md:h-8" 
                  strokeWidth={1.5}
                />
              </div>
              <h3 className={`${typography.subheading} text-white mb-4`}>
                {group.title}
              </h3>
              <p className={`${typography.body} text-white/70`}>
                {group.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-invert prose-lg">
            {/* Core Values Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/5 rounded-2xl p-6 md:p-8 mb-8 backdrop-blur-sm border border-white/10"
            >
              <h2 className={`${typography.heading} text-white mb-6`}>Core Values</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#37D5D6]/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="w-4 h-4 text-[#37D5D6]" />
                  </div>
                  <div>
                    <h3 className={`${typography.subheading} text-white mb-2`}>Treat everyone with respect</h3>
                    <p className={`${typography.body} text-white/70`}>
                      Participate while acknowledging that everyone deserves to be here. Each of us has the right to enjoy 
                      our experience without fear of harassment, discrimination, or condescension, whether blatant or via 
                      micro-aggressions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#4E6BFF]/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <MessageCircle className="w-4 h-4 text-[#4E6BFF]" />
                  </div>
                  <div>
                    <h3 className={`${typography.subheading} text-white mb-2`}>Share knowledge freely</h3>
                    <p className={`${typography.body} text-white/70`}>
                      Workshops, discussions, and presentations are opportunities to learn and share insights. Encourage the 
                      exchange of ideas and support participants who may need help understanding new concepts.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#CAA3D6]/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Heart className="w-4 h-4 text-[#CAA3D6]" />
                  </div>
                  <div>
                    <h3 className={`${typography.subheading} text-white mb-2`}>Support and uplift others</h3>
                    <p className={`${typography.body} text-white/70`}>
                      This event is about collaboration over competition. Offer constructive feedback, mentor fellow 
                      participants, and create an environment where everyone can grow, innovate, and succeed.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Reporting Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-[#473DC6]/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-[#473DC6]/20"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#473DC6]/20 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-[#CAA3D6]" />
                </div>
                <div>
                  <h2 className={`${typography.heading} text-white mb-4`}>Reporting and Assistance</h2>
                  <p className={`${typography.body} text-white/70 mb-4`}>
                    If you are being harassed, notice someone else being harassed, or have any other concerns, 
                    contact a member of the event staff right away. Event staff can be identified by special badges.
                  </p>
                  <p className={`${typography.body} text-white/70`}>
                    Contact us at{' '}
                    <a href="mailto:info@createherfest.com" 
                       className="text-[#CAA3D6] hover:text-white transition-colors duration-300">
                      info@createherfest.com
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

