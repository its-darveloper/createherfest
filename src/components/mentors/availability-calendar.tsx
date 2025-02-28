"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { addDays, format, isSameDay, isBefore, startOfToday, parseISO } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AvailabilityDay {
  date: string
  slots: string[]
}

interface AvailabilityCalendarProps {
  mentorId: string
  availability: AvailabilityDay[]
}

export function AvailabilityCalendar({ mentorId, availability }: AvailabilityCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [visibleDaysStart, setVisibleDaysStart] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  
  // Parse dates properly to ensure they're in the correct format
  const availabilityWithDateObjects = availability.map(day => {
    // Make sure we're parsing the date correctly
    // Expecting format like "2025-03-01" from Sanity
    let dateObj: Date;
    try {
      // Try to use parseISO which is safer for ISO date strings
      dateObj = parseISO(day.date);
      
      // If the date is invalid, log it
      if (isNaN(dateObj.getTime())) {
        console.error(`Invalid date format: ${day.date}`);
        dateObj = new Date(); // Fallback to today
      }
    } catch (e) {
      console.error(`Error parsing date: ${day.date}`, e);
      dateObj = new Date(); // Fallback to today
    }
    
    return {
      date: dateObj,
      slots: day.slots,
      rawDate: day.date // Keep the original date string for debugging
    }
  });
  
  // Sort availability by date (earliest first)
  availabilityWithDateObjects.sort((a, b) => a.date.getTime() - b.date.getTime());
  
  // Get the next 14 days starting from today
  const today = startOfToday()
  const next14Days = [...Array(14)].map((_, i) => addDays(today, i + visibleDaysStart))
  
  // Get slots for the selected date
  const getTimeSlotsForDate = (date: Date | null) => {
    if (!date) return []
    
    // Debug logging to help track down issues
    console.log("Selected date:", date);
    console.log("Available dates:", availabilityWithDateObjects.map(d => ({ 
      date: d.date.toISOString(),
      rawDate: d.rawDate,
      slots: d.slots 
    })));
    
    const dayAvailability = availabilityWithDateObjects.find(day => 
      isSameDay(day.date, date)
    )
    
    return dayAvailability ? dayAvailability.slots : []
  }
  
  const selectedDateSlots = getTimeSlotsForDate(selectedDate)
  
  // Navigate to previous/next week
  const showPreviousDays = () => {
    setVisibleDaysStart(Math.max(0, visibleDaysStart - 7))
    setSelectedDate(null)
  }
  
  const showNextDays = () => {
    setVisibleDaysStart(visibleDaysStart + 7)
    setSelectedDate(null)
  }
  
  // Format time slot for display (e.g., "10:00" -> "10:00 AM")
  const formatTimeSlot = (timeSlot: string) => {
    const [hours, minutes] = timeSlot.split(':')
    const hour = parseInt(hours, 10)
    const period = hour >= 12 ? 'PM' : 'AM'
    const formattedHour = hour % 12 || 12
    return `${formattedHour}:${minutes} ${period}`
  }
  
  // Handle time slot selection
  const handleSelectTimeSlot = (slot: string) => {
    // Set loading state when a user clicks a time slot
    setIsLoading(true);
    // In a real app, you might want to check availability again before redirecting
    // Here we just simulate a short delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }
  
  return (
    <div className="space-y-6">
      {/* Date selector */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={showPreviousDays}
            disabled={visibleDaysStart === 0}
            className="text-[#f1eae7]/70 hover:text-white hover:bg-[#473dc6]/20 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="ml-1 text-sm">Previous</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={showNextDays}
            className="text-[#f1eae7]/70 hover:text-white hover:bg-[#473dc6]/20"
          >
            <span className="mr-1 text-sm">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {next14Days.slice(0, 7).map((date, i) => {
            const dayHasSlots = availabilityWithDateObjects.some(day => 
              isSameDay(day.date, date)
            )
            
            const isPastDate = isBefore(date, today)
            
            return (
              <div 
                key={i}
                onClick={() => !isPastDate && dayHasSlots && setSelectedDate(date)}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded cursor-pointer transition-all",
                  selectedDate && isSameDay(date, selectedDate) 
                    ? "bg-[#473dc6]/70 text-white" 
                    : dayHasSlots && !isPastDate
                      ? "hover:bg-[#473dc6]/20 text-[#f1eae7]/80"
                      : "opacity-40 cursor-not-allowed text-[#f1eae7]/50",
                )}
              >
                <span className="text-xs">{format(date, 'EEE')}</span>
                <span className="text-sm font-semibold">{format(date, 'd')}</span>
              </div>
            )
          })}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {next14Days.slice(7, 14).map((date, i) => {
            const dayHasSlots = availabilityWithDateObjects.some(day => 
              isSameDay(day.date, date)
            )
            
            const isPastDate = isBefore(date, today)
            
            return (
              <div 
                key={i}
                onClick={() => !isPastDate && dayHasSlots && setSelectedDate(date)}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded cursor-pointer transition-all",
                  selectedDate && isSameDay(date, selectedDate) 
                    ? "bg-[#473dc6]/70 text-white" 
                    : dayHasSlots && !isPastDate
                      ? "hover:bg-[#473dc6]/20 text-[#f1eae7]/80"
                      : "opacity-40 cursor-not-allowed text-[#f1eae7]/50",
                )}
              >
                <span className="text-xs">{format(date, 'EEE')}</span>
                <span className="text-sm font-semibold">{format(date, 'd')}</span>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Time slots */}
      {selectedDate ? (
        selectedDateSlots.length > 0 ? (
          <div>
            <h3 className="text-[#f1eae7]/80 text-sm font-medium mb-3">
              Available times for {format(selectedDate, 'EEEE, MMMM d')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {selectedDateSlots.map((slot, index) => (
                <Link 
                  key={index}
                  href={`/mentors/${mentorId}/book?date=${format(selectedDate, 'yyyy-MM-dd')}&time=${slot}`}
                  onClick={() => handleSelectTimeSlot(slot)}
                >
                  <div className="border border-[#473dc6]/50 rounded bg-[#150e60]/50 hover:bg-[#473dc6]/20 p-3 text-center cursor-pointer transition-all">
                    <span className="text-[#f1eae7]">{formatTimeSlot(slot)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-[#f1eae7]/60 py-4">
            No available slots for this day.
          </div>
        )
      ) : (
        <div className="text-center text-[#f1eae7]/60 py-4">
          Select a date to see available time slots.
        </div>
      )}
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#150e60] p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="animate-spin h-8 w-8 border-4 border-[#473dc6] border-t-transparent rounded-full"></div>
              <p className="text-[#f1eae7]">Checking availability...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}