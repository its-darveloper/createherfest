// components/sections/stats-section.tsx
"use client"

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { typography } from '@/lib/utils/typography'

interface CounterProps {
  value: number
  suffix?: string
  duration?: number
}

interface Stat {
  number: number
  label: string
  suffix: string
}

const stats: Stat[] = [
  { number: 400, label: "Women & allies registered", suffix: "+" },
  { number: 70, label: "Countries represented", suffix: "+" },
  { number: 30, label: "Social impressions", suffix: "k+" }
]

function Counter({ value, suffix = "", duration = 2 }: CounterProps) {
  const [count, setCount] = useState(0)
  const elementRef = useRef<HTMLSpanElement>(null)
  const isInView = useInView(elementRef, { once: true, margin: "-100px" })

  useEffect(() => {
    if (isInView) {
      let start = 0
      const end = value
      const totalDuration = duration * 1000
      const incrementTime = totalDuration / end

      const timer = setInterval(() => {
        start += 1
        setCount(start)
        if (start === end) clearInterval(timer)
      }, incrementTime)

      return () => clearInterval(timer)
    }
  }, [value, duration, isInView])

  return (
    <span ref={elementRef} className="tabular-nums">
      {count}{suffix}
    </span>
  )
}

export function StatsSection() {
    return (
      <section className="relative w-full bg-[#150E60] py-16 md:py-32 stats-section border-y border-white/10 overflow-hidden">
        {/* Background blur effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-[#473DC6]/30 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-[#CAA3D6]/20 rounded-full blur-[128px]" />
        </div>
  
        <div className="container relative mx-auto px-4">
          {/* Section Header */}
          <div className="text-center max-w-4xl mx-auto mb-12 md:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="shimmer-container inline-block backdrop-blur-md bg-[#473DC6]/10 
                       border border-white/10 px-4 py-2 rounded-full mb-6
                       shadow-[0_4px_12px_rgba(71,61,198,0.1)]
                       hover:border-white/20 transition-all duration-300"
            >
              <span className={`${typography.caption} text-[#CAA3D6] uppercase tracking-widest`}>
                Our Impact
              </span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className={`${typography.title} text-white mb-6 relative text-4xl`}
            >
              Making Global Impact
              <div className="absolute inset-0 blur-sm opacity-50 -z-10">Making Global Impact</div>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className={`${typography.section} text-white/80 max-w-3xl mx-auto`}
            >
              Join a growing community of tech innovators and change-makers from around the world
            </motion.p>
          </div>
  
          {/* Stats Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-16 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative group"
              >
                <div className="relative p-8 rounded-2xl 
                             backdrop-blur-md bg-gradient-to-b from-[#473DC6]/10 to-[#473DC6]/5
                             border border-white/10 
                             shadow-[0_8px_32px_rgba(71,61,198,0.1)]
                             group-hover:shadow-[0_8px_32px_rgba(71,61,198,0.2)]
                             group-hover:bg-gradient-to-b 
                             group-hover:from-[#473DC6]/20 
                             group-hover:to-[#473DC6]/10
                             group-hover:border-white/20
                             transition-all duration-500 ease-out
                             transform group-hover:-translate-y-1
                             flex flex-col justify-center min-h-[200px]"
                >
                  {/* Subtle inner glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent opacity-0 
                                group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <motion.div
                    className="relative text-center z-10"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className={`${typography.heading} text-white mb-4 drop-shadow-lg text-3xl`}>
                      <Counter value={stat.number} suffix={stat.suffix} />
                    </div>
                    <div className={`${typography.body} text-white/70 group-hover:text-white/90 
                                  transition-colors duration-300`}>
                      {stat.label}
                    </div>
                  </motion.div>
  
                  {/* Subtle glow effect on hover */}
                  <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100
                                bg-gradient-to-r from-[#473DC6]/20 via-[#CAA3D6]/20 to-[#473DC6]/20
                                blur-xl transition-opacity duration-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    )
  }