// app/layout.tsx
import { Toaster } from "@/components/ui/toaster"
import type { Metadata } from "next";
import { Inter, Urbanist } from "next/font/google";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],  // Light, Regular, Medium
  variable: '--font-inter',
  display: 'swap',
});

const urbanist = Urbanist({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],  // Medium, SemiBold, Bold, ExtraBold
  variable: '--font-urbanist',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "CreateHER Fest",
  description: "Bridging the gender gap in tech through AI, Blockchain, and AR/VR training",
  openGraph: {
    title: 'CreateHER Fest',
    description: 'Bridging the gender gap in tech through AI, Blockchain, and AR/VR training',
    url: 'https://createherfest.com',
    siteName: 'CreateHER Fest',
    images: [
      {
        url: '/og-image.jpg', // Add your OG image
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${urbanist.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}