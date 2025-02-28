// components/resources/resources-skeleton.tsx

export function ResourcesSkeleton() {
  return (
    <div className="container mx-auto px-4">
      {/* Hero section skeleton with glassmorphism */}
      <div className="relative rounded-3xl border border-white/10 overflow-hidden backdrop-blur-xl shadow-xl mb-16">
        {/* Background gradients */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#473DC6]/80 to-[#150E60]/95"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#caa3d6]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#473dc6]/30 rounded-full blur-3xl"></div>
        </div>
        
        {/* Content skeleton */}
        <div className="relative z-10 p-10 md:p-20 max-w-4xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-white/10 mb-6 mx-auto animate-pulse"></div>
          <div className="h-10 w-64 bg-white/10 rounded-xl mb-6 mx-auto animate-pulse"></div>
          <div className="h-24 bg-white/10 rounded-xl mb-8 mx-auto animate-pulse"></div>
          <div className="h-14 max-w-2xl bg-white/10 rounded-xl mx-auto animate-pulse"></div>
        </div>
      </div>
      
      {/* Main content grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar filters skeleton */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-lg relative overflow-hidden">
            {/* Subtle background elements */}
            <div className="absolute inset-0" aria-hidden="true">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#473dc6]/10 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[#caa3d6]/10 to-transparent rounded-full blur-2xl"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 rounded-lg bg-white/10 animate-pulse mr-3"></div>
                <div className="h-6 w-24 bg-white/10 rounded-md animate-pulse"></div>
              </div>
              
              {/* Topics filter skeleton */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-4 h-4 rounded-md bg-white/10 animate-pulse mr-2"></div>
                  <div className="h-5 w-20 bg-white/10 rounded-md animate-pulse"></div>
                </div>
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <div className="w-5 h-5 rounded-md border border-white/20 mr-3"></div>
                    <div className="h-4 w-32 bg-white/10 rounded-md animate-pulse"></div>
                  </div>
                ))}
              </div>
              
              {/* Content Type filter skeleton */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-4 h-4 rounded-md bg-white/10 animate-pulse mr-2"></div>
                  <div className="h-5 w-32 bg-white/10 rounded-md animate-pulse"></div>
                </div>
                {[1, 2, 3, 4].map((_, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <div className="w-5 h-5 rounded-md border border-white/20 mr-3"></div>
                    <div className="h-4 w-40 bg-white/10 rounded-md animate-pulse"></div>
                  </div>
                ))}
              </div>
              
              {/* Programming Language filter skeleton */}
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-4 h-4 rounded-md bg-white/10 animate-pulse mr-2"></div>
                  <div className="h-5 w-48 bg-white/10 rounded-md animate-pulse"></div>
                </div>
                {[1, 2, 3, 4].map((_, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <div className="w-5 h-5 rounded-md border border-white/20 mr-3"></div>
                    <div className="h-4 w-28 bg-white/10 rounded-md animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Resources grid skeleton */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          {/* Results count skeleton */}
          <div className="h-10 w-48 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-6 animate-pulse"></div>
          
          {/* Resources grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <ResourceCardSkeleton key={index} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ResourceCardSkeleton({ index }: { index: number }) {
  // Get a slightly different animation delay for each card
  const getAnimationDelay = () => {
    return `${index * 0.1}s`;
  };

  // Get different gradients for variety
  const getGradient = () => {
    const gradients = [
      'from-[#3b82f6]/20 to-[#1d4ed8]/10',
      'from-[#8b5cf6]/20 to-[#6d28d9]/10',
      'from-[#10b981]/20 to-[#047857]/10',
      'from-[#f59e0b]/20 to-[#d97706]/10'
    ];
    return gradients[index % 4];
  };

  return (
    <div
      className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 h-80
              relative overflow-hidden"
      style={{ animationDelay: getAnimationDelay() }}
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className={`absolute -inset-1 bg-gradient-to-r ${getGradient()} blur-xl opacity-60`}></div>
        <div className="absolute inset-0  bg-no-repeat bg-cover opacity-[0.03] mix-blend-overlay"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex gap-2 mb-4">
          <div className="h-7 w-28 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full animate-pulse"></div>
          <div className="h-7 w-24 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full animate-pulse"></div>
        </div>
        
        <div className="h-7 w-3/4 bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg mb-2 animate-pulse"></div>
        <div className="h-5 w-full bg-white/10 backdrop-blur-sm border border-white/10 rounded-md mb-1 animate-pulse"></div>
        <div className="h-5 w-full bg-white/10 backdrop-blur-sm border border-white/10 rounded-md mb-1 animate-pulse"></div>
        <div className="h-5 w-2/3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-md mb-4 animate-pulse"></div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-6 w-20 bg-white/10 backdrop-blur-sm border border-white/10 rounded-md animate-pulse"></div>
          <div className="h-6 w-16 bg-white/10 backdrop-blur-sm border border-white/10 rounded-md animate-pulse"></div>
          <div className="h-6 w-24 bg-white/10 backdrop-blur-sm border border-white/10 rounded-md animate-pulse"></div>
        </div>
        
        <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mr-2 animate-pulse"></div>
            <div className="h-4 w-24 bg-white/10 backdrop-blur-sm border border-white/10 rounded-md animate-pulse"></div>
          </div>
          
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 animate-pulse"></div>
        </div>
      </div>
      
      {/* Floating particles for visual interest */}
      <div className="absolute top-1/4 right-4 w-1.5 h-1.5 rounded-full bg-white/20 opacity-30 animate-float-slow" aria-hidden="true"></div>
      <div className="absolute bottom-1/3 left-6 w-1 h-1 rounded-full bg-white/20 opacity-30 animate-float" aria-hidden="true"></div>
    </div>
  )
}