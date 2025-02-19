// app/page.tsx
import { Hero } from "@/components/sections/hero-section"
import { StatsSection } from "@/components/sections/stats-section"
import { AboutSection } from "@/components/sections/about-section"
import { UpcomingWorkshops } from "@/components/sections/upcoming-workshops"
import { EventSeries } from "@/components/sections/event-series"
import { PartnersSection } from "@/components/sections/partners-section"

export default function HomePage() {
  return (
    <main>
      <Hero />
      <StatsSection />
      <AboutSection />
      <UpcomingWorkshops />
      <EventSeries />
      <PartnersSection />
      {/* Other sections */}
    </main>
  )
}