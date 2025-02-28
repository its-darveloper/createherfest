// components/sections/about-section.tsx
"use client"

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Target, Code, Network, ArrowRight } from 'lucide-react'
import Link from 'next/link'
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

export function AboutSection() {
  const featureVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <section className="relative bg-[#150E60] overflow-hidden py-16 md:py-24 section about-section">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Learning themed elements */}
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

        {/* Innovation themed elements */}
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

        {/* Community themed elements */}
        <FloatingElement
          shape="polygon(0 40%, 100% 0%, 100% 60%, 0% 100%)"
          size="w-64 md:w-80 h-64 md:h-80"
          position="bottom-0 left-20"
          color="#CAA3D6"
          delay={2}
        />
        <FloatingElement
          shape="circle(50% at 50% 50%)"
          size="w-28 md:w-32 h-28 md:h-32"
          position="top-1/2 right-1/3"
          color="#CAA3D6"
          delay={4}
        />
      </div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-12 md:mb-20"
        >
          <div className="shimmer-container inline-block bg-[#473DC6]/20 px-4 py-2 rounded-full mb-6
                        border border-[#473DC6]/30 hover:border-white/20 transition-all duration-300">
            <span className={`${typography.caption} text-[#CAA3D6] uppercase tracking-widest`}>
              About CreateHER Fest
            </span>
          </div>
          <h2 className={`${typography.title} text-white mb-6 text-4xl`}>
            Transforming Tech, Empowering Women
          </h2>
          <p className={`${typography.section} text-white/80 max-w-3xl mx-auto`}>
            A groundbreaking initiative designed to bridge the gender gap in emerging technologies through hands-on learning, collaborative innovation, and skill development.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto mb-12 md:mb-16 px-4 relative z-10">
          {[
            {
              icon: Target,
              title: "Comprehensive Learning",
              description: "Multi-phase program covering AI, Blockchain, AR/VR, and cutting-edge tech fields.",
              color: "text-[#37D5D6]",
              bgColor: "bg-[#37D5D6]/10"
            },
            {
              icon: Code,
              title: "Hands-On Innovation",
              description: "Transform theoretical knowledge into practical solutions for real-world challenges.",
              color: "text-[#4E6BFF]",
              bgColor: "bg-[#4E6BFF]/10"
            },
            {
              icon: Network,
              title: "Community & Growth",
              description: "Connect with industry leaders, mentors, and like-minded women in tech.",
              color: "text-[#CAA3D6]",
              bgColor: "bg-[#CAA3D6]/10"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={featureVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={`${feature.bgColor} border border-white/10 rounded-2xl p-6 md:p-8 
                         backdrop-blur-sm hover:bg-white/10 hover:border-white/20 
                         transition-all duration-300 transform hover:-translate-y-2
                         relative z-10`}
            >
              <div className={`mb-6 ${feature.color} w-12 md:w-16 h-12 md:h-16 p-3 md:p-4 rounded-full 
                              flex items-center justify-center bg-white/10`}>
                <feature.icon 
                  className="w-6 md:w-8 h-6 md:h-8" 
                  strokeWidth={1.5}
                />
              </div>
              <h3 className={`${typography.subheading} text-white mb-4`}>
                {feature.title}
              </h3>
              <p className={`${typography.body} text-white/70 mb-6`}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center relative z-10"
        >
          <Button 
            size="lg" 
            className="bg-[#473DC6] hover:bg-[#CAA3D6] text-white
                     transition-colors duration-300 px-8 md:px-12 py-3 md:py-4
                     rounded-full shadow-lg hover:shadow-xl"
            asChild
          >
            <Link 
              href="https://form.jotform.com/243616450118149"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <span className={typography.section}>Join CreateHER Fest</span>
              <ArrowRight className="ml-2 md:ml-3 w-5 md:w-6 h-5 md:h-6" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}