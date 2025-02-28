// src/app/mentors/page.tsx
import { Metadata } from 'next'
import { Suspense } from 'react'
import { ChevronDown } from 'lucide-react'
import { MentorGrid } from '@/components/mentors/mentor-grid'
import { MentorFilterBar } from '@/components/mentors/mentor-filter-bar'
import { MentorsSkeleton } from '@/components/mentors/mentors-skeleton'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Connect with Mentors | CreateHER Fest',
  description: 'Book sessions with industry experts to get guidance on your project.',
}

// Client component with search params is now properly wrapped in Suspense
export default function MentorsPage() {
  return (
    <main className="min-h-screen bg-[#150E60] text-[#f1eae7] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] -right-40 w-[600px] h-[600px] bg-[#473dc6]/30 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[20%] -left-40 w-[500px] h-[500px] bg-[#caa3d6]/20 rounded-full blur-[120px] animate-pulse-slower" />
        <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-[#cfe6ff]/10 rounded-full blur-[80px] animate-float" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#150e60]/0 via-[#150e60]/60 to-[#150e60] pointer-events-none" />
      </div>

      {/* Improved Hero Content with 3D-like layers */}
      <div className="relative pt-16 pb-32 overflow-hidden">
        {/* Abstract graphic elements */}
        <div className="absolute top-[20%] right-[10%] w-20 h-20 border border-[#473dc6]/30 rounded-full animate-spin-slow"></div>
        <div className="absolute top-[30%] left-[5%] w-40 h-40 border-2 border-[#caa3d6]/20 rounded-full"></div>
        <div className="absolute bottom-[10%] right-[15%] w-16 h-16 bg-[#473dc6]/10 rounded-lg rotate-45 animate-float-slow"></div>
        
        {/* Grid pattern background */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-5"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 md:px-6 flex flex-col items-center">
          <div className="bg-[#473dc6]/5 backdrop-blur-sm border border-[#473dc6]/10 rounded-full px-4 py-2 text-[#cfe6ff] text-sm font-medium mb-6 animate-fade-in">
            <span className="inline-block w-2 h-2 rounded-full bg-[#cfe6ff] mr-2 animate-pulse"></span>
            CreateHER Fest Idea-thon
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-center max-w-4xl mb-6 tracking-tight">
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-[#cfe6ff] via-white to-[#caa3d6] bg-clip-text text-transparent animate-text-shimmer">
                Connect with Mentors
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-[#473dc6]/0 via-[#473dc6] to-[#473dc6]/0 blur-sm"></span>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-[#f1eae7]/80 max-w-[90%] md:max-w-2xl mx-auto leading-relaxed text-center mb-12 animate-fade-in-up">
            Book a session with industry experts who will guide you through your Idea-thon project 
            and help you transform your concept into reality.
          </p>
          
          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-16 animate-fade-in-up delay-100">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-[#cfe6ff] to-[#caa3d6] bg-clip-text text-transparent">30+</div>
              <div className="text-[#f1eae7]/70 text-sm mt-1">Industry Experts</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-[#cfe6ff] to-[#caa3d6] bg-clip-text text-transparent">100+</div>
              <div className="text-[#f1eae7]/70 text-sm mt-1">Available Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-[#cfe6ff] to-[#caa3d6] bg-clip-text text-transparent">8+</div>
              <div className="text-[#f1eae7]/70 text-sm mt-1">Expertise Areas</div>
            </div>
          </div>
        </div>
      </div>
        
      {/* How It Works Section - Redesigned */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 mb-24">
        <div className="bg-gradient-to-br from-[#150e60]/80 to-[#150e60]/95 backdrop-blur-lg border border-[#473dc6]/20 rounded-3xl p-12 max-w-6xl mx-auto shadow-glow hover:shadow-glow-hover transition-all duration-500">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-[#cfe6ff] to-[#caa3d6] bg-clip-text text-transparent">
              How It Works
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection lines between steps */}
            <div className="hidden md:block absolute top-1/3 left-1/3 right-1/3 border-t-2 border-dashed border-[#473dc6]/30 z-0" />
            
            {[
              {
                step: 1,
                title: 'Choose a Mentor',
                description: 'Browse experts by field and find your perfect match',
                icon: '👩‍💻'
              },
              {
                step: 2,
                title: 'Book a Session',
                description: 'Select available slots and invite team members',
                icon: '📅'
              },
              {
                step: 3,
                title: 'Get Guidance',
                description: 'Receive tailored advice via video session',
                icon: '💡'
              }
            ].map((item) => (
              <div 
                key={item.step}
                className="group relative z-10 flex flex-col items-center text-center p-8 bg-[#473dc6]/10 backdrop-blur-sm border border-[#473dc6]/20 rounded-2xl hover:bg-[#473dc6]/15 transition-all duration-300 hover:scale-105"
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#473dc6] to-[#6658db] flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg transform transition-transform group-hover:rotate-3 group-hover:scale-110">
                    <span className="text-3xl">{item.icon}</span>
                  </div>
                  <div className="absolute -top-4 -right-2 w-8 h-8 rounded-full bg-[#150e60] border-2 border-[#473dc6] flex items-center justify-center text-white font-bold group-hover:bg-[#473dc6] transition-colors">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-[#f1eae7]/80 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
        
      {/* Filter Bar - Wrap in Suspense boundary */}
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        {/* This is where we need to wrap the client components in Suspense */}
        <Suspense fallback={<div className="w-full h-12 bg-[#473dc6]/20 animate-pulse rounded-lg mb-8"></div>}>
          <MentorFilterBar />
        </Suspense>
        
        {/* Mentor Grid is already wrapped in Suspense */}
        <Suspense fallback={<MentorsSkeleton />}>
          <MentorGrid />
        </Suspense>
      </div>
    </main>
  )
}