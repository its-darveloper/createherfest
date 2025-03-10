// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Urbanist } from "next/font/google";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Providers from "./providers";
import AuthDebug from '@/components/debug/AuthDebug';
import Script from "next/script";

import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
});

const urbanist = Urbanist({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
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
        url: 'https://createherfest.notion.site/image/attachment%3A1ec11d90-0dd2-4137-ba6b-32b0ddd0d949%3ACreateHER_Fest_Email_Header_(2).png?table=block&id=1a21ac87-fe57-802a-b6a5-ea59b263ebfe&spaceId=0c5e5dd0-9df7-4a03-acd6-a76b92f612c6&width=1420&userId=&cache=v2',
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
      <head>
        {/* Flodesk Universal Script - This goes in the head section */}
        <Script
          id="flodesk-universal"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w, d, t, h, s, n) {
                w.FlodeskObject = n;
                var fn = function() {
                  (w[n].q = w[n].q || []).push(arguments);
                };
                w[n] = w[n] || fn;
                var f = d.getElementsByTagName(t)[0];
                var v = '?v=' + Math.floor(new Date().getTime() / (120 * 1000)) * 60;
                var sm = d.createElement(t);
                sm.async = true;
                sm.type = 'module';
                sm.src = h + s + '.mjs' + v;
                f.parentNode.insertBefore(sm, f);
                var sn = d.createElement(t);
                sn.async = true;
                sn.noModule = true;
                sn.src = h + s + '.js' + v;
                f.parentNode.insertBefore(sn, f);
              })(window, document, 'script', 'https://assets.flodesk.com', '/universal', 'fd');
            `
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <AuthProvider>
            <CartProvider>
              <Navigation />
              {children}
              <Footer />
              {process.env.NODE_ENV === 'development' && <AuthDebug />}
            </CartProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}