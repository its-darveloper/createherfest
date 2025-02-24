// import { Metadata } from 'next'
// import { getMentors } from '@/lib/sanity'
// import { MentorsHero } from '@/components/mentors/mentors-hero'
// import { MentorsGrid } from '@/components/mentors/mentors-grid'
// import { ApplyMentorCTA } from '@/components/mentors/apply-mentor-cta'

// export const metadata: Metadata = {
//   title: 'Mentors | CreateHER Fest',
//   description: 'Connect with industry experts who are passionate about guiding the next generation of women in tech',
//   openGraph: {
//     title: 'Meet Our Mentors | CreateHER Fest',
//     description: 'Get personalized mentorship from leaders in AI, Blockchain, AR/VR, and more',
//     images: [
//       {
//         url: '/images/mentors-og.jpg',
//         width: 1200,
//         height: 630,
//         alt: 'CreateHER Fest Mentors'
//       }
//     ]
//   }
// }

// export default async function MentorsPage() {
//   const mentors = await getMentors()

//   return (
//     <div className="min-h-screen bg-[#150E60] overflow-hidden">
//       {/* Background decorations */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-[#473DC6]/20 rounded-full blur-3xl opacity-60 transform translate-x-1/3 -translate-y-1/3" />
//         <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-[#CAA3D6]/20 rounded-full blur-3xl opacity-40 transform -translate-x-1/3 translate-y-1/3" />
//       </div>

//       {/* Main content */}
//       <div className="relative z-10">
//         <MentorsHero />
//         <MentorsGrid initialMentors={mentors} />
//         <h1>Hi</h1>
//         <ApplyMentorCTA />
//       </div>
//     </div>
//   )
// }