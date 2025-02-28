// src/components/mentors/mentors-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton"

export function MentorsSkeleton() {
  return (
    <div>
      {/* Grid of mentor card skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <MentorCardSkeleton key={index} index={index} />
        ))}
      </div>
    </div>
  )
}

function MentorCardSkeleton({ index }: { index: number }) {
  // Get a slightly different animation delay for each card
  const getAnimationDelay = () => {
    return `${(index % 3) * 0.1}s`;
  };

  // Get different gradients for variety
  const getGradient = () => {
    const gradients = [
      'from-[#473dc6]/30 to-[#6658db]/10',
      'from-[#caa3d6]/30 to-[#b37fc6]/10',
      'from-[#cfe6ff]/30 to-[#95c2ff]/10'
    ];
    return gradients[index % 3];
  };

  return (
    <div 
      className="rounded-xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg relative"
      style={{ animationDelay: getAnimationDelay() }}
    >
      {/* Subtle animated pulse effect */}
      <div className="absolute inset-0 animate-pulse-slower" style={{ animationDelay: getAnimationDelay() }}>
        <div className={`absolute -inset-1 bg-gradient-to-r ${getGradient()} opacity-20 blur-xl rounded-xl`}></div>
      </div>
      
      {/* Header image area with shimmer effect */}
      <div className="relative h-48 w-full overflow-hidden">
        {/* Base gradient */}
        <div className={`absolute inset-0 bg-gradient-to-b ${getGradient()}`}></div>
        
        {/* Circuit pattern overlay */}
        <div className="absolute inset-0  bg-no-repeat bg-cover opacity-5 mix-blend-overlay"></div>
        
        {/* Animated shimmer effect */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-30 animate-shimmer-slow"></div>
        
        {/* Expertise badges */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <Skeleton className="h-7 w-20 rounded-full bg-white/10 border border-white/5" />
          <Skeleton className="h-7 w-16 rounded-full bg-white/10 border border-white/5" />
        </div>
        
        {/* Mentor image - square with rounded corners for futuristic look */}
        <div className="absolute -bottom-12 right-6">
          <Skeleton className="w-24 h-24 rounded-xl bg-white/10 border border-white/5 shadow-lg" />
        </div>
      </div>
      
      {/* Content */}
      <div className="pt-16 pb-4 px-6 relative z-10">
        <Skeleton className="h-7 w-40 bg-white/10 rounded-lg mb-2" />
        <Skeleton className="h-5 w-56 bg-white/10 rounded-lg mb-5" />
        
        <Skeleton className="h-4 w-full bg-white/10 rounded-lg mb-2" />
        <Skeleton className="h-4 w-5/6 bg-white/10 rounded-lg mb-2" />
        <Skeleton className="h-4 w-2/3 bg-white/10 rounded-lg mb-5" />
        
        <div className="flex flex-col space-y-3">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-6 w-6 rounded-md bg-white/10" />
            <Skeleton className="h-4 w-36 bg-white/10 rounded-lg" />
          </div>
          <div className="flex items-center space-x-3">
            <Skeleton className="h-6 w-6 rounded-md bg-white/10" />
            <Skeleton className="h-4 w-32 bg-white/10 rounded-lg" />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="flex justify-between items-center pt-0 px-6 pb-6 relative z-10">
        <Skeleton className="h-4 w-24 bg-white/10 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-full bg-gradient-to-r from-[#473dc6]/40 to-[#6658db]/40" />
      </div>
      
      {/* Floating particles for visual interest */}
      <div className="absolute top-1/4 right-6 w-2 h-2 rounded-full bg-[#cfe6ff]/20 animate-float-slow opacity-50"></div>
      <div className="absolute bottom-1/4 left-6 w-1.5 h-1.5 rounded-full bg-[#caa3d6]/20 animate-float opacity-50"></div>
    </div>
  )
}