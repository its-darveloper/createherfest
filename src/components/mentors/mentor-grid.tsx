"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Mentor } from "@/lib/sanity/queries"
import { MentorCard } from "./mentor-card"
import { Button } from "@/components/ui/button"

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
      <div className="text-center text-[#f1eae7]/70 py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#473dc6] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mr-2"></div>
        <span>Loading mentors...</span>
      </div>
    )
  }

  // Display empty state
  if (mentors.length === 0) {
    return (
      <div className="text-center text-[#f1eae7] py-12">
        <h3 className="text-xl font-semibold mb-2">No mentors found</h3>
        <p className="text-[#f1eae7]/70">
          {search || expertise || availability 
            ? "Try adjusting your filters to see more results." 
            : "There are currently no mentors available."}
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Results count */}
      <div className="text-[#f1eae7]/70 mb-6">
        Showing {mentors.length} of {totalMentors} mentors
      </div>

      {/* Mentor grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.map((mentor) => (
          <MentorCard 
            key={mentor._id} 
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
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="border-[#473dc6]/30 bg-[#2b2b2b]/30 text-[#f1eae7] hover:bg-[#473dc6]/20 hover:text-white disabled:opacity-50"
            >
              Previous
            </Button>
            
            <div className="flex items-center px-4 text-[#f1eae7]">
              Page {currentPage} of {totalPages}
            </div>
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="border-[#473dc6]/30 bg-[#2b2b2b]/30 text-[#f1eae7] hover:bg-[#473dc6]/20 hover:text-white disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}