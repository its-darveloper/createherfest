// src/app/not-found.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#150E60] flex items-center justify-center">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-40 w-[500px] h-[500px] bg-[#473dc6]/40 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-40 w-[500px] h-[500px] bg-[#caa3d6]/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#150e60]/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 flex flex-col items-center text-center">
        <div className="text-[10rem] font-bold text-[#473dc6]/40">404</div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Page Not Found</h1>
        
        <p className="text-[#f1eae7]/80 max-w-xl mx-auto text-lg mb-12">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        
        <Button asChild className="bg-[#473dc6] hover:bg-[#473dc6]/80 text-white text-lg px-8 py-6">
          <Link href="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Return to Home
          </Link>
        </Button>
      </div>
    </main>
  );
}