"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Mentor } from "@/lib/sanity/queries"
import { MentorCard } from "./mentor-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Search, Sparkles } from "lucide-react"

const MENTORS_PER_PAGE = 9

export function MentorGrid() {
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalMentors, setTotalMentors] = useState(0)
  const searchParams = useSearchParams()

  // Get search parameters for filtering
  const search = searchParams.get('search')
  const expertise = searchParams.get('expertise')
  const availability = searchParams.get('availability')

  // Fetch mentors from API with filters
  useEffect(() => {
    const fetchMentors = async () => {
      setLoading(true)
      try {
        // Construct query string with all filters
        let queryString = `page=${currentPage}`
        if (search) queryString += `&search=${encodeURIComponent(search)}`
        if (expertise) queryString += `&expertise=${encodeURIComponent(expertise)}`
        if (availability) queryString += `&availability=${encodeURIComponent(availability)}`
        
        // Fetch mentors from API
        const response = await fetch(`/api/mentors?${queryString}`)
        if (!response.ok) {
          throw new Error('Failed to fetch mentors')
        }
        
        const data = await response.json()
        
        // Update state with fetched data
        setMentors(data.mentors)
        setTotalPages(data.totalPages)
        setTotalMentors(data.total)
      } catch (error) {
        console.error("Error fetching mentors:", error)
        // Set empty state on error
        setMentors([])
        setTotalPages(0)
        setTotalMentors(0)
      } finally {
        setLoading(false)
      }
    }

    fetchMentors()
  }, [currentPage, search, expertise, availability])

  // Display loading state
  if (loading && mentors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-[#f1eae7]/70 py-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#473dc6]/20 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>
        
        {/* Loading animation */}
        <div className="relative">
          <div className="flex justify-center mb-6">
            <div className="relative w-12 h-12">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-2 border-[#473dc6]/30 animate-ping"></div>
              
              {/* Middle ring */}
              <div className="absolute inset-1 rounded-full border-2 border-[#473dc6]/50 animate-spin-slow"></div>
              
              {/* Inner loading spinner */}
              <div className="absolute inset-2 rounded-full border-2 border-[#caa3d6] border-t-transparent animate-spin"></div>
              
              {/* Center dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#cfe6ff] animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <p className="text-lg font-medium text-white">Finding Expert Mentors</p>
          <p className="text-sm text-[#f1eae7]/70 mt-1">Please wait while we match your criteria</p>
        </div>
      </div>
    )
  }

  // Display empty state
  if (mentors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#473dc6]/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[#caa3d6]/10 to-transparent rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Search className="w-8 h-8 text-[#caa3d6]" />
          </div>
          
          <h3 className="text-2xl font-semibold text-white mb-3">No mentors found</h3>
          <p className="text-[#f1eae7]/80 mb-8 max-w-md">
            {search || expertise || availability 
              ? "We couldn't find mentors matching your current filters. Try adjusting your criteria for more results." 
              : "There are currently no mentors available. Please check back later as our mentor network is constantly growing."}
          </p>
          
          {(search || expertise || availability) && (
            <Button 
              variant="outline" 
              className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 text-white rounded-full px-6 py-2 group relative overflow-hidden"
              onClick={() => {
                // Clear all filters by redirecting to base URL
                window.location.href = "/mentors";
              }}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-30 animate-shimmer-slow"></span>
              <span className="relative">Reset All Filters</span>
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Decorative elements */}
      <div className="absolute -left-20 top-40 w-40 h-40 border border-[#473dc6]/10 rounded-full animate-spin-slower opacity-20 pointer-events-none" aria-hidden="true"></div>
      <div className="absolute -right-16 bottom-20 w-32 h-32 border-2 border-[#caa3d6]/10 rounded-full animate-spin-slow opacity-20 pointer-events-none" aria-hidden="true"></div>
      
      {/* Results count with glassmorphism badge */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex items-center px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-[#f1eae7]/70">
          <Sparkles className="w-4 h-4 mr-2 text-[#caa3d6]" />
          Showing <span className="text-white font-medium mx-1">{mentors.length}</span> of <span className="text-white font-medium mx-1">{totalMentors}</span> mentors
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5">
            <span className="text-[#f1eae7]/70 text-sm mr-1">Page</span>
            <span className="text-white font-medium">{currentPage}</span>
            <span className="text-[#f1eae7]/70">/</span>
            <span className="text-[#f1eae7]/70">{totalPages}</span>
          </div>
        )}
      </div>

      {/* Mentor grid with staggered animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mentors.map((mentor, index) => (
          <div 
            key={mentor._id} 
            className="animate-fade-in-up" 
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <MentorCard 
              mentor={{
                id: mentor._id,
                name: mentor.name,
                title: mentor.title || '',
                company: mentor.company || '',
                expertise: mentor.expertise,
                bio: mentor.bio || '',
                imageUrl: mentor.imageUrl || '/placeholder-user.png',
                availability: mentor.availability || []
              }} 
            />
          </div>
        ))}
      </div>
      
      {/* Pagination with futuristic design */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-16">
          <div className="inline-flex bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-1 shadow-lg">
            <Button
              variant="ghost"
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="text-[#f1eae7] hover:text-white disabled:text-[#f1eae7]/30 hover:bg-white/10 rounded-full w-12 h-12 p-0 group transition-all duration-300"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
            </Button>
            
            {/* Page indicators */}
            <div className="flex items-center px-4">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                // Show at most 5 page indicators
                let pageNum;
                if (totalPages <= 5) {
                  // If 5 or fewer pages, show all
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  // If on pages 1-3, show pages 1-5
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  // If on last 3 pages, show last 5 pages
                  pageNum = totalPages - 4 + i;
                } else {
                  // Otherwise show current page and 2 on either side
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 mx-0.5 rounded-full flex items-center justify-center transition-all duration-300 ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-[#473dc6] to-[#6658db] text-white'
                        : 'text-[#f1eae7]/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="text-sm">{pageNum}</span>
                  </button>
                );
              })}
              
              {/* Ellipsis for when there are more pages */}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <span className="w-8 flex justify-center text-[#f1eae7]/70">...</span>
              )}
            </div>
            
            <Button
              variant="ghost"
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="text-[#f1eae7] hover:text-white disabled:text-[#f1eae7]/30 hover:bg-white/10 rounded-full w-12 h-12 p-0 group transition-all duration-300"
              aria-label="Next page"
            >
              <ChevronRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}