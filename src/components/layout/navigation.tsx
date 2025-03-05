"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Wallet, Loader2, ChevronDown, Calendar, MegaphoneIcon, Users, Library, Globe, HeartHandshake, BadgeHelp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { typography } from "@/lib/utils/typography"
import { useAuth } from "@/app/context/AuthContext"

// Reorganized nav items with categories for mega menu
const navCategories = [
  {
    label: "Events",
    icon: <Calendar className="h-5 w-5 text-[#caa3d6]" />,
    items: [
      { path: "https://createherfest.fyi/event-calendar", label: "Event Calendar", isExternal: true },
      { path: "https://tally.so/r/wzJkBE", label: "Speak at an Event", isExternal: true },
      { path: "https://form.jotform.com/243616450118149", label: "Register for Event", isExternal: true, highlight: true },
    ]
  },
  {
    label: "Community",
    icon: <Users className="h-5 w-5 text-[#caa3d6]" />,
    items: [
      { path: "/mentors", label: "Mentors" },
      { path: "https://tally.so/r/wdjO1y", label: "Volunteer", isExternal: true },
      { path: "https://tally.so/r/nWMoXj", label: "Partner with Us", isExternal: true },
    ]
  },
  {
    label: "Resources",
    icon: <Library className="h-5 w-5 text-[#caa3d6]" />,
    items: [
      { path: "/resources", label: "Learning Resources" },
      { path: "/faqs", label: "FAQs" },
      { path: "/blog", label: "Tech Blog" },
    ]
  },
  // {
  //   label: "Web3",
  //   icon: <Globe className="h-5 w-5 text-[#caa3d6]" />,
  //   items: [
  //     { path: "/claim", label: "Claim .HER Domain", highlight: true },
  //     { path: "/web3-education", label: "Web3 Basics" },
  //     { path: "/blockchain-resources", label: "Developer Tools" },
  //   ]
  // },
]

// Simple single-item nav links
const singleNavItems = [
  { path: "https://tally.so/r/nWMoXj", label: "Partner", isExternal: true },
  { path: "/faqs", label: "FAQs" },
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
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const { user, isLoading, login, logout } = useAuth()
  const menuRef = useRef<HTMLDivElement>(null)

  // Truncate wallet address for display
  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  // Handle wallet connection
  const handleConnectWallet = async () => {
    try {
      await login();
      console.log("Wallet connected successfully");
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  }

  // Handle wallet disconnection
  const handleDisconnectWallet = async () => {
    try {
      await logout();
      console.log("Wallet disconnected successfully");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  }

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

  // Close mega menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const isMobile = mounted && windowWidth < 768

  const handleMenuToggle = (category: string) => {
    if (activeMenu === category) {
      setActiveMenu(null)
    } else {
      setActiveMenu(category)
    }
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
          isScrolled || isMobileMenuOpen || activeMenu
            ? "bg-[#150E60]/95 backdrop-blur-sm shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <nav ref={menuRef} className="flex items-center justify-between h-16 md:h-20">
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
                <div className="hidden md:flex items-center space-x-6">
                  {/* Categories with mega menus */}
                  {navCategories.map((category) => (
                    <div key={category.label} className="relative group">
                      <button
                        onClick={() => handleMenuToggle(category.label)}
                        className={`${typography.body} flex items-center text-white/80 hover:text-white transition-colors duration-200 px-2 py-1 rounded-md hover:bg-white/5 ${
                          activeMenu === category.label ? "text-white bg-white/5" : ""
                        }`}
                        aria-expanded={activeMenu === category.label}
                      >
                        <span className="mr-1">{category.label}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            activeMenu === category.label ? "transform rotate-180" : ""
                          }`}
                        />
                      </button>
                      
                      {/* Mega Menu */}
                      <AnimatePresence>
                        {activeMenu === category.label && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-0 mt-2 w-64 bg-[#15104d]/95 backdrop-blur-md border border-[#473dc6]/40 rounded-xl shadow-2xl shadow-[#000]/20 p-4 z-50"
                          >
                            <div className="flex items-center mb-3 pb-2 border-b border-white/10">
                              {category.icon}
                              <span className="ml-2 font-medium text-[#cfe6ff]">{category.label}</span>
                            </div>
                            <div className="grid gap-2">
                              {category.items.map((item) => (
                                <div key={item.path}>
                                  {item.isExternal ? (
                                    <Link
                                      href={item.path}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={() => setActiveMenu(null)}
                                      className={`block px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-[#473dc6]/20 transition-colors duration-200 ${
                                        item.highlight ? "bg-[#473dc6]/30 text-white border border-[#473dc6]/60" : ""
                                      }`}
                                    >
                                      {item.label}
                                    </Link>
                                  ) : (
                                    <Link
                                      href={item.path}
                                      onClick={() => setActiveMenu(null)}
                                      className={`block px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-[#473dc6]/20 transition-colors duration-200 ${
                                        item.highlight ? "bg-[#473dc6]/30 text-white border border-[#473dc6]/60" : ""
                                      }`}
                                    >
                                      {item.label}
                                    </Link>
                                  )}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}

                  {/* Single Items */}
                  {singleNavItems.map((item) => (
                    <div key={item.path}>
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
                    </div>
                  ))}
                </div>
              )}

              {/* Desktop Buttons */}
              {!isMobile && (
                <div className="hidden md:flex items-center space-x-3">
                  {/* Wallet Connection Button */}
                  {user ? (
                    <Button
                      onClick={handleDisconnectWallet}
                      className="bg-[#473dc6]/20 border border-[#473dc6]/60 hover:bg-[#473dc6]/30 text-white transition-all duration-200 rounded-lg"
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      <span className="mr-1">{user.sub}</span>
                      <span className="text-xs opacity-70">({truncateAddress(user.wallet_address)})</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={handleConnectWallet}
                      className="bg-[#473dc6]/20 border border-[#473dc6]/60 hover:bg-[#473dc6]/30 text-white transition-all duration-200 rounded-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Wallet className="mr-2 h-4 w-4" />
                          Connect Wallet
                        </>
                      )}
                    </Button>
                  )}

                  {/* Register Button */}
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
                </div>
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

      {/* Mobile Menu - Improved accordion-style with categories */}
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
              {/* Mobile Categories Accordion */}
              {navCategories.map((category) => (
                <motion.div key={category.label} variants={itemVariants} className="mb-4">
                  <button
                    onClick={() => handleMenuToggle(category.label)}
                    className="flex items-center justify-between w-full text-white py-4
                            text-xl font-medium border-b border-white/10 
                            transition-all duration-200"
                  >
                    <div className="flex items-center">
                      {category.icon}
                      <span className="ml-2">{category.label}</span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-200 ${
                        activeMenu === category.label ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>
                  
                  <AnimatePresence>
                    {activeMenu === category.label && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col gap-2 py-2 pl-6">
                          {category.items.map((item) => (
                            <div key={item.path}>
                              {item.isExternal ? (
                                <Link
                                  href={item.path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className={`flex items-center text-white/80 hover:text-white py-2
                                          text-lg transition-all duration-200 ${
                                            item.highlight ? "text-[#caa3d6] font-medium" : ""
                                          }`}
                                >
                                  {item.label}
                                </Link>
                              ) : (
                                <Link
                                  href={item.path}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className={`flex items-center text-white/80 hover:text-white py-2
                                          text-lg transition-all duration-200 ${
                                            item.highlight ? "text-[#caa3d6] font-medium" : ""
                                          }`}
                                >
                                  {item.label}
                                </Link>
                              )}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}

              {/* Single Items */}
              {singleNavItems.map((item) => (
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

              {/* Mobile Wallet Connection Button */}
              <motion.div variants={itemVariants} className="py-4 mt-2">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex flex-col text-white py-3">
                      <span className="text-white/70 text-sm">Connected as:</span>
                      <span className="font-medium">{user.sub}</span>
                      <span className="text-sm text-white/70 font-mono mt-1 truncate">
                        {truncateAddress(user.wallet_address)}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleDisconnectWallet}
                      className="w-full justify-start bg-white/5 border-white/20 hover:bg-white/10 text-white"
                    >
                      Disconnect Wallet
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleConnectWallet();
                      setIsMobileMenuOpen(false);
                    }}
                    disabled={isLoading}
                    className="w-full bg-white/5 border-white/20 hover:bg-white/10 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Wallet className="mr-2 h-5 w-5" />
                        Connect Wallet
                      </>
                    )}
                  </Button>
                )}
              </motion.div>

              {/* Mobile Register Button */}
              <motion.div 
                variants={itemVariants} 
                className="py-4"
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