// components/faqs/faqs-hero.tsx
"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input' 
import { typography } from '@/lib/utils/typography'

export function FAQsHero() {
  const [searchQuery, setSearchQuery] = useState('')
  
  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-16 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-6 backdrop-blur-sm bg-[#473DC6]/10 border border-[#473DC6]/30 
                     px-6 py-2 rounded-full overflow-hidden"
          >
            <span className={`${typography.caption} text-[#CAA3D6] uppercase tracking-widest`}>
              Support Center
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`${typography.title} text-white mb-4`}
          >
            Frequently Asked Questions
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`${typography.section} text-white/70 mb-8`}
          >
            Find answers to common questions about CreateHER Fest events, 
            registration, workshops and more.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative max-w-md mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  // Emit custom event that FAQsSection will listen for
                  window.dispatchEvent(new CustomEvent('faq-search', { 
                    detail: { query: e.target.value } 
                  }))
                }}
                className="pl-10 py-6 bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
