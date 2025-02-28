// src/app/api/mentors/route.ts
import { NextResponse } from 'next/server'
import { addDays, format } from 'date-fns'
import { getMentors } from '@/lib/sanity/queries'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const pageParam = searchParams.get('page')
    const page = pageParam ? parseInt(pageParam) : 1
    const expertise = searchParams.get('expertise')
    const availability = searchParams.get('availability')
    const search = searchParams.get('search')
    
    // Process availability filter to convert to date ranges
    let availabilityDates: string[] | undefined = undefined
    
    if (availability) {
      const availabilityFilters = availability.split(',')
      const today = new Date()
      availabilityDates = []
      
      for (const filter of availabilityFilters) {
        switch (filter) {
          case 'today':
            availabilityDates.push(format(today, 'yyyy-MM-dd'))
            break
          case 'tomorrow':
            availabilityDates.push(format(addDays(today, 1), 'yyyy-MM-dd'))
            break
          case 'this_week': {
            // Add dates for rest of this week (up to next 7 days from today)
            const daysToAdd = Math.min(7, 7 - today.getDay()) // Days until Sunday
            for (let i = 0; i < daysToAdd; i++) {
              availabilityDates.push(format(addDays(today, i), 'yyyy-MM-dd'))
            }
            break
          }
          case 'next_week': {
            // Add dates for next week
            const daysUntilNextWeek = 7 - today.getDay() + 1 // Days until next Monday
            for (let i = 0; i < 7; i++) {
              availabilityDates.push(format(addDays(today, daysUntilNextWeek + i), 'yyyy-MM-dd'))
            }
            break
          }
        }
      }
      
      // Remove duplicates
      availabilityDates = [...new Set(availabilityDates)]
    }
    
    // Pass the processed filters to the Sanity query
    const mentors = await getMentors({
      page,
      expertise: expertise ? expertise.split(',') : undefined,
      availability: availabilityDates,
      search
    })
    
    return NextResponse.json(mentors)
  } catch (error) {
    console.error('Error fetching mentors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mentors' },
      { status: 500 }
    )
  }
}