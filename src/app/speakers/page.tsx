// src/app/speakers/page.tsx
import { Metadata } from 'next'
import { getSpeakers, urlFor } from '@/lib/sanity' // Added urlFor import
import { SpeakersHero } from '@/components/speakers/speakers-hero'
import { SpeakersGrid } from '@/components/speakers/speakers-grid'
import { SpeakersGridSkeleton } from '@/components/speakers/speakers-grid-skeleton'
import { Suspense } from 'react'
import { ApplySpeakerCTA } from '@/components/speakers/apply-speaker-cta'
import Script from 'next/script'

// Enhanced metadata for better SEO
export const metadata: Metadata = {
  title: 'Speakers | CreateHER Fest',
  description: 'Meet our industry-leading speakers at CreateHER Fest who are driving innovation and fostering inclusivity in emerging technologies including AI, blockchain, and AR/VR.',
  keywords: 'tech speakers, women in tech, diversity in tech, AI speakers, blockchain experts, AR/VR specialists, CreateHER Fest',
  openGraph: {
    title: 'Meet Our Industry-Leading Speakers | CreateHER Fest',
    description: 'Connect with tech innovators and thought leaders at CreateHER Fest driving change in AI, blockchain, and AR/VR.',
    url: 'https://createherfest.com/speakers',
    siteName: 'CreateHER Fest',
    images: [
      {
        url: 'https://createherfest.com/images/speakers-og-image.jpg', // Replace with actual image path
        width: 1200,
        height: 630,
        alt: 'CreateHER Fest Speakers',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meet Our Industry-Leading Speakers | CreateHER Fest',
    description: 'Connect with tech innovators and thought leaders at CreateHER Fest driving change in AI, blockchain, and AR/VR.',
    images: ['https://createherfest.com/images/speakers-twitter-image.jpg'], // Replace with actual image path
  },
  alternates: {
    canonical: 'https://createherfest.com/speakers',
  },
}

export default async function SpeakersPage() {
  // Pre-fetch speakers data for initial render
  const speakers = await getSpeakers()
  
  // Format speakers data for structured data
  const speakersForSchema = speakers.map(speaker => ({
    "@type": "Person",
    "name": speaker.name,
    "jobTitle": speaker.title || undefined,
    "worksFor": speaker.company ? {
      "@type": "Organization",
      "name": speaker.company
    } : undefined,
    "sameAs": speaker.linkedinUrl ? [speaker.linkedinUrl] : undefined,
    "image": speaker.image ? urlFor(speaker.image).width(800).height(800).url() : undefined
  }));
  
  // Create structured data for the page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": speakersForSchema.map((speaker, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": speaker
    })),
    "numberOfItems": speakersForSchema.length,
    "itemListOrder": "Unordered",
    "name": "CreateHER Fest Speakers"
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <Script id="speakers-structured-data" type="application/ld+json">
        {JSON.stringify(structuredData)}
      </Script>

      <main className="min-h-screen bg-[#150E60] overflow-hidden">
        {/* Background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-40 w-[500px] h-[500px] bg-[#473dc6]/40 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -left-40 w-[500px] h-[500px] bg-[#caa3d6]/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#150e60]/30 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          {/* Enhanced with proper semantic structure */}
          <header>
            <SpeakersHero />
          </header>
          
          <section aria-label="Speakers list">
            <Suspense fallback={<SpeakersGridSkeleton />}>
              <SpeakersGrid initialSpeakers={speakers} />
            </Suspense>
          </section>
          
          <section aria-labelledby="become-speaker-section">
            <ApplySpeakerCTA />
          </section>
        </div>
      </main>
    </>
  )
}