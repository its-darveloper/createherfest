// components/faqs/faqs-section.tsx  
"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { PortableText } from '@portabletext/react'
import type { FAQ } from '@/types/sanity'
import { typography } from '@/lib/utils/typography'

interface FAQItemProps {
  faq: FAQ
  isOpen: boolean
  onToggle: () => void
}

function FAQItem({ faq, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="mb-3">
      <motion.button
        onClick={onToggle}
        className="w-full text-left p-6 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] 
                   border border-white/[0.05] transition-all duration-300
                   group flex items-start justify-between gap-4"
        initial={false}
        animate={{ 
          backgroundColor: isOpen ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
          borderColor: isOpen ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)'
        }}
        aria-expanded={isOpen}
      >
        <span className={`${typography.subheading} text-white/90`}>
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 mt-1"
        >
          <ChevronDown className="w-5 h-5 text-white/40 group-hover:text-white/60 transition-colors" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 py-4 mt-1 text-white/70">
              <div className={typography.body}>
                <PortableText 
                  value={faq.answer}
                  components={{
                    block: {
                      normal: ({children}) => <p className="mb-4 last:mb-0">{children}</p>,
                    },
                    marks: {
                      strong: ({children}) => <strong className="font-semibold text-white/90">{children}</strong>,
                      link: ({children, value}) => (
                        <a 
                          href={value.href} 
                          target="_blank"
                          rel="noopener noreferrer" 
                          className="text-[#CAA3D6] hover:text-[#CAA3D6]/80 underline underline-offset-2 transition-colors"
                        >
                          {children}
                        </a>
                      ),
                    },
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface FAQsSectionProps {
  initialFaqs: FAQ[]
}

export function FAQsSection({ initialFaqs }: FAQsSectionProps) {
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs)
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>(initialFaqs)
  const [openFAQs, setOpenFAQs] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  // Listen for search events from the hero component
  useEffect(() => {
    const handleSearch = (e: CustomEvent) => {
      setSearchQuery(e.detail.query)
    }
    
    window.addEventListener('faq-search', handleSearch as EventListener)
    return () => {
      window.removeEventListener('faq-search', handleSearch as EventListener)
    }
  }, [])

  // Filter FAQs based on search
useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredFaqs(faqs)
      return
    }
    
    const query = searchQuery.toLowerCase()
    const filtered = faqs.filter(faq => {
      // Check the question (always a string)
      const questionMatch = faq.question.toLowerCase().includes(query)
      
      // Check the answer - handle both string and portable text
      let answerMatch = false
      if (typeof faq.answer === 'string') {
        answerMatch = faq.answer.toLowerCase().includes(query)
      } else if (Array.isArray(faq.answer)) {
        // For Portable Text blocks
        answerMatch = JSON.stringify(faq.answer)
          .toLowerCase()
          .includes(query)
      }
      
      return questionMatch || answerMatch
    })
    
    setFilteredFaqs(filtered)
    
    // Automatically open FAQs that match search query
    if (filtered.length > 0 && query.length > 2) {
      setOpenFAQs(filtered.map(faq => faq._id))
    }
  }, [searchQuery, faqs])

  const toggleFAQ = (id: string) => {
    setOpenFAQs(prev => 
      prev.includes(id) 
        ? prev.filter(faqId => faqId !== id)
        : [...prev, id]
    )
  }

  // Get unique categories and ensure they're sorted properly
  const getCategories = () => {
    // Common category order
    const categoryOrder = ['general', 'registration', 'event', 'technical', 'workshops', 'speakers', 'other']
    
    // Get unique categories
    const uniqueCategories = Array.from(new Set(filteredFaqs.map(faq => faq.category || 'other')))
    
    // Sort categories based on predefined order
    return uniqueCategories.sort((a, b) => {
      const indexA = categoryOrder.indexOf(a)
      const indexB = categoryOrder.indexOf(b)
      
      // If both categories are in our predefined order, sort by that
      if (indexA >= 0 && indexB >= 0) {
        return indexA - indexB
      }
      
      // If only one category is in our predefined order, prioritize it
      if (indexA >= 0) return -1
      if (indexB >= 0) return 1
      
      // Otherwise alphabetical sorting
      return a.localeCompare(b)
    })
  }

  const categories = getCategories()
  const hasResults = filteredFaqs.length > 0

  return (
    <section className="pb-24 md:pb-32 relative">
      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto">
          {/* Show category header only if we have results */}
          {hasResults ? (
            <div className="space-y-12">
              {categories.map(category => {
                const categoryFaqs = filteredFaqs.filter(faq => (faq.category || 'other') === category)
                
                if (categoryFaqs.length === 0) return null
                
                return (
                  <div key={category}>
                    <h2 className={`${typography.heading} text-white/80 mb-6 capitalize`}>
                      {category}
                    </h2>
                    <div className="space-y-3">
                      {categoryFaqs
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map(faq => (
                          <FAQItem
                            key={faq._id}
                            faq={faq}
                            isOpen={openFAQs.includes(faq._id)}
                            onToggle={() => toggleFAQ(faq._id)}
                          />
                        ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <h3 className={`${typography.heading} text-white mb-4`}>
                No matching FAQs found
              </h3>
              <p className={`${typography.body} text-white/70 mb-6`}>
                Try adjusting your search query or browse all categories.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="inline-block px-6 py-3 bg-[#473DC6] hover:bg-[#473DC6]/80 
                         text-white rounded-lg transition-colors"
              >
                View all FAQs
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}