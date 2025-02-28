"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, ChevronDown, Filter, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { typography } from "@/lib/utils/typography"

// These should match your Sanity schema for mentor expertise areas
const expertiseAreas = [
  { id: "ai_ml", label: "AI/ML" },
  { id: "blockchain", label: "Blockchain" },
  { id: "ar_vr", label: "AR/VR" },
  { id: "product_design", label: "Product Design" },
  { id: "ux_ui", label: "UX/UI" },
  { id: "business_strategy", label: "Business Strategy" },
  { id: "pitch_presentation", label: "Pitch & Presentation" },
  { id: "technical_implementation", label: "Technical Implementation" },
]

const availabilityOptions = [
  { id: "today", label: "Today" },
  { id: "tomorrow", label: "Tomorrow" },
  { id: "this_week", label: "This Week" },
  { id: "next_week", label: "Next Week" },
]

export function MentorFilterBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('search') || "")
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>(() => {
    const expertise = searchParams?.get('expertise')
    return expertise ? expertise.split(',') : []
  })
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>(() => {
    const availability = searchParams?.get('availability')
    return availability ? availability.split(',') : []
  })

  // Apply filters with debounce for search
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery)
  
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 500) // 500ms debounce
    
    return () => clearTimeout(timer)
  }, [searchQuery])
  
  // Update URL when filters change
  useEffect(() => {
    // Make sure searchParams is available
    if (!searchParams) return;
    
    // Create a new URLSearchParams object
    const params = new URLSearchParams()
    
    // Add current filters
    if (debouncedSearch) params.set('search', debouncedSearch)
    if (selectedExpertise.length > 0) params.set('expertise', selectedExpertise.join(','))
    if (selectedAvailability.length > 0) params.set('availability', selectedAvailability.join(','))
    
    // Update URL without reloading the page
    router.push(`/mentors?${params.toString()}`)
  }, [debouncedSearch, selectedExpertise, selectedAvailability, router, searchParams])

  const handleExpertiseChange = (id: string) => {
    setSelectedExpertise(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    )
  }

  const handleAvailabilityChange = (id: string) => {
    setSelectedAvailability(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    )
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedExpertise([])
    setSelectedAvailability([])
  }

  // Check if we have searchParams before rendering
  if (!searchParams) {
    return <div className="h-12 bg-[#473dc6]/20 animate-pulse rounded-lg mb-8"></div>;
  }

  return (
    <div className="mb-8 p-4 bg-[#150e60]/70 backdrop-blur-sm rounded-lg border border-[#473dc6]/30">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-4">
        {/* Search */}
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#f1eae7]/50" />
          <Input
            placeholder="Search mentors by name or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#2b2b2b]/30 border-[#473dc6]/30 placeholder:text-[#f1eae7]/30 text-[#f1eae7] focus-visible:ring-[#473dc6]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#f1eae7]/50 hover:text-white/90 transition-colors duration-200"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {/* Filter button */}
        <div className="flex gap-2">
          {/* Expertise Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="justify-between border-[#473dc6]/30 bg-[#2b2b2b]/30 text-[#f1eae7] hover:bg-[#473dc6]/20 hover:text-white">
                <span>Expertise</span>
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                {selectedExpertise.length > 0 && (
                  <span className="ml-1 rounded-full bg-[#473dc6] w-5 h-5 flex items-center justify-center text-xs">
                    {selectedExpertise.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#150e60] border-[#473dc6]/50">
              <DropdownMenuLabel className="text-[#f1eae7]">Filter by Expertise</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#473dc6]/30" />
              {expertiseAreas.map(area => (
                <DropdownMenuCheckboxItem
                  key={area.id}
                  checked={selectedExpertise.includes(area.id)}
                  onCheckedChange={() => handleExpertiseChange(area.id)}
                  className="text-[#f1eae7] focus:bg-[#473dc6]/30 focus:text-white"
                >
                  {area.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Availability Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="justify-between border-[#473dc6]/30 bg-[#2b2b2b]/30 text-[#f1eae7] hover:bg-[#473dc6]/20 hover:text-white">
                <span>Availability</span>
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                {selectedAvailability.length > 0 && (
                  <span className="ml-1 rounded-full bg-[#473dc6] w-5 h-5 flex items-center justify-center text-xs">
                    {selectedAvailability.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#150e60] border-[#473dc6]/50">
              <DropdownMenuLabel className="text-[#f1eae7]">Filter by Availability</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#473dc6]/30" />
              {availabilityOptions.map(option => (
                <DropdownMenuCheckboxItem
                  key={option.id}
                  checked={selectedAvailability.includes(option.id)}
                  onCheckedChange={() => handleAvailabilityChange(option.id)}
                  className="text-[#f1eae7] focus:bg-[#473dc6]/30 focus:text-white"
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear Filters */}
          {(selectedExpertise.length > 0 || selectedAvailability.length > 0 || searchQuery) && (
            <Button 
              variant="ghost" 
              onClick={clearFilters}
              className="text-[#f1eae7]/70 hover:text-white hover:bg-[#473dc6]/20"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Active filters display */}
      {selectedExpertise.length > 0 || selectedAvailability.length > 0 ? (
        <div className="flex flex-wrap gap-2 mt-4">
          {selectedExpertise.map(id => {
            const area = expertiseAreas.find(a => a.id === id)
            return area ? (
              <div 
                key={id}
                className="bg-[#473dc6]/20 border border-[#473dc6]/30 rounded-full px-3 py-1.5
                         flex items-center gap-2"
              >
                <span className={`${typography.caption} text-white`}>{area.label}</span>
                <button
                  onClick={() => handleExpertiseChange(id)}
                  className="text-white/70 hover:text-white"
                  aria-label={`Remove ${area.label} filter`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : null
          })}
          {selectedAvailability.map(id => {
            const option = availabilityOptions.find(o => o.id === id)
            return option ? (
              <div 
                key={id}
                className="bg-[#caa3d6]/20 border border-[#caa3d6]/30 rounded-full px-3 py-1.5
                         flex items-center gap-2"
              >
                <span className={`${typography.caption} text-white`}>{option.label}</span>
                <button
                  onClick={() => handleAvailabilityChange(id)}
                  className="text-white/70 hover:text-white"
                  aria-label={`Remove ${option.label} filter`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : null
          })}
        </div>
      ) : null}
    </div>
  )
}