// components/speakers/apply-speaker-cta.tsx
"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Mic, Users, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { typography } from '@/lib/utils/typography'

export function ApplySpeakerCTA() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative max-w-5xl mx-auto">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#473DC6]/20 via-[#CAA3D6]/20 to-[#473DC6]/20 blur-xl
                       transform scale-110 rounded-3xl opacity-70" />
          
          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative bg-gradient-to-b from-[#1c144d] to-[#150E60] overflow-hidden
                     rounded-3xl border border-[#473DC6]/30 p-10 md:p-16"
          >
            {/* Decorative shapes */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#473DC6]/20 rounded-full blur-[80px] opacity-60" />
            <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-[#CAA3D6]/20 rounded-full blur-[80px] opacity-40" />
            
            <div className="relative grid md:grid-cols-2 gap-12 md:gap-24 items-center">
              <div className="text-center md:text-left">
                <h2 className={`${typography.title} text-white mb-6`}>
                  Share Your <span className="text-[#CAA3D6]">Expertise</span>
                </h2>
                
                <p className={`${typography.section} text-white/80 mb-8`}>
                  Join our community of thought leaders and help empower the next generation of women in technology.
                </p>
                
                <Button
                  asChild
                  className="bg-[#473DC6] hover:bg-[#5e50ff] text-white
                           shadow-lg hover:shadow-xl hover:shadow-[#473DC6]/20
                           transition-all duration-300 rounded-xl px-8 py-6 text-lg group"
                >
                  <Link 
                    href="https://tally.so/r/wzJkBE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <span>Apply to Speak</span>
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
              
              {/* Features section */}
              <div>
                <ul className="space-y-6">
                  <motion.li 
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-[#473DC6]/30 rounded-xl p-3 flex-shrink-0">
                      <Mic className="w-6 h-6 text-[#CAA3D6]" />
                    </div>
                    <div>
                      <h3 className={`${typography.subheading} text-white mb-1`}>
                        Amplify Your Voice
                      </h3>
                      <p className={`${typography.body} text-white/70`}>
                        Reach a diverse audience passionate about emerging technologies.
                      </p>
                    </div>
                  </motion.li>
                  
                  <motion.li 
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-[#473DC6]/30 rounded-xl p-3 flex-shrink-0">
                      <Users className="w-6 h-6 text-[#CAA3D6]" />
                    </div>
                    <div>
                      <h3 className={`${typography.subheading} text-white mb-1`}>
                        Join Our Community
                      </h3>
                      <p className={`${typography.body} text-white/70`}>
                        Connect with other industry leaders and innovative thinkers.
                      </p>
                    </div>
                  </motion.li>
                  
                  <motion.li 
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-[#473DC6]/30 rounded-xl p-3 flex-shrink-0">
                      <Star className="w-6 h-6 text-[#CAA3D6]" />
                    </div>
                    <div>
                      <h3 className={`${typography.subheading} text-white mb-1`}>
                        Make an Impact
                      </h3>
                      <p className={`${typography.body} text-white/70`}>
                        Inspire the next generation of women in technology.
                      </p>
                    </div>
                  </motion.li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}