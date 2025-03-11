// components/layout/footer.tsx
"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Instagram, Facebook, Linkedin, ArrowRight } from 'lucide-react'
import { typography } from '@/lib/utils/typography'
import { useEffect } from 'react'

// Add TypeScript declaration for Flodesk
declare global {
  interface Window {
    fd?: (action: string, options: any) => void;
  }
}

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
      { label: 'Join', url: 'https://form.jotform.com/250694376098167', isExternal: true },
      { label: 'Volunteer', url: 'https://tally.so/r/wdjO1y', isExternal: true },
      { label: 'Contact Us', url: 'https://tally.so/r/nrdyaN', isExternal: true },
      { label: 'Apply to Teach', url: 'https://tally.so/r/wzJkBE', isExternal: true }
    ],
    'Resources': [
      { label: 'Code of Conduct', url: '/code-of-conduct', isExternal: false },
      { label: 'Privacy Policy', url: '/privacy-policy', isExternal: false },
      { label: 'Terms of Use', url: '/terms-and-conditions', isExternal: false },
      { label: 'FAQ Center', url: '/faqs', isExternal: false }
    ]
  }

  // This useEffect runs on client-side only to initialize the form
  useEffect(() => {
    // Check if window.fd exists (script has loaded) and there's a container element
    if (window.fd && document.getElementById('fd-form-67cf3983afd0539a2c2b3dd7')) {
      window.fd('form', {
        formId: '67cf3983afd0539a2c2b3dd7',
        containerEl: '#fd-form-67cf3983afd0539a2c2b3dd7'
      });
    }
  }, []);

  return (
    <footer className="bg-[#0A083D] text-white relative overflow-hidden py-8">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/10" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#473DC6]/5 via-[#CAA3D6]/30 to-[#473DC6]/5" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#473DC6]/10 rounded-full blur-[100px] opacity-50" />
      <div className="absolute -bottom-60 -left-40 w-96 h-96 bg-[#CAA3D6]/10 rounded-full blur-[100px] opacity-30" />

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
          {/* Logo and socials section */}
          <div className="md:col-span-3">
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
            <div key={category} className="md:col-span-2">
              <h4 className={`${typography.subheading} text-[#CAA3D6] uppercase tracking-wide mb-6`}>
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
          
          {/* Newsletter Section */}
          <div className="md:col-span-5">
            <h4 className={`${typography.subheading} text-[#CAA3D6] uppercase tracking-wide mb-6`}>
              SUBSCRIBE TO OUR NEWSLETTER
            </h4>
            <p className="text-white/70 mb-6 text-sm">
              Sign up with your email address to receive news and updates about CreateHER Fest.
            </p>
            
            {/* Flodesk Form Container */}
            <div id="fd-form-67cf3983afd0539a2c2b3dd7"></div>
            
            {/* Custom CSS to better style the Flodesk form */}
            <style jsx global>{`
              /* Form styling overrides */
              #fd-form-67cf3983afd0539a2c2b3dd7 {
                background: transparent !important;
                padding: 0 !important;
                width: 100% !important;
              }
              
              /* Form container & title styling */
              .ff-67cf3983afd0539a2c2b3dd7 {
                background: transparent !important;
                padding: 0 !important;
                width: 100% !important;
                font-family: var(--font-inter) !important;
              }
              
              .ff-67cf3983afd0539a2c2b3dd7__container {
                margin: 0 !important;
                max-width: 100% !important;
                padding: 0 !important;
                background: transparent !important;
              }
              
              .ff-67cf3983afd0539a2c2b3dd7__form {
                padding: 0 !important;
                margin: 0 !important;
                font-family: var(--font-inter) !important;
                color: white !important;
                text-align: left !important;
              }
              
              /* Hide the default title/subtitle since we have our own */
              .ff-67cf3983afd0539a2c2b3dd7__title,
              .ff-67cf3983afd0539a2c2b3dd7__subtitle {
                display: none !important;
              }
              
              /* Form layout */
              .ff-67cf3983afd0539a2c2b3dd7__content {
                margin: 0 !important;
              }
              
              .ff-67cf3983afd0539a2c2b3dd7__fields {
                margin: 0 !important;
                display: grid !important;
                grid-template-columns: 1fr 1fr !important;
                gap: 12px !important;
                max-width: 100% !important;
              }
              
              @media (max-width: 640px) {
                .ff-67cf3983afd0539a2c2b3dd7__fields {
                  grid-template-columns: 1fr !important;
                }
              }
              
              /* Individual form field styling */
              .ff-67cf3983afd0539a2c2b3dd7__field {
                max-width: 100% !important;
                min-width: 0 !important;
                margin: 0 0 12px 0 !important;
              }
              
              .ff-67cf3983afd0539a2c2b3dd7__field:nth-child(3) {
                grid-column: span 2 !important;
              }
              
              @media (max-width: 640px) {
                .ff-67cf3983afd0539a2c2b3dd7__field:nth-child(3) {
                  grid-column: span 1 !important;
                }
              }
              
              /* Input styling */
              .ff-67cf3983afd0539a2c2b3dd7__control {
                background: rgba(255, 255, 255, 0.1) !important;
                border: 1px solid rgba(255, 255, 255, 0.2) !important;
                border-radius: 6px !important;
                color: white !important;
                padding: 12px 16px !important;
                height: 42px !important;
                font-size: 14px !important;
                transition: all 0.3s ease !important;
              }
              
              .ff-67cf3983afd0539a2c2b3dd7__control:focus {
                background: rgba(255, 255, 255, 0.15) !important;
                border-color: #CAA3D6 !important;
                box-shadow: 0 0 0 2px rgba(71, 61, 198, 0.25) !important;
                outline: none !important;
              }
              
              /* Preference section styling */
              .ff-67cf3983afd0539a2c2b3dd7__preference {
                margin: 20px 0 !important;
                display: flex !important;
                flex-direction: column !important;
              }
              
              .ff-67cf3983afd0539a2c2b3dd7__preference-title {
                color: white !important;
                font-size: 14px !important;
                margin-bottom: 12px !important;
                font-weight: 500 !important;
              }
              
              .ff-67cf3983afd0539a2c2b3dd7__preference-list {
                display: grid !important;
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 12px !important;
                width: 100% !important;
                margin: 0 !important;
              }
              
              @media (max-width: 640px) {
                .ff-67cf3983afd0539a2c2b3dd7__preference-list {
                  grid-template-columns: 1fr !important;
                }
              }
              
              /* Checkbox styling */
              .fd-form-check {
                padding-left: 28px !important;
                margin-bottom: 8px !important;
                cursor: pointer !important;
              }
              
              .fd-form-check__checkmark {
                top: 0 !important;
                left: 0 !important;
                width: 18px !important;
                height: 18px !important;
                background-color: rgba(255, 255, 255, 0.1) !important;
                border: 1px solid rgba(255, 255, 255, 0.3) !important;
                border-radius: 4px !important;
                transition: all 0.2s ease !important;
              }
              
              .fd-form-check__input:checked + .fd-form-check__checkmark {
                background-color: #CAA3D6 !important;
                border-color: #CAA3D6 !important;
              }
              
              .fd-form-check__label {
                color: rgba(255, 255, 255, 0.8) !important;
                font-size: 14px !important;
                line-height: 18px !important;
                letter-spacing: 0.01em !important;
                transition: color 0.2s ease !important;
              }
              
              .fd-form-check:hover .fd-form-check__label {
                color: white !important;
              }
              
              /* Button styling */
              .ff-67cf3983afd0539a2c2b3dd7__footer {
                margin-top: 20px !important;
                text-align: center !important;
              }
              
              .ff-67cf3983afd0539a2c2b3dd7__button {
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                background: linear-gradient(to right, #CAA3D6, #473DC6) !important;
                color: white !important;
                font-weight: 500 !important;
                font-size: 14px !important;
                padding: 10px 24px !important;
                border: none !important;
                border-radius: 9999px !important;
                cursor: pointer !important;
                transition: all 0.3s ease !important;
                box-shadow: 0 2px 10px rgba(71, 61, 198, 0.2) !important;
                min-width: 120px !important;
              }
              
              .ff-67cf3983afd0539a2c2b3dd7__button:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 4px 15px rgba(71, 61, 198, 0.4) !important;
                filter: brightness(1.1) !important;
              }
              
              /* Success and error messages */
              .fd-form-success {
                background: rgba(71, 61, 198, 0.2) !important;
                border: 1px solid rgba(202, 163, 214, 0.4) !important;
                border-radius: 8px !important;
                padding: 16px !important;
                margin-top: 20px !important;
                color: white !important;
                text-align: center !important;
              }
              
              .fd-form-error {
                background: rgba(255, 68, 68, 0.1) !important;
                border: 1px solid rgba(255, 68, 68, 0.3) !important;
                border-radius: 8px !important;
                padding: 16px !important;
                margin-top: 20px !important;
                color: #ff6b6b !important;
                text-align: center !important;
              }
                
            `}</style>
          </div>
        </div>

        <div className="border-t border-white/10 mb-10" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className={`${typography.caption} text-white/70 uppercase tracking-wider font-medium`}>
              DISCOVER · DESIGN · DELIVER
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className={`${typography.caption} text-white/60 text-center md:text-right`}>
              © {new Date().getFullYear()} CreateHER Fest
              <span className="hidden md:inline"> | </span>
              <span className="block md:inline">Developed by <a href='https://x.com/@darveloper'>Darveloper</a></span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}