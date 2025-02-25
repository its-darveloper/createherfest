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
}

export default async function ResourcesPage() {
  try {
    console.log("Fetching resources...");
    const resources = await getResources();
    console.log("Resources fetched:", resources);
    
    // Cast the resources to the expected type
    const typedResources = resources as unknown as SanityTypeResource[];
    
    return (
      <main className="min-h-screen bg-[#150E60]">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
          <div className="absolute top-1/4 -right-40 w-[500px] h-[500px] bg-[#473dc6]/40 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -left-40 w-[500px] h-[500px] bg-[#caa3d6]/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#150e60]/30 rounded-full blur-3xl" />
        </div>

        {/* Content wrapper with higher z-index to ensure visibility */}
        <div className="relative z-10 py-16 md:py-24">
          <Suspense fallback={<ResourcesSkeleton />}>
            <ResourceLibrary initialResources={typedResources} />
          </Suspense>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error in resources page:", error);
    return <div>Error loading resources. See console for details.</div>
  }
}