// components/sections/partners-section.tsx
"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { getPartners, urlFor } from '@/lib/sanity'
import type { Partner } from '@/types/sanity'
import { typography } from '@/lib/utils/typography'
import { ArrowRight } from 'lucide-react'

export function PartnersSection() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await getPartners()
        setPartners(data)
      } catch (error) {
        console.error('Error fetching partners:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPartners()
  }, [])

  // Extend partners array for continuous scrolling
  const extendedPartners = [...partners, ...partners, ...partners, ...partners]

  if (isLoading) {
    return (
      <section className="relative w-full bg-[#150E60] py-16 md:py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 md:mb-24">
            <div className="animate-pulse bg-white/10 w-32 h-8 mx-auto rounded-full mb-6" />
            <div className="animate-pulse bg-white/10 w-72 md:w-96 h-12 mx-auto rounded mb-6" />
            <div className="animate-pulse bg-white/10 w-64 md:w-80 h-6 mx-auto rounded" />
          </div>
          <div className="flex justify-center space-x-4 md:space-x-8 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-white/10 w-32 md:w-40 h-24 md:h-32 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative w-full bg-[#150E60] py-16 md:py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-1/2 h-1/3 bg-[#473DC6]/5 rounded-full blur-[150px] opacity-60 transform -translate-x-1/2" />
        <div className="absolute bottom-0 right-1/4 w-1/2 h-1/3 bg-[#CAA3D6]/5 rounded-full blur-[150px] opacity-60 transform translate-x-1/2" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16">
          <div className="inline-block relative mb-6">
            <div className="absolute inset-0 bg-[#473DC6]/30 blur-lg rounded-full transform scale-150 opacity-30" />
            <div className="relative backdrop-blur-sm bg-[#473DC6]/10 border border-[#473DC6]/30 
                         px-6 py-2 rounded-full overflow-hidden">
              <span className={`${typography.caption} text-[#CAA3D6] uppercase tracking-widest`}>
                OUR PARTNERS
              </span>
              {/* Subtle moving highlight */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#CAA3D6]/70 to-transparent
                           animate-shimmer" />
            </div>
          </div>
          
          <h2 className={`${typography.title} text-white mb-5 text-3xl md:text-4xl`}>
            Supported by Innovative Leaders
          </h2>
          
          <p className={`${typography.section} text-white/80 max-w-3xl mx-auto`}>
            Collaborating with forward-thinking organizations to bridge the gender gap in emerging tech fields
          </p>
        </div>

        {/* Logo Marquee with improved performance */}
        <div className="relative w-full overflow-hidden mb-16 md:mb-24">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 w-16 sm:w-32 md:w-64 h-full bg-gradient-to-r from-[#150E60] via-[#150E60]/90 to-transparent z-10" />
          <div className="absolute right-0 top-0 w-16 sm:w-32 md:w-64 h-full bg-gradient-to-l from-[#150E60] via-[#150E60]/90 to-transparent z-10" />

          <motion.div
            className="flex"
            animate={{
              x: [0, `-${partners.length * 50}%`],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 35, // Slower for better readability
                ease: "linear",
              },
            }}
          >
            <div className="flex">
              {extendedPartners.map((partner, index) => (
                <div 
                  key={`${partner._id}-${index}`}
                  className="flex items-center justify-center mx-6 sm:mx-8 md:mx-16 
                           w-36 sm:w-40 md:w-[200px] h-24 sm:h-28 md:h-32 
                           bg-gradient-to-b from-white/8 to-white/4
                           border border-white/10 rounded-2xl backdrop-blur-sm 
                           transition-all duration-300 hover:bg-white/10 
                           hover:border-white/20 hover:shadow-lg
                           hover:shadow-[#473DC6]/10"
                >
                  {partner.website ? (
                    <Link 
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-full flex items-center justify-center p-4 sm:p-6"
                      aria-label={`Visit ${partner.name}'s website`}
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={urlFor(partner.logo).width(160).height(80).url()}
                          alt={partner.name}
                          fill
                          className="object-contain brightness-0 invert opacity-60 
                                   transition-opacity duration-300 hover:opacity-100"
                          sizes="(max-width: 640px) 144px, (max-width: 768px) 160px, 200px"
                        />
                      </div>
                    </Link>
                  ) : (
                    <div className="relative w-[80%] h-[80%]">
                      <Image
                        src={urlFor(partner.logo).width(160).height(80).url()}
                        alt={partner.name}
                        fill
                        className="object-contain brightness-0 invert opacity-60"
                        sizes="(max-width: 640px) 120px, (max-width: 768px) 130px, 160px"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* CTA Section with improved design */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="bg-[#473DC6]/10 backdrop-blur-sm border border-[#473DC6]/20 
                        rounded-2xl p-6 md:p-8">
            <p className={`${typography.section} text-white/80 mb-6`}>
              Interested in shaping the future of tech?
            </p>
            <Link 
              href="https://tally.so/r/nWMoXj" 
              className="inline-flex items-center group"
            >
              <span className={`
                ${typography.subheading} text-white group-hover:text-[#CAA3D6] 
                border-b border-white/30 group-hover:border-[#CAA3D6] 
                pb-1 transition-all duration-300
              `}>
                Explore Partnership Opportunities
              </span>
              <ArrowRight className="ml-3 w-5 h-5 text-white group-hover:text-[#CAA3D6] 
                                    transition-all duration-300 transform 
                                    group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}