"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, ChevronDown, Filter, Search, X, Zap, Sliders, CalendarClock, Sparkles } from "lucide-react"
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
  { id: "ai_ml", label: "AI/ML", icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: "blockchain", label: "Blockchain", icon: <Zap className="w-3.5 h-3.5" /> },
  { id: "ar_vr", label: "AR/VR", icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: "product_design", label: "Product Design", icon: <Sliders className="w-3.5 h-3.5" /> },
  { id: "ux_ui", label: "UX/UI", icon: <Sliders className="w-3.5 h-3.5" /> },
  { id: "business_strategy", label: "Business Strategy", icon: <Sliders className="w-3.5 h-3.5" /> },
  { id: "pitch_presentation", label: "Pitch & Presentation", icon: <Sliders className="w-3.5 h-3.5" /> },
  { id: "technical_implementation", label: "Technical Implementation", icon: <Zap className="w-3.5 h-3.5" /> },
]

const availabilityOptions = [
  { id: "today", label: "Today", color: "#cfe6ff" },
  { id: "tomorrow", label: "Tomorrow", color: "#caa3d6" },
  { id: "this_week", label: "This Week", color: "#473dc6" },
  { id: "next_week", label: "Next Week", color: "#6658db" },
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
    <div className="mb-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
      {/* Subtle background design elements */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#473dc6]/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[#caa3d6]/10 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute -right-10 bottom-0 w-20 h-20 border border-[#473dc6]/10 rounded-full opacity-20"></div>
      </div>
      
      <div className="relative z-10">
        {/* <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#473dc6] to-[#6658db] flex items-center justify-center shadow-lg">
            <Filter className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xl text-white font-medium">Find Your Perfect Mentor</h3>
        </div> */}
        
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-4">
          {/* Search with enhanced styling */}
          <div className="relative flex-grow">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full bg-[#473dc6]/20">
              <Search className="h-3.5 w-3.5 text-[#caa3d6]" />
            </div>
            <Input
              placeholder="Search mentors by name or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-white/5 backdrop-blur-sm border-white/10 focus:border-[#473dc6]/50 rounded-xl placeholder:text-[#f1eae7]/30 text-[#f1eae7] focus-visible:ring-[#473dc6]/30 transition-all duration-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#f1eae7]/50 hover:text-white/90 transition-colors duration-200 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Filter buttons with glassmorphism */}
          <div className="flex gap-2">
            {/* Expertise Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="h-12 justify-between bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 text-[#f1eae7] hover:bg-white/10 rounded-xl px-4 min-w-32 transition-all duration-300 group"
                >
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-md bg-[#473dc6]/20 flex items-center justify-center mr-2">
                      <Sparkles className="h-3.5 w-3.5 text-[#caa3d6] group-hover:text-[#cfe6ff] transition-colors" />
                    </div>
                    <span>Expertise</span>
                  </div>
                  <div className="flex items-center">
                    {selectedExpertise.length > 0 && (
                      <span className="mr-2 rounded-full bg-gradient-to-r from-[#473dc6] to-[#6658db] w-6 h-6 flex items-center justify-center text-xs text-white">
                        {selectedExpertise.length}
                      </span>
                    )}
                    <ChevronDown className="h-4 w-4 opacity-50 group-hover:translate-y-0.5 transition-transform" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-64 bg-[#150e60]/95 backdrop-blur-xl border border-white/10 shadow-xl rounded-xl p-1 overflow-hidden relative"
                align="end"
              >
                {/* Subtle visual elements */}
                <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#473dc6]/10 rounded-full blur-2xl"></div>
                </div>
                
                <DropdownMenuLabel className="text-[#f1eae7] px-3 py-2 text-lg">Filter by Expertise</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                
                <div className="relative z-10 py-1 max-h-64 overflow-y-auto custom-scrollbar">
                  {expertiseAreas.map(area => (
                    <DropdownMenuCheckboxItem
                      key={area.id}
                      checked={selectedExpertise.includes(area.id)}
                      onCheckedChange={() => handleExpertiseChange(area.id)}
                      className="text-[#f1eae7] focus:bg-white/10 hover:bg-white/5 rounded-lg mx-1 my-0.5 px-3 py-2 focus:text-white cursor-pointer transition-colors duration-200 flex items-center gap-2"
                    >
                      <div className={`flex items-center justify-center w-6 h-6 rounded-md ${selectedExpertise.includes(area.id) ? 'bg-[#473dc6]' : 'bg-[#473dc6]/20'} transition-colors`}>
                        {area.icon}
                      </div>
                      <span>{area.label}</span>
                    </DropdownMenuCheckboxItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Availability Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="h-12 justify-between bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 text-[#f1eae7] hover:bg-white/10 rounded-xl px-4 min-w-32 transition-all duration-300 group"
                >
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-md bg-[#473dc6]/20 flex items-center justify-center mr-2">
                      <CalendarClock className="h-3.5 w-3.5 text-[#caa3d6] group-hover:text-[#cfe6ff] transition-colors" />
                    </div>
                    <span>Availability</span>
                  </div>
                  <div className="flex items-center">
                    {selectedAvailability.length > 0 && (
                      <span className="mr-2 rounded-full bg-gradient-to-r from-[#caa3d6] to-[#b37fc6] w-6 h-6 flex items-center justify-center text-xs text-white">
                        {selectedAvailability.length}
                      </span>
                    )}
                    <ChevronDown className="h-4 w-4 opacity-50 group-hover:translate-y-0.5 transition-transform" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-56 bg-[#150e60]/95 backdrop-blur-xl border border-white/10 shadow-xl rounded-xl p-1 overflow-hidden relative"
                align="end"
              >
                {/* Subtle visual elements */}
                <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#caa3d6]/10 rounded-full blur-2xl"></div>
                </div>
                
                <DropdownMenuLabel className="text-[#f1eae7] px-3 py-2 text-lg relative z-10">Filter by Availability</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                
                <div className="relative z-10 py-1">
                  {availabilityOptions.map(option => (
                    <DropdownMenuCheckboxItem
                      key={option.id}
                      checked={selectedAvailability.includes(option.id)}
                      onCheckedChange={() => handleAvailabilityChange(option.id)}
                      className="text-[#f1eae7] focus:bg-white/10 hover:bg-white/5 rounded-lg mx-1 my-0.5 px-3 py-2 focus:text-white cursor-pointer transition-colors duration-200"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: option.color }}></div>
                        {option.label}
                      </div>
                    </DropdownMenuCheckboxItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Clear Filters with animated button */}
            {(selectedExpertise.length > 0 || selectedAvailability.length > 0 || searchQuery) && (
              <Button 
                variant="ghost" 
                onClick={clearFilters}
                className="h-12 relative overflow-hidden bg-white/5 backdrop-blur-sm hover:bg-white/10 border border-white/10 text-[#f1eae7]/70 hover:text-white rounded-xl px-4 transition-all duration-300 group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-30 animate-shimmer-slow"></span>
                <span className="relative flex items-center gap-2">
                  <X className="h-4 w-4" />
                  Clear All
                </span>
              </Button>
            )}
          </div>
        </div>

        {/* Active filters display - Enhanced */}
        {(selectedExpertise.length > 0 || selectedAvailability.length > 0) && (
          <div className="flex flex-wrap gap-2 mt-6">
            {selectedExpertise.map(id => {
              const area = expertiseAreas.find(a => a.id === id)
              return area ? (
                <div 
                  key={id}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-full pl-2 pr-1 py-1
                          flex items-center gap-1 group hover:bg-white/10 transition-colors duration-200"
                >
                  <div className="w-5 h-5 rounded-full bg-[#473dc6]/30 flex items-center justify-center mr-1">
                    {area.icon}
                  </div>
                  <span className={`${typography.caption} text-white`}>{area.label}</span>
                  <button
                    onClick={() => handleExpertiseChange(id)}
                    className="ml-1 w-5 h-5 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10"
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
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-full pl-3 pr-1 py-1
                          flex items-center gap-2 group hover:bg-white/10 transition-colors duration-200"
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: option.color }}></div>
                  <span className={`${typography.caption} text-white`}>{option.label}</span>
                  <button
                    onClick={() => handleAvailabilityChange(id)}
                    className="ml-1 w-5 h-5 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10"
                    aria-label={`Remove ${option.label} filter`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : null
            })}
          </div>
        )}
      </div>
      
      {/* Floating particles for visual interest */}
      <div className="absolute top-6 right-6 w-3 h-3 rounded-full bg-[#cfe6ff]/30 animate-float-slow" aria-hidden="true"></div>
      <div className="absolute bottom-8 left-1/4 w-2 h-2 rounded-full bg-[#caa3d6]/30 animate-float" aria-hidden="true"></div>
    </div>
  )
}