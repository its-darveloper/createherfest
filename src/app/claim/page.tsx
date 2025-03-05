// app/claim/page.tsx
import DomainClaimPage from '@/components/sections/DomainClaimPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Introducing .HER | CreateHER Fest',
  description: 'Secure your .her domain name with CreateHER Fest - empowering women in technology with their own web3 identity.',
  keywords: 'web3 domain, blockchain domain, NFT domain, .her domain, CreateHER Fest, women in tech, digital identity, domain name, crypto domain',
  openGraph: {
    title: 'Claim Your .her Domain | CreateHER Fest',
    description: 'Secure your .her domain name with CreateHER Fest - empowering women in technology with their own web3 identity.',
    url: 'https://createherfest.com/claim',
    siteName: 'CreateHER Fest',
    images: [
      {
        url: 'https://createherfest.com/og-image-domain.jpg',
        width: 1200,
        height: 630
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Claim Your .her Domain | CreateHER Fest',
    description: 'Secure your .her domain name with CreateHER Fest - empowering women in technology with their own web3 identity.',
    images: ['https://createherfest.com/og-image-domain.jpg'],
  }
};

export default function ClaimPage() {
  return <DomainClaimPage />;
}