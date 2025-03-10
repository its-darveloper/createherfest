// components/layout/footer.tsx
"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Instagram, Facebook, Linkedin, ArrowRight, Send } from 'lucide-react'
import { typography } from '@/lib/utils/typography'
import { useState } from 'react'

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
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    preferences: {
      aiml: false,
      arvr: false,
      blockchain: false
    }
  })
  
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    
    if (type === 'checkbox') {
      setFormState(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [name]: checked
        }
      }))
    } else {
      setFormState(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubscribeStatus('submitting')
    
    try {
      // This is where you'd normally submit the form data to Flodesk
      // For example using fetch:
      /*
      const response = await fetch('https://form.flodesk.com/forms/67cf3983afd0539a2c2b3dd7/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formState.firstName,
          lastName: formState.lastName,
          email: formState.email,
          preferences: Object.keys(formState.preferences).filter(key => formState.preferences[key as keyof typeof formState.preferences])
        }),
      })
      
      if (!response.ok) throw new Error('Failed to subscribe')
      */
      
      // For now, simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSubscribeStatus('success')
      setFormState({
        firstName: '',
        lastName: '',
        email: '',
        preferences: {
          aiml: false,
          arvr: false,
          blockchain: false
        }
      })
      
      // Reset to idle after a few seconds
      setTimeout(() => {
        setSubscribeStatus('idle')
      }, 3000)
      
    } catch (error) {
      setSubscribeStatus('error')
      console.error('Newsletter submission error:', error)
      
      // Reset to idle after a few seconds
      setTimeout(() => {
        setSubscribeStatus('idle')
      }, 3000)
    }
  }

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
      { label: 'Privacy Policy', url: '/privacy-policy', isExternal: false },
      { label: 'Terms of Use', url: '/terms-and-conditions', isExternal: false },
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
              Subscribe to our Newsletter
            </h4>
            <p className="text-white/70 mb-6 text-sm">
              Sign up with your email address to receive news and updates about CreateHER Fest.
            </p>
            
            {subscribeStatus === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#473DC6]/20 border border-[#CAA3D6]/30 rounded-lg p-4 text-center"
              >
                <p className="text-white font-medium">Thank you for subscribing!</p>
                <p className="text-white/70 text-sm mt-1">You'll receive updates soon.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input 
                      type="text" 
                      name="firstName" 
                      placeholder="First name" 
                      required
                      value={formState.firstName}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white placeholder:text-white/40
                             focus:outline-none focus:ring-2 focus:ring-[#CAA3D6]/50 focus:border-transparent
                             transition-all duration-200"
                    />
                  </div>
                  <div>
                    <input 
                      type="text" 
                      name="lastName" 
                      placeholder="Last name"
                      value={formState.lastName}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white placeholder:text-white/40
                             focus:outline-none focus:ring-2 focus:ring-[#CAA3D6]/50 focus:border-transparent
                             transition-all duration-200"
                    />
                  </div>
                </div>
                
                <div>
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="Email address" 
                    required
                    value={formState.email}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white placeholder:text-white/40
                           focus:outline-none focus:ring-2 focus:ring-[#CAA3D6]/50 focus:border-transparent
                           transition-all duration-200"
                  />
                </div>
                
                <div>
                  <p className="text-sm text-white/70 mb-2">What are you interested in hearing about?</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <label className="flex items-center space-x-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        name="aiml"
                        checked={formState.preferences.aiml}
                        onChange={handleInputChange}
                        className="appearance-none w-4 h-4 border border-white/30 rounded
                               checked:bg-[#CAA3D6] checked:border-transparent
                               focus:outline-none focus:ring-2 focus:ring-[#CAA3D6]/50
                               transition-all duration-200"
                      />
                      <span className="text-white/70 group-hover:text-white transition-colors duration-200">AI/ML</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer group">
                      <input 
                        type="checkbox"
                        name="arvr"
                        checked={formState.preferences.arvr}
                        onChange={handleInputChange} 
                        className="appearance-none w-4 h-4 border border-white/30 rounded
                               checked:bg-[#CAA3D6] checked:border-transparent
                               focus:outline-none focus:ring-2 focus:ring-[#CAA3D6]/50
                               transition-all duration-200"
                      />
                      <span className="text-white/70 group-hover:text-white transition-colors duration-200">AR/VR</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer group">
                      <input 
                        type="checkbox"
                        name="blockchain"
                        checked={formState.preferences.blockchain}
                        onChange={handleInputChange}  
                        className="appearance-none w-4 h-4 border border-white/30 rounded
                               checked:bg-[#CAA3D6] checked:border-transparent
                               focus:outline-none focus:ring-2 focus:ring-[#CAA3D6]/50
                               transition-all duration-200"
                      />
                      <span className="text-white/70 group-hover:text-white transition-colors duration-200">Blockchain</span>
                    </label>
                  </div>
                </div>
                
                <button 
                  type="submit"
                  disabled={subscribeStatus === 'submitting'}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-[#CAA3D6] to-[#473DC6] 
                         hover:brightness-110 text-white font-medium px-6 py-2 rounded-full
                         transition-all duration-300 w-full sm:w-auto
                         focus:outline-none focus:ring-2 focus:ring-[#CAA3D6]/50"
                >
                  {subscribeStatus === 'submitting' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
                
                {subscribeStatus === 'error' && (
                  <p className="text-red-400 text-sm">Failed to subscribe. Please try again later.</p>
                )}
              </form>
            )}
          </div>
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
              <span className="block md:inline">Developed by <a href='https://x.com/@darveloper'>Darveloper</a></span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}