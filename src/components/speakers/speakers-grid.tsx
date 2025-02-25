// components/speakers/speakers-grid.tsx
"use client"

import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, ChevronLeft, ChevronRight, Filter, X, Check } from 'lucide-react'
import type { Speaker } from '@/types/sanity'
import { SpeakerCard } from './speaker-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { typography } from '@/lib/utils/typography'

interface SpeakersGridProps {
  initialSpeakers: Speaker[]
}

// Number of speakers per page
const SPEAKERS_PER_PAGE = 12;

// Expertise areas for filtering
const EXPERTISE_AREAS = [
  { id: 'ai-ml', name: 'AI & Machine Learning', keywords: ['AI', 'Machine Learning', 'ML', 'Data Science', 'NLP'] },
  { id: 'vr-ar', name: 'AR & VR', keywords: ['AR', 'VR', 'XR', 'Augmented Reality', 'Virtual Reality', 'Extended Reality'] },
  { id: 'blockchain', name: 'Blockchain', keywords: ['Blockchain', 'Web3', 'Crypto', 'NFT', 'DeFi'] },
  { id: 'design', name: 'Design', keywords: ['Design', 'UX', 'UI', 'User Experience', 'Product Design'] },
  { id: 'engineering', name: 'Engineering', keywords: ['Engineer', 'Developer', 'Full Stack', 'Frontend', 'Backend', 'DevOps'] },
  { id: 'leadership', name: 'Leadership', keywords: ['CEO', 'CTO', 'Founder', 'Director', 'Head', 'Leader', 'Executive'] },
]

export function SpeakersGrid({ initialSpeakers }: SpeakersGridProps) {
  const [speakers] = useState<Speaker[]>(initialSpeakers)
  const [filteredSpeakers, setFilteredSpeakers] = useState<Speaker[]>(initialSpeakers)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredSpeakers.length / SPEAKERS_PER_PAGE)
  
  // Get current page speakers
  const currentSpeakers = filteredSpeakers.slice(
    (currentPage - 1) * SPEAKERS_PER_PAGE,
    currentPage * SPEAKERS_PER_PAGE
  )
  
  // Check if a speaker has expertise in selected areas
  const hasExpertise = useCallback((speaker: Speaker, expertiseIds: string[]): boolean => {
    if (expertiseIds.length === 0) return true
    
    const speakerTitle = speaker.title?.toLowerCase() || ''
    
    return expertiseIds.some(id => {
      const area = EXPERTISE_AREAS.find(a => a.id === id)
      if (!area) return false
      
      return area.keywords.some(keyword => 
        speakerTitle.includes(keyword.toLowerCase())
      )
    })
  }, [])
  
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
    
    // Apply expertise filter
    if (selectedExpertise.length > 0) {
      result = result.filter(speaker => hasExpertise(speaker, selectedExpertise))
    }
    
    setFilteredSpeakers(result)
    // Reset to first page when filters change
    setCurrentPage(1)
  }, [searchTerm, selectedExpertise, speakers, hasExpertise])
  
  // Toggle expertise filter
  const toggleExpertise = (id: string) => {
    setSelectedExpertise(prev => 
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('')
    setSelectedExpertise([])
  }
  
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
        <div className="mb-10 max-w-4xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
            {/* Search input */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search speakers by name, title, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 h-12 rounded-xl"
                aria-label="Search speakers"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/90 transition-colors duration-200"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {/* Filter button */}
            <Button
              variant="outline"
              className={`bg-white/5 border-white/10 text-white h-12 rounded-xl min-w-36 relative
                       hover:bg-white/10 hover:border-white/20 transition-all duration-300
                       ${isFilterMenuOpen ? 'bg-white/10 border-white/20' : ''}`}
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            >
              <Filter className="w-5 h-5 mr-2" />
              Filter
              {selectedExpertise.length > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#CAA3D6] flex items-center justify-center text-xs font-semibold text-[#0A083D]">
                  {selectedExpertise.length}
                </span>
              )}
            </Button>
          </div>
          
          {/* Filter dropdown menu */}
          <AnimatePresence>
            {isFilterMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-20 w-full bg-[#1c144d] border border-white/10 rounded-xl shadow-xl p-4 mt-2"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`${typography.subheading} text-white`}>Filter by expertise</h3>
                  <button
                    onClick={clearFilters}
                    className="text-[#CAA3D6] hover:text-white text-sm transition-colors duration-200"
                  >
                    Clear all
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {EXPERTISE_AREAS.map((area) => (
                    <button
                      key={area.id}
                      onClick={() => toggleExpertise(area.id)}
                      className={`flex items-center p-3 rounded-lg border transition-all duration-200
                               ${selectedExpertise.includes(area.id)
                                 ? 'bg-[#473DC6]/20 border-[#473DC6]/50 text-white'
                                 : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
                               }`}
                    >
                      <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3
                                     ${selectedExpertise.includes(area.id)
                                       ? 'bg-[#473DC6] border-[#473DC6]'
                                       : 'border-white/30'
                                     }`}
                      >
                        {selectedExpertise.includes(area.id) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className={typography.body}>{area.name}</span>
                    </button>
                  ))}
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button
                    className="bg-[#473DC6] hover:bg-[#5e50ff] text-white"
                    onClick={() => setIsFilterMenuOpen(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Active filters display */}
          {selectedExpertise.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedExpertise.map(id => {
                const area = EXPERTISE_AREAS.find(a => a.id === id)
                return area ? (
                  <div 
                    key={id}
                    className="bg-[#473DC6]/20 border border-[#473DC6]/30 rounded-full px-3 py-1.5
                             flex items-center gap-2"
                  >
                    <span className={`${typography.caption} text-white`}>{area.name}</span>
                    <button
                      onClick={() => toggleExpertise(id)}
                      className="text-white/70 hover:text-white"
                      aria-label={`Remove ${area.name} filter`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : null
              })}
              <button
                onClick={clearFilters}
                className="text-[#CAA3D6] hover:text-white text-sm transition-colors duration-200 ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
        
        {/* Results count with pagination info */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className={`${typography.body} text-white/60`}>
            Showing {Math.min(filteredSpeakers.length, currentSpeakers.length)} of {filteredSpeakers.length} 
            {filteredSpeakers.length === 1 ? ' speaker' : ' speakers'}
            {selectedExpertise.length > 0 && (
              <span> matching selected filters</span>
            )}
          </p>
          
          {totalPages > 1 && (
            <p className={`${typography.body} text-white/60`}>
              Page {currentPage} of {totalPages}
            </p>
          )}
        </div>
        
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {currentSpeakers.map(speaker => (
              <motion.div
                key={speaker._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
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
                className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-xl mx-auto"
              >
                <h3 className={`${typography.heading} text-white mb-4`}>No speakers found</h3>
                <p className={`${typography.body} text-white/60 mb-6`}>
                  We couldn&apos;t find any speakers matching your current search criteria. 
                  Try adjusting your search or filters to find what you&apos;re looking for.
                </p>
                <Button 
                  onClick={clearFilters}
                  className="bg-[#473DC6] hover:bg-[#5e50ff] text-white px-6"
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
                       disabled:opacity-40 disabled:cursor-not-allowed rounded-lg"
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
                       disabled:opacity-40 disabled:cursor-not-allowed rounded-lg"
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