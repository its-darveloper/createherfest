import { Metadata } from 'next'
import { getSpeakers } from '@/lib/sanity'
import { SpeakersHero } from '@/components/speakers/speakers-hero'
import { SpeakersGrid } from '@/components/speakers/speakers-grid'
import { ApplySpeakerCTA } from '@/components/speakers/apply-speaker-cta'

export const metadata: Metadata = {
  title: 'Speakers | CreateHER Fest',
  description: 'Discover an exceptional community of speakers driving innovation and inclusivity in emerging technologies',
  openGraph: {
    title: 'Meet Our Speakers | CreateHER Fest',
    description: 'Learn from industry experts and innovators at CreateHER Fest',
    images: [
      {
        url: '/images/speakers-og.jpg',
        width: 1200,
        height: 630,
        alt: 'CreateHER Fest Speakers'
      }
    ]
  }
}

export default async function SpeakersPage() {
  const speakers = await getSpeakers()

  return (
    <div className="min-h-screen bg-[#150E60] overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-[#473DC6]/20 rounded-full blur-3xl opacity-60 transform translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-[#CAA3D6]/20 rounded-full blur-3xl opacity-40 transform -translate-x-1/3 translate-y-1/3" />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <SpeakersHero />
        <SpeakersGrid initialSpeakers={speakers} />
        <ApplySpeakerCTA />
      </div>
    </div>
  )
}