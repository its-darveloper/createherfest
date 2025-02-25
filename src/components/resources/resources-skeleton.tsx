// components/resources/resources-skeleton.tsx

export function ResourcesSkeleton() {
  return (
    <div className="container mx-auto px-4">
      {/* Hero section skeleton */}
      <div className="rounded-3xl bg-gradient-to-r from-[#473DC6] to-[#150E60] p-10 md:p-16 mb-12 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="h-10 w-64 bg-white/10 rounded-xl mb-6 mx-auto animate-pulse"></div>
          <div className="h-24 bg-white/10 rounded-xl mb-8 mx-auto animate-pulse"></div>
          <div className="h-12 max-w-2xl bg-white/10 rounded-xl mx-auto animate-pulse"></div>
        </div>
      </div>
      
      {/* Main content grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar filters skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-[#1c144d] rounded-2xl border border-white/5 p-6">
            <div className="h-6 w-24 bg-white/10 rounded-md mb-6 animate-pulse"></div>
            
            {/* Topics filter skeleton */}
            <div className="mb-8">
              <div className="h-5 w-20 bg-white/10 rounded-md mb-3 animate-pulse"></div>
              {[1, 2, 3, 4, 5].map((_, index) => (
                <div key={index} className="flex items-center mb-2">
                  <div className="w-4 h-4 rounded border border-white/30 mr-3"></div>
                  <div className="h-4 w-32 bg-white/10 rounded-md animate-pulse"></div>
                </div>
              ))}
            </div>
            
            {/* Content Type filter skeleton */}
            <div className="mb-8">
              <div className="h-5 w-32 bg-white/10 rounded-md mb-3 animate-pulse"></div>
              {[1, 2, 3, 4].map((_, index) => (
                <div key={index} className="flex items-center mb-2">
                  <div className="w-4 h-4 rounded border border-white/30 mr-3"></div>
                  <div className="h-4 w-40 bg-white/10 rounded-md animate-pulse"></div>
                </div>
              ))}
            </div>
            
            {/* Programming Language filter skeleton */}
            <div>
              <div className="h-5 w-48 bg-white/10 rounded-md mb-3 animate-pulse"></div>
              {[1, 2, 3, 4].map((_, index) => (
                <div key={index} className="flex items-center mb-2">
                  <div className="w-4 h-4 rounded border border-white/30 mr-3"></div>
                  <div className="h-4 w-28 bg-white/10 rounded-md animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Resources grid skeleton */}
        <div className="lg:col-span-3">
          {/* Results count skeleton */}
          <div className="h-5 w-48 bg-white/10 rounded-md mb-6 animate-pulse"></div>
          
          {/* Resources grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-[#1c144d] rounded-xl border border-white/10 p-6 h-64
                        animate-pulse"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex mb-4">
                  <div className="h-6 w-24 bg-white/10 rounded-full mr-2"></div>
                  <div className="h-6 w-20 bg-white/10 rounded-full"></div>
                </div>
                <div className="h-6 w-3/4 bg-white/10 rounded-md mb-2"></div>
                <div className="h-4 w-full bg-white/10 rounded-md mb-1"></div>
                <div className="h-4 w-full bg-white/10 rounded-md mb-1"></div>
                <div className="h-4 w-2/3 bg-white/10 rounded-md mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-5 w-16 bg-white/10 rounded-md"></div>
                  <div className="h-5 w-16 bg-white/10 rounded-md"></div>
                </div>
                <div className="mt-auto pt-4 border-t border-white/10 flex justify-between">
                  <div className="h-4 w-32 bg-white/10 rounded-md"></div>
                  <div className="h-8 w-8 bg-white/10 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}