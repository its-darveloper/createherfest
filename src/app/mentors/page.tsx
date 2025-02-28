// src/app/mentors/page.tsx
import { Metadata } from 'next'
import { Suspense } from 'react'
import { ChevronDown, Sparkles, Calendar, MessageCircle, ArrowRight, Filter, Zap, Search } from 'lucide-react'
import { MentorGrid } from '@/components/mentors/mentor-grid'
import { MentorFilterBar } from '@/components/mentors/mentor-filter-bar'
import { MentorsSkeleton } from '@/components/mentors/mentors-skeleton'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Connect with Mentors | CreateHER Fest',
  description: 'Book mentoring sessions with industry experts to get personalized guidance on your Idea-thon project.',
  keywords: 'mentors, tech mentorship, women in tech, CreateHER Fest, Idea-thon',
}

export default function MentorsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#15083a] via-[#150E60] to-[#1e145a] text-[#f1eae7] relative overflow-hidden">
      {/* Improved: Skip to content link for keyboard users */}
      <a href="#mentor-grid" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-[#473dc6] focus:text-white focus:top-4 focus:left-4 focus:rounded-md">
        Skip to mentors
      </a>
      
      {/* Dynamic interactive background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Animated grid pattern */}
        <div className="absolute inset-0   bg-repeat opacity-5 animate-slide-slow motion-reduce:animate-none"></div>
        
        {/* Futuristic floating orbs */}
        <div className="absolute top-[10%] -right-40 w-[600px] h-[600px] bg-gradient-to-br from-[#473dc6]/40 to-[#8675ff]/20 rounded-full blur-[100px] animate-pulse-slow motion-reduce:animate-none" />
        <div className="absolute bottom-[20%] -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-[#caa3d6]/30 to-[#ff9edb]/10 rounded-full blur-[120px] animate-pulse-slower motion-reduce:animate-none" />
        <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-gradient-to-r from-[#cfe6ff]/20 to-[#95c2ff]/10 rounded-full blur-[80px] animate-float motion-reduce:animate-none" />
        
        {/* Subtle laser lines */}
        <div className="absolute top-0 left-1/4 w-px h-screen bg-gradient-to-b from-transparent via-[#caa3d6]/20 to-transparent"></div>
        <div className="absolute top-0 left-3/4 w-px h-screen bg-gradient-to-b from-transparent via-[#473dc6]/30 to-transparent"></div>
        
        {/* Subtle noise texture */}
        
        
        {/* Gradient overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#150e60]/0 via-[#150e60]/60 to-[#150e60] pointer-events-none" />
      </div>

      {/* Hero Section with futuristic glassmorphism */}
      <header className="relative pt-20 pb-24 md:pb-32 overflow-hidden">
        <div className="absolute inset-x-0 top-[-10%] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20%]" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#473dc6] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 md:px-6 flex flex-col items-center">
          {/* Event Label with improved glass effect */}
          <div 
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-5 py-2 text-[#cfe6ff] text-sm font-medium mb-8 shadow-[0_0_15px_rgba(207,230,255,0.15)] animate-fade-in motion-reduce:animate-none flex items-center mt-10"
            aria-label="Event"
          >
            <span className="inline-block w-2 h-2 rounded-full bg-[#cfe6ff] mr-2 animate-ping motion-reduce:animate-none"></span>
            <span className="mr-1">CreateHER Fest</span>
            <span className="bg-gradient-to-r from-[#cfe6ff] to-[#caa3d6] bg-clip-text text-transparent font-semibold">Idea-thon</span>
          </div>

          {/* Dynamic animated heading */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-center max-w-4xl mb-8 tracking-tight">
            <div className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-br from-white via-[#cfe6ff] to-[#caa3d6] bg-clip-text text-transparent animate-text-shimmer">
                Connect with Mentors
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-[#473dc6]/0 via-[#473dc6] to-[#473dc6]/0 blur-lg" aria-hidden="true"></span>
              {/* Decorative elements */}
              <span className="absolute -right-6 -top-6 text-[#caa3d6] text-opacity-70" aria-hidden="true">
                <Sparkles className="w-5 h-5 animate-twinkle" />
              </span>
            </div>
          </h1>
          
          {/* Improved text with subtle glow */}
          <p className="text-lg sm:text-xl md:text-2xl text-[#f1eae7]/90 max-w-[90%] md:max-w-2xl mx-auto leading-relaxed text-center mb-12 animate-fade-in-up motion-reduce:animate-none shadow-text">
            Book a session with industry experts who will guide you through your Idea-thon project 
            and help you transform your concept into reality.
          </p>
          
          {/* Stats row with glassmorphism cards */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8 mb-16 animate-fade-in-up motion-reduce:animate-none delay-100">
            {[
              { value: "30+", label: "Industry Experts" },
              { value: "100+", label: "Available Sessions" },
              { value: "8+", label: "Expertise Areas" }
            ].map((stat, index) => (
              <div 
                key={index}
                className="text-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-8 py-4 shadow-[0_0_25px_rgba(71,61,198,0.15)] hover:shadow-[0_0_25px_rgba(207,230,255,0.25)] transition-all duration-500 hover:-translate-y-1"
                aria-label="Statistic"
              >
                <div className="text-4xl font-bold bg-gradient-to-br from-white to-[#caa3d6] bg-clip-text text-transparent mb-1">{stat.value}</div>
                <div className="text-[#f1eae7]/90 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Futuristic CTA Button */}
          <Button 
            size="lg" 
            className="relative overflow-hidden bg-gradient-to-r from-[#473dc6] to-[#6658db] hover:from-[#362da9] hover:to-[#5447c9] text-white rounded-full px-10 py-7 text-lg font-medium shadow-lg hover:shadow-xl hover:shadow-[#473dc6]/20 transition-all duration-300 focus:ring-4 focus:ring-[#cfe6ff]/30 group"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-30 animate-shimmer-slow motion-reduce:animate-none"></span>
            <span className="relative flex items-center">
              Find My Mentor
              <ChevronDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
            </span>
          </Button>
        </div>
      </header>
        
      {/* How It Works Section - Futuristic Glassmorphism Design */}
      <section 
        className="relative z-10 container mx-auto px-4 md:px-6 mb-24"
        aria-labelledby="how-it-works-heading"
      >
        <div className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 max-w-6xl mx-auto shadow-[0_0_30px_rgba(71,61,198,0.2)] hover:shadow-[0_0_40px_rgba(71,61,198,0.3)] transition-all duration-500">
          {/* Section heading with futuristic accent */}
          <h2 
            id="how-it-works-heading"
            className="text-3xl font-bold text-center mb-12 relative"
          >
            <span className="relative z-10 bg-gradient-to-r from-white via-[#cfe6ff] to-[#caa3d6] bg-clip-text text-transparent">
              How It Works
            </span>
            <span className="absolute left-1/2 -translate-x-1/2 top-full w-20 h-1 mt-4 bg-gradient-to-r from-[#473dc6]/0 via-[#473dc6] to-[#473dc6]/0"></span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative">
            {/* Futuristic connection line with animated pulse */}
            <div 
              className="hidden md:block absolute top-1/3 left-1/3 right-1/3 h-[2px] z-0" 
              aria-hidden="true"
              style={{
                background: 'linear-gradient(90deg, rgba(71,61,198,0) 0%, rgba(71,61,198,0.5) 20%, rgba(71,61,198,0.5) 80%, rgba(71,61,198,0) 100%)'
              }}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-pulse-slow motion-reduce:animate-none"></div>
            </div>
            
            {[
              {
                step: 1,
                title: 'Choose a Mentor',
                description: 'Browse experts by field and find your perfect match',
                icon: <Search className="w-8 h-8" />,
                color: 'from-[#cfe6ff] to-[#95c2ff]'
              },
              {
                step: 2,
                title: 'Book a Session',
                description: 'Select available slots and invite team members',
                icon: <Calendar className="w-8 h-8" />,
                color: 'from-[#caa3d6] to-[#9271ad]'
              },
              {
                step: 3,
                title: 'Get Guidance',
                description: 'Receive tailored advice via video session',
                icon: <MessageCircle className="w-8 h-8" />,
                color: 'from-[#473dc6] to-[#6658db]'
              }
            ].map((item) => (
              <div 
                key={item.step}
                className="group relative z-10 flex flex-col items-center text-center p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 shadow-lg"
                role="listitem"
                aria-label={`Step ${item.step}: ${item.title}`}
              >
                <div className="flex flex-col items-center">
                  {/* Futuristic icon container with gradient */}
                  <div 
                    className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-8 shadow-lg transform transition-transform group-hover:scale-110 overflow-hidden`}
                    aria-hidden="true"
                  >
                    {/* Animated shimmer effect */}
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-30 animate-shimmer"></span>
                    {/* Icon */}
                    <span className="relative z-10">{item.icon}</span>
                  </div>
                  
                  {/* Step indicator with hover animation */}
                  <div 
                    className="absolute -top-4 -right-2 w-8 h-8 rounded-full bg-[#150e60] border border-white/20 flex items-center justify-center text-white font-bold group-hover:bg-[#473dc6] transition-colors shadow-[0_0_10px_rgba(71,61,198,0.3)] group-hover:shadow-[0_0_15px_rgba(71,61,198,0.5)]"
                    aria-label={`Step ${item.step}`}
                  >
                    {item.step}
                  </div>
                </div>
                
                {/* Content with improved typography */}
                <h3 className="text-xl font-semibold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-[#f1eae7]/90 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Testimonial with futuristic glassmorphism */}
          <div className="mt-16 bg-gradient-to-r from-[#473dc6]/10 to-[#caa3d6]/10 backdrop-blur-xl border border-white/10 rounded-xl p-8 max-w-2xl mx-auto relative overflow-hidden">
            {/* Decorative quote marks */}
            <div className="absolute -top-2 -left-2 text-6xl text-[#473dc6]/20 font-serif" aria-hidden="true">"</div>
            <div className="absolute -bottom-8 -right-2 text-6xl text-[#473dc6]/20 font-serif" aria-hidden="true">"</div>
            
            {/* Subtle glow effects */}
            <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-[#cfe6ff]/5 blur-3xl rounded-full" aria-hidden="true"></div>
            
            {/* Testimonial content */}
            <blockquote className="text-[#f1eae7]/90 italic text-center relative z-10">
              "The mentoring session completely transformed our project approach. Our mentor helped us identify key opportunities we had overlooked."
            </blockquote>
            <div className="text-center mt-4 relative z-10">
              <div className="inline-flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#caa3d6] to-[#9271ad] flex items-center justify-center mr-3">
                  <span className="text-xs font-bold">MJ</span>
                </div>
                <span className="bg-gradient-to-r from-[#cfe6ff] to-[#caa3d6] bg-clip-text text-transparent font-medium">
                  Maya Johnson, 2024 Participant
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Mentors Section */}  
      <section 
        id="mentor-grid" 
        className="relative z-10 container mx-auto px-4 md:px-6 scroll-mt-20"
        aria-labelledby="available-mentors-heading"
      >
        <h2 
          id="available-mentors-heading" 
          className="text-3xl font-bold mb-8 relative inline-flex items-center"
        >
          <span className="bg-gradient-to-r from-white via-[#cfe6ff] to-[#caa3d6] bg-clip-text text-transparent">
            Available Mentors
          </span>
          <span className="ml-4 inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-[#473dc6]/20 border border-[#473dc6]/30 text-[#cfe6ff]">
            <Zap className="w-3 h-3 mr-1" />
            Now Booking
          </span>
        </h2>
        
        {/* Filter Bar with glassmorphism */}
        <div className="mb-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-[#caa3d6]" />
            <h3 className="text-xl text-white font-medium">Find Your Perfect Mentor</h3>
          </div>
          
          <Suspense fallback={<div className="w-full h-12 bg-[#473dc6]/20 animate-pulse rounded-lg"></div>}>
            <MentorFilterBar />
          </Suspense>
        </div>
        
        {/* Results section with count and sorting options */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div className="flex items-center bg-white/5 backdrop-blur-sm rounded-lg px-4 py-2">
            <p className="text-[#f1eae7]/80">
              <span className="text-white font-medium">30</span> mentors available
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-lg px-4 py-2">
            <label htmlFor="sort-by" className="text-[#f1eae7]/80 text-sm whitespace-nowrap">Sort by:</label>
            <select 
              id="sort-by" 
              className="bg-transparent text-white border-0 focus:outline-none focus:ring-0 text-sm appearance-none cursor-pointer"
            >
              <option value="recommended" className="bg-[#150E60] text-white">Recommended</option>
              <option value="availability" className="bg-[#150E60] text-white">Availability</option>
              <option value="experience" className="bg-[#150E60] text-white">Experience</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#caa3d6]" />
          </div>
        </div>
        
        {/* Mentor Grid */}
        <div className="relative">
          {/* Decorative tech particle elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 border border-[#473dc6]/10 rounded-full animate-spin-slow opacity-20" aria-hidden="true"></div>
          <div className="absolute -bottom-10 -left-10 w-20 h-20 border-2 border-[#caa3d6]/10 rounded-full opacity-20" aria-hidden="true"></div>
          
          <Suspense fallback={<MentorsSkeleton />}>
            <MentorGrid />
          </Suspense>
        </div>
        
        {/* No results message (hidden by default) */}
        <div className="hidden text-center py-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl mt-8">
          <div className="text-5xl mb-4" aria-hidden="true">🔍</div>
          <h3 className="text-xl font-medium text-white mb-2">No mentors found</h3>
          <p className="text-[#f1eae7]/80 mb-6">Try adjusting your filters or search criteria</p>
          <Button 
            variant="outline" 
            className="border-[#473dc6] text-white hover:bg-[#473dc6]/20 backdrop-blur-sm"
          >
            Clear Filters
          </Button>
        </div>

        {/* Load more button with futuristic design */}
        <div className="text-center mt-12 mb-20">
          <Button 
            size="lg"
            className="bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 rounded-full px-8 py-6 group relative overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-30 animate-shimmer-slow"></span>
            <span className="relative flex items-center">
              Load More Mentors
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
        </div>
      </section>

      {/* FAQ Section with futuristic design */}
      <section 
        className="relative z-10 container mx-auto px-4 md:px-6 mb-24"
        aria-labelledby="faq-heading"
      >
        <div className="max-w-3xl mx-auto">
          <h2 
            id="faq-heading"
            className="text-2xl md:text-3xl font-bold text-center mb-12 relative"
          >
            <span className="bg-gradient-to-r from-white via-[#cfe6ff] to-[#caa3d6] bg-clip-text text-transparent">
              Frequently Asked Questions
            </span>
            <span className="absolute left-1/2 -translate-x-1/2 top-full w-20 h-1 mt-4 bg-gradient-to-r from-[#473dc6]/0 via-[#473dc6] to-[#473dc6]/0"></span>
          </h2>
          
          <div className="space-y-6">
            {[
              {
                question: "How long are mentoring sessions?",
                answer: "Each mentoring session lasts 30 minutes. If you need additional time, you can book consecutive slots with the same mentor."
              },
              {
                question: "Can I invite my team members to join?",
                answer: "Absolutely! After booking, you'll receive a calendar invite that you can share with up to 4 team members."
              },
              {
                question: "What if I need to cancel or reschedule?",
                answer: "You can cancel or reschedule your session up to 24 hours before the scheduled time. Simply access your booking confirmation email for options."
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 relative overflow-hidden"
              >
                {/* Subtle glow effect */}
                <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-[#473dc6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" aria-hidden="true"></div>
                
                <h3 className="text-lg md:text-xl font-medium text-white mb-3 relative z-10 flex items-start">
                  <span className="text-[#caa3d6] mr-3 text-lg font-bold">Q.</span>
                  {item.question}
                </h3>
                <p className="text-[#f1eae7]/90 relative z-10 pl-6">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-[#f1eae7]/80 mb-4">
              Still have questions about mentoring sessions?
            </p>
            <Button 
              variant="outline" 
              className="bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 rounded-full px-6 py-2 group relative overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-30 animate-shimmer-slow"></span>
              <span className="relative">Contact Support</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer CTA with striking futuristic design */}
      <section className="relative z-10 container mx-auto px-4 md:px-6 mb-24">
        <div className="relative bg-gradient-to-r from-[#473dc6]/20 to-[#6658db]/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 max-w-5xl mx-auto text-center overflow-hidden">
          {/* Futuristic background elements */}
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute top-0 left-0 w-full h-full bg-no-repeat bg-cover opacity-5"></div>
            <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#473dc6]/20 rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#caa3d6]/20 rounded-full blur-[80px]"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-[#473dc6] to-[#6658db] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-[0_0_20px_rgba(71,61,198,0.5)]">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Elevate Your Project?
            </h2>
            <p className="text-[#f1eae7]/90 text-lg max-w-2xl mx-auto mb-8">
              Connect with industry experts who can help you refine your ideas and overcome technical challenges.
            </p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-[#cfe6ff] to-[#caa3d6] hover:from-[#caa3d6] hover:to-[#cfe6ff] text-[#150E60] rounded-full px-10 py-7 text-lg font-medium shadow-[0_0_30px_rgba(207,230,255,0.3)] hover:shadow-[0_0_30px_rgba(207,230,255,0.5)] transition-all duration-500 group relative overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-30 animate-shimmer-slow"></span>
              <span className="relative flex items-center font-semibold">
                Book Your Mentor Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}