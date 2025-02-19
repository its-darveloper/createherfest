import { Metadata } from 'next'
import { getFAQs } from '@/lib/sanity'
import { FAQsHero } from '@/components/faqs/faqs-hero'
import { FAQsSection } from '@/components/faqs/faqs-section'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | CreateHER Fest',
  description: 'Find answers to common questions about CreateHER Fest events, registration, workshops and more.',
}

export default async function FAQsPage() {
  const faqs = await getFAQs()
  
  return (
    <div className="min-h-screen bg-[#150E60] overflow-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-40 w-[500px] h-[500px] bg-[#473dc6]/40 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-40 w-[500px] h-[500px] bg-[#caa3d6]/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#150e60]/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <FAQsHero />
        <FAQsSection initialFaqs={faqs} />
      </div>
    </div>
  )
}
