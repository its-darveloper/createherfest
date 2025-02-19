export function SpeakersGridSkeleton() {
    return (
      <div className="container mx-auto px-4 py-12">
        {/* Search skeleton */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="h-12 w-full bg-white/5 rounded-lg mb-6 animate-pulse" />
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-8 w-20 bg-white/5 rounded-full flex-shrink-0 animate-pulse" />
            ))}
          </div>
        </div>
        
        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {Array.from({ length: 12 }).map((_, index) => (
            <div 
              key={index}
              className="rounded-2xl overflow-hidden bg-[#1c144d]/50 border border-[#473DC6]/10 h-[400px]
                       animate-pulse flex flex-col"
              style={{ 
                animationDelay: `${index * 0.05}s`,
                animationDuration: '1.5s'
              }}
            >
              <div className="h-[250px] bg-[#2c246d]/50 w-full" />
              <div className="p-6 flex-grow">
                <div className="h-6 bg-white/10 rounded w-3/4 mb-3" />
                <div className="h-4 bg-white/10 rounded w-1/2 mb-6" />
                <div className="mt-auto flex justify-between">
                  <div className="h-4 bg-white/10 rounded w-1/4" />
                  <div className="flex gap-2">
                    <div className="h-8 w-8 bg-white/10 rounded-full" />
                    <div className="h-8 w-8 bg-white/10 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }