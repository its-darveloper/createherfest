// src/app/resources/page.tsx
import { Metadata } from 'next'
import { getResources } from '@/lib/sanity'
import { ResourceLibrary } from '@/components/resources/resource-library'
import { Suspense } from 'react'
import { ResourcesSkeleton } from '@/components/resources/resources-skeleton'
import { Resource as SanityTypeResource } from '@/types/sanity'

export const metadata: Metadata = {
  title: 'Resource Library | CreateHER Fest',
  description: 'Explore our curated collection of resources designed to help you thrive in tech.',
  keywords: 'tech resources, learning, programming, AI, blockchain, AR/VR, CreateHER Fest',
}

export default async function ResourcesPage() {
  try {
    console.log("Fetching resources...");
    const resources = await getResources();
    console.log("Resources fetched:", resources);
    
    // Cast the resources to the expected type
    const typedResources = resources as unknown as SanityTypeResource[];
    
    return (
      <main className="min-h-screen bg-[#15083a] relative overflow-hidden">
        {/* Dynamic animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {/* Animated grid pattern */}
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-5 animate-slide-slow motion-reduce:animate-none"></div>
          
          {/* Futuristic gradients */}
          <div className="absolute top-[10%] -right-40 w-[600px] h-[600px] bg-gradient-to-br from-[#473dc6]/40 to-[#8675ff]/20 rounded-full blur-[100px] animate-pulse-slow motion-reduce:animate-none" />
          <div className="absolute bottom-[20%] -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-[#caa3d6]/30 to-[#ff9edb]/10 rounded-full blur-[120px] animate-pulse-slower motion-reduce:animate-none" />
          <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-gradient-to-r from-[#cfe6ff]/20 to-[#95c2ff]/10 rounded-full blur-[80px] animate-float motion-reduce:animate-none" />
          
          {/* Subtle laser lines */}
          <div className="absolute top-0 left-1/4 w-px h-screen bg-gradient-to-b from-transparent via-[#caa3d6]/20 to-transparent"></div>
          <div className="absolute top-0 left-3/4 w-px h-screen bg-gradient-to-b from-transparent via-[#473dc6]/30 to-transparent"></div>
          
          {/* Subtle noise texture */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"></div>
          
          {/* Gradient overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#15083a]/0 via-[#15083a]/60 to-[#15083a] pointer-events-none"></div>
        </div>

        {/* Floating tech elements */}
        <div className="absolute top-1/4 right-10 w-32 h-32 border border-[#473dc6]/20 rounded-full animate-spin-slower opacity-20" aria-hidden="true"></div>
        <div className="absolute bottom-1/3 left-16 w-24 h-24 border-2 border-[#caa3d6]/20 rounded-full animate-spin-slow opacity-20" aria-hidden="true"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-[#473dc6]/10 rounded-lg rotate-45 animate-float-slow" aria-hidden="true"></div>

        {/* Content wrapper with higher z-index to ensure visibility */}
        <div className="relative z-10 py-16 md:py-24">
          {/* Skip to content link for keyboard users */}
          <a href="#resources-main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-[#473dc6] focus:text-white focus:top-4 focus:left-4 focus:rounded-md">
            Skip to resources
          </a>
          
          <Suspense fallback={<ResourcesSkeleton />}>
            <div id="resources-main">
              <ResourceLibrary initialResources={typedResources} />
            </div>
          </Suspense>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error in resources page:", error);
    
    // Enhanced error state with glassmorphism
    return (
      <main className="min-h-screen bg-[#15083a] flex items-center justify-center p-4">
        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 max-w-md w-full shadow-xl">
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#ef4444]/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#ef4444]/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 bg-[#ef4444]/20 backdrop-blur-sm border border-[#ef4444]/30 rounded-xl flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Error Loading Resources</h2>
            <p className="text-white/80 mb-6">We encountered an issue while loading the resources. Our team has been notified and is working on a fix.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-full px-6 py-3 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }
}