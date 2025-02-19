// components/speakers/speakers-hero.tsx
import { typography } from '@/lib/utils/typography'

export function SpeakersHero() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute -top-10 left-1/2 w-40 h-40 rounded-full bg-[#CAA3D6]/30 blur-3xl opacity-50 transform -translate-x-1/2" />
          
          <div className="text-center max-w-4xl mx-auto relative z-10">
            <div className="inline-block mb-6 backdrop-blur-sm bg-[#473DC6]/10 border border-[#473DC6]/30 
                         px-6 py-2 rounded-full overflow-hidden">
              <span className={`${typography.caption} text-[#CAA3D6] uppercase tracking-widest`}>
                Experts & Innovators
              </span>
              {/* Subtle moving highlight */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#CAA3D6]/70 to-transparent
                           animate-shimmer"></div>
            </div>
            
            <h1 className={`${typography.title} text-white mb-6`}>
              Meet the <span className="text-[#CAA3D6]">LeadHERs</span>
            </h1>
            
            <p className={`${typography.section} text-white/80 max-w-3xl mx-auto`}>
              Connect with an exceptional community of facilitators driving innovation 
              and inclusivity in emerging technologies.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}