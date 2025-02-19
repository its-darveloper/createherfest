// components/layout/footer.tsx
"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Instagram, Facebook, Linkedin, ArrowRight } from 'lucide-react'
import { typography } from '@/lib/utils/typography'

// Define consistent interface for all links
interface FooterLink {
  label: string;
  url: string;
  isExternal?: boolean;
}

interface SocialLink {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  url: string;
  name: string;
}

export function Footer() {
  const socialLinks: SocialLink[] = [
    { icon: Instagram, url: 'https://instagram.com/createherfest', name: 'Instagram' },
    { icon: Facebook, url: 'https://facebook.com/createherfest', name: 'Facebook' },
    { icon: Linkedin, url: 'https://linkedin.com/company/createherfest', name: 'LinkedIn' }
  ]

  const quickLinks: Record<string, FooterLink[]> = {
    'Engage': [
      { label: 'Register', url: 'https://form.jotform.com/243616450118149', isExternal: true },
      { label: 'Volunteer', url: 'https://tally.so/r/wdjO1y', isExternal: true },
      { label: 'Contact Us', url: 'https://tally.so/r/nrdyaN', isExternal: true },
      { label: 'Apply to Teach', url: 'https://tally.so/r/wzJkBE', isExternal: true }
    ],
    'Resources': [
      { label: 'Code of Conduct', url: '/code-of-conduct', isExternal: false },
      { label: 'Privacy Policy', url: '/privacy', isExternal: false },
      { label: 'Terms of Use', url: '/terms', isExternal: false },
      { label: 'FAQ Center', url: '/faqs', isExternal: false }
    ]
  }

  return (
    <footer className="bg-[#0A083D] text-white relative overflow-hidden py-8">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/10" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#473DC6]/5 via-[#CAA3D6]/30 to-[#473DC6]/5" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#473DC6]/10 rounded-full blur-[100px] opacity-50" />
      <div className="absolute -bottom-60 -left-40 w-96 h-96 bg-[#CAA3D6]/10 rounded-full blur-[100px] opacity-30" />

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-16">
          {/* Logo and socials section */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-8 group">
              <div className="flex flex-col items-start">
                <div className="bg-gradient-to-r from-[#CAA3D6] to-[#473DC6] bg-clip-text text-transparent 
                               text-3xl lg:text-4xl font-bold mb-1 group-hover:scale-[1.02] 
                               transition-transform duration-300">
                  CreateHER Fest
                </div>
                <div className="h-1 w-16 bg-gradient-to-r from-[#CAA3D6] to-[#473DC6] rounded-full 
                               transition-all duration-300 group-hover:w-full" />
              </div>
            </Link>
            
            <div className="flex space-x-4 social-links">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white 
                             transition-all duration-300 
                             bg-white/5 hover:bg-white/10 rounded-lg p-3 
                             border border-white/5 hover:border-white/20
                             shadow-md hover:shadow-lg hover:shadow-[#473DC6]/10
                             focus:outline-none focus:ring-2 focus:ring-[#CAA3D6]/50"
                  whileHover={{ 
                    scale: 1.05,
                    rotate: index % 2 === 0 ? 2 : -2
                  }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Follow us on ${social.name}`}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick links sections */}
          {Object.entries(quickLinks).map(([category, links]) => (
            <div key={category} className="space-y-6">
              <h4 className={`${typography.subheading} text-[#CAA3D6] uppercase tracking-wide`}>
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.isExternal ? (
                      <motion.a 
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center text-white/70 hover:text-white 
                                  transition-all duration-300
                                  focus:outline-none focus:text-white"
                        whileHover={{ 
                          x: 6,
                          transition: { duration: 0.2 }
                        }}
                      >
                        <span className={typography.body}>{link.label}</span>
                        <ArrowRight 
                          className="ml-2 h-4 w-4 opacity-0 
                                    group-hover:opacity-100 
                                    transition-all duration-200
                                    text-[#CAA3D6]" 
                        />
                      </motion.a>
                    ) : (
                      <motion.div whileHover={{ 
                        x: 6,
                        transition: { duration: 0.2 }
                      }}>
                        <Link
                          href={link.url}
                          className="group flex items-center text-white/70 hover:text-white 
                                    transition-all duration-300
                                    focus:outline-none focus:text-white"
                        >
                          <span className={typography.body}>{link.label}</span>
                          <ArrowRight 
                            className="ml-2 h-4 w-4 opacity-0 
                                      group-hover:opacity-100 
                                      transition-all duration-200
                                      text-[#CAA3D6]" 
                          />
                        </Link>
                      </motion.div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mb-10" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className={`${typography.caption} text-white/70 uppercase tracking-wider font-medium`}>
              Discover · Design · Deliver
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className={`${typography.caption} text-white/60 text-center md:text-right`}>
              © {new Date().getFullYear()} CreateHER Fest
              <span className="hidden md:inline"> | </span>
              <span className="block md:inline">Developed by Darveloper</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}