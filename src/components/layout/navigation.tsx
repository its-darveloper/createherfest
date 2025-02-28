// components/layout/navigation.tsx
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { typography } from "@/lib/utils/typography"

const navItems = [
  { path: "/faqs", label: "FAQs" },
  { path: "https://createherfest.fyi/event-calendar", label: "Event Calendar" },
  { path: "https://tally.so/r/wzJkBE", label: "Speak" },
  { path: "/mentors", label: "Mentors"},
  { path: "/resources", label: "Resources"},
  { path: "https://tally.so/r/wdjO1y", label: "Volunteer", isExternal: true },
  { path: "https://tally.so/r/nWMoXj", label: "Partner", isExternal: true },

]

const menuVariants = {
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3,
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  open: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.08,
      staggerDirection: 1,
    },
  },
}

const itemVariants = {
  closed: { opacity: 0, y: -8 },
  open: { opacity: 1, y: 0 },
}

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [windowWidth, setWindowWidth] = useState(0)

  // Handle initial client-side render
  useEffect(() => {
    setMounted(true)
    setWindowWidth(window.innerWidth)
  }, [])

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }
    
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Handle body scroll lock
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileMenuOpen])

  const isMobile = mounted && windowWidth < 768

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
          isScrolled || isMobileMenuOpen
            ? "bg-[#150E60]/95 backdrop-blur-sm shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-between h-16 md:h-20">
              {/* Logo */}
              <Link href="/" className="flex items-center relative z-50 group">
                <div className="relative h-20 w-auto aspect-[3/1]">
                  <Image
                    src="/chf.svg"
                    alt="CreateHER Fest"
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-200"
                    priority
                  />
                </div>
              </Link>

              {/* Desktop Navigation */}
              {!isMobile && (
                <ul className="hidden md:flex items-center space-x-8">
                  {navItems.map((item) => (
                    <li key={item.path}>
                      {item.isExternal ? (
                        <Link
                          href={item.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${typography.body} text-white/80 hover:text-white transition-colors duration-200 px-2 py-1 rounded-md hover:bg-white/5`}
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <Link
                          href={item.path}
                          className={`${typography.body} text-white/80 hover:text-white transition-colors duration-200 px-2 py-1 rounded-md hover:bg-white/5`}
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {/* Desktop Register Button */}
              {!isMobile && (
                <Button
                  asChild
                  className="hidden md:flex bg-[#473dc6] hover:bg-[#5246e5] text-white
                           shadow-md hover:shadow-lg hover:shadow-[#473dc6]/20
                           transition-all duration-300 rounded-xl"
                >
                  <Link
                    href="https://form.jotform.com/243616450118149"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    <span className={typography.body}>Register</span>
                  </Link>
                </Button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden relative z-50 p-2 text-white hover:bg-white/10 
                          active:bg-white/20 rounded-lg transition-colors duration-200"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Improved animation and accessibility */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 pt-16 bg-[#150E60]/98 backdrop-blur-md md:hidden z-40 overflow-hidden"
          >
            <motion.div 
              className="flex flex-col px-6 py-6 max-h-[calc(100vh-4rem)] overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {navItems.map((item) => (
                <motion.div key={item.path} variants={itemVariants}>
                  {item.isExternal ? (
                    <Link
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center text-white/90 hover:text-white py-4
                              text-xl font-medium border-b border-white/10 
                              transition-all duration-200"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <Link
                      href={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center text-white/90 hover:text-white py-4
                              text-xl font-medium border-b border-white/10 
                              transition-all duration-200"
                    >
                      {item.label}
                    </Link>
                  )}
                </motion.div>
              ))}

              <motion.div 
                variants={itemVariants} 
                className="py-6 mt-4"
              >
                <Button
                  asChild
                  className="w-full bg-[#473dc6] hover:bg-[#5246e5] text-white py-6
                           shadow-md hover:shadow-lg
                           transition-all duration-300 rounded-xl"
                >
                  <Link
                    href="https://form.jotform.com/243616450118149"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register Now
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}