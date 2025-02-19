// components/speakers/speakers-grid.tsx
"use client"

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Speaker } from '@/types/sanity'
import { SpeakerCard } from './speaker-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { typography } from '@/lib/utils/typography'

interface SpeakersGridProps {
  initialSpeakers: Speaker[]
}

// Number of speakers per page
const SPEAKERS_PER_PAGE = 16;

// Get expertise tags function remains the same...
const getExpertiseTags = (speakers: Speaker[]): string[] => {
  const allTags = new Set<string>()
  
  speakers.forEach(speaker => {
    if (!speaker.title) return
    
    const keywords = [
      'AI', 'Machine Learning', 'ML', 'Blockchain', 'AR/VR', 'AR', 'VR', 'XR',
      'Web3', 'Data Science', 'Engineering', 'Design', 'UX', 'Product', 
      'Marketing', 'Developer', 'Software', 'Cybersecurity', 'Frontend', 'Backend',
      'Full Stack', 'Cloud', 'DevOps', 'Research', 'IoT', 'Mobile', 'Game',
      'Hardware', 'Robotics', 'Ethics', 'Leadership', 'Executive', 'Investor'
    ]
    
    keywords.forEach(keyword => {
      if (speaker.title && speaker.title.includes(keyword)) {
        allTags.add(keyword)
      }
    })
  })
  
  return Array.from(allTags).sort()
}

export function SpeakersGrid({ initialSpeakers }: SpeakersGridProps) {
  const [speakers, setSpeakers] = useState<Speaker[]>(initialSpeakers)
  const [filteredSpeakers, setFilteredSpeakers] = useState<Speaker[]>(initialSpeakers)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  
  const categories = getExpertiseTags(initialSpeakers)
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredSpeakers.length / SPEAKERS_PER_PAGE)
  
  // Get current page speakers
  const currentSpeakers = filteredSpeakers.slice(
    (currentPage - 1) * SPEAKERS_PER_PAGE,
    currentPage * SPEAKERS_PER_PAGE
  )
  
  // Apply filtering
  useEffect(() => {
    let result = [...speakers]
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(speaker => 
        speaker.name.toLowerCase().includes(term) ||
        (speaker.title && speaker.title.toLowerCase().includes(term)) ||
        (speaker.company && speaker.company.toLowerCase().includes(term))
      )
    }
    
    // Apply category filter
    if (selectedCategory) {
      result = result.filter(speaker => 
        speaker.title && speaker.title.includes(selectedCategory)
      )
    }
    
    setFilteredSpeakers(result)
    // Reset to first page when filters change
    setCurrentPage(1)
  }, [searchTerm, selectedCategory, speakers])
  
  // Handle page change
  const goToPage = (page: number) => {
    // Scroll to top of grid
    window.scrollTo({
      top: document.getElementById('speakers-grid')?.offsetTop || 0,
      behavior: 'smooth'
    })
    setCurrentPage(page)
  }
  
  // Generate pagination buttons
  const renderPaginationButtons = () => {
    // Don't show pagination if only one page
    if (totalPages <= 1) return null;
    
    const buttons = [];
    const showEllipsis = totalPages > 7;
    
    // Always show first page
    buttons.push(
      <Button
        key="page-1"
        variant="ghost"
        size="sm"
        onClick={() => goToPage(1)}
        className={`w-10 h-10 p-0 ${
          currentPage === 1 
            ? 'bg-[#473DC6] text-white' 
            : 'bg-white/5 text-white/70 hover:bg-white/10'
        }`}
        aria-current={currentPage === 1 ? 'page' : undefined}
      >
        1
      </Button>
    );
    
    // Show ellipsis at the beginning if needed
    if (showEllipsis && currentPage > 4) {
      buttons.push(
        <span key="ellipsis1" className="px-1 text-white/50">...</span>
      );
    }
    
    // Show pages around current page
    for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
      buttons.push(
        <Button
          key={`page-${i}`}
          variant="ghost"
          size="sm"
          onClick={() => goToPage(i)}
          className={`w-10 h-10 p-0 ${
            currentPage === i 
              ? 'bg-[#473DC6] text-white' 
              : 'bg-white/5 text-white/70 hover:bg-white/10'
          }`}
          aria-current={currentPage === i ? 'page' : undefined}
        >
          {i}
        </Button>
      );
    }
    
    // Show ellipsis at the end if needed
    if (showEllipsis && currentPage < totalPages - 3) {
      buttons.push(
        <span key="ellipsis2" className="px-1 text-white/50">...</span>
      );
    }
    
    // Always show last page if more than one page
    if (totalPages > 1) {
      buttons.push(
        <Button
          key={`page-${totalPages}`}
          variant="ghost"
          size="sm"
          onClick={() => goToPage(totalPages)}
          className={`w-10 h-10 p-0 ${
            currentPage === totalPages 
              ? 'bg-[#473DC6] text-white' 
              : 'bg-white/5 text-white/70 hover:bg-white/10'
          }`}
          aria-current={currentPage === totalPages ? 'page' : undefined}
        >
          {totalPages}
        </Button>
      );
    }
    
    return buttons;
  };
  
  return (
    <section id="speakers-grid" className="relative py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Search and filter */}
        <div className="mb-10 max-w-3xl mx-auto">
          {/* Search input remains the same... */}
          <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search speakers by name, title, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 h-12"
              />
            </div>
          </div>
          
          {/* Category filters remain the same... */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className={`rounded-full px-4 h-8 flex items-center text-sm ${
                  selectedCategory === null 
                    ? 'bg-[#473DC6] text-white' 
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                All
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 h-8 flex items-center text-sm ${
                    selectedCategory === category 
                      ? 'bg-[#473DC6] text-white' 
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          )}
        </div>
        
        {/* Results count with pagination info */}
        <div className="mb-8 flex items-center justify-between">
          <p className={`${typography.body} text-white/60`}>
            Showing {Math.min(SPEAKERS_PER_PAGE, currentSpeakers.length)} of {filteredSpeakers.length} 
            {filteredSpeakers.length === 1 ? ' speaker' : ' speakers'}
            {selectedCategory && <span> in <span className="text-[#CAA3D6]">{selectedCategory}</span></span>}
          </p>
          
          {totalPages > 1 && (
            <p className={`${typography.body} text-white/60`}>
              Page {currentPage} of {totalPages}
            </p>
          )}
        </div>
        
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          <AnimatePresence>
            {currentSpeakers.map(speaker => (
              <motion.div
                key={speaker._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <SpeakerCard speaker={speaker} />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredSpeakers.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className={`${typography.heading} text-white mb-4`}>No speakers found</p>
                <p className={`${typography.body} text-white/60 mb-6`}>
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory(null)
                  }}
                  className="bg-[#473DC6] hover:bg-[#5e50ff]"
                >
                  Clear all filters
                </Button>
              </motion.div>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-wrap justify-center items-center gap-2">
            {/* Previous page button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => goToPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 p-0 bg-white/5 text-white/70 hover:bg-white/10 
                       disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            {/* Page numbers */}
            {renderPaginationButtons()}
            
            {/* Next page button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 p-0 bg-white/5 text-white/70 hover:bg-white/10 
                       disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}