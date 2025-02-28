// src/components/mentors/mentors-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton"

export function MentorsSkeleton() {
  return (
    <div>
      {/* Filter bar skeleton */}
      <div className="mb-8 p-4 bg-[#150e60]/70 backdrop-blur-sm rounded-lg border border-[#473dc6]/30">
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <Skeleton className="h-10 flex-grow bg-[#2b2b2b]/50" />
          <Skeleton className="h-10 w-32 bg-[#2b2b2b]/50" />
          <Skeleton className="h-10 w-32 bg-[#2b2b2b]/50" />
        </div>
      </div>

      {/* Grid of mentor card skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <MentorCardSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}

function MentorCardSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden bg-[#150e60]/70 border border-[#473dc6]/30 backdrop-blur-sm">
      {/* Header image area */}
      <div className="relative h-48 w-full bg-gradient-to-b from-[#473dc6]/30 to-[#150e60]">
        {/* Expertise badges */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full bg-[#2b2b2b]/50" />
          <Skeleton className="h-6 w-20 rounded-full bg-[#2b2b2b]/50" />
        </div>
        
        {/* Mentor image */}
        <div className="absolute bottom-0 right-6 translate-y-1/2">
          <Skeleton className="w-24 h-24 rounded-full bg-[#2b2b2b]/50" />
        </div>
      </div>
      
      {/* Content */}
      <div className="pt-16 pb-4 px-6">
        <Skeleton className="h-6 w-36 bg-[#2b2b2b]/50 mb-1" />
        <Skeleton className="h-4 w-48 bg-[#2b2b2b]/50 mb-4" />
        
        <Skeleton className="h-12 w-full bg-[#2b2b2b]/50 mb-4" />
        
        <div className="flex flex-col space-y-2">
          <Skeleton className="h-4 w-40 bg-[#2b2b2b]/50" />
          <Skeleton className="h-4 w-36 bg-[#2b2b2b]/50" />
        </div>
      </div>
      
      {/* Footer */}
      <div className="flex justify-between items-center pt-0 px-6 pb-6">
        <Skeleton className="h-4 w-24 bg-[#2b2b2b]/50" />
        <Skeleton className="h-10 w-28 bg-[#473dc6]/50 rounded-md" />
      </div>
    </div>
  )
}