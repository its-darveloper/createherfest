// // app/claim/page.tsx
// import DomainClaimPage from '@/components/sections/DomainClaimPage';
// import { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'Introducing .HER | CreateHER Fest',
//   description: 'Secure your .her domain name with CreateHER Fest - empowering women in technology with their own web3 identity.',
//   keywords: 'web3 domain, blockchain domain, NFT domain, .her domain, CreateHER Fest, women in tech, digital identity, domain name, crypto domain',
//   openGraph: {
//     title: 'Claim Your .her Domain | CreateHER Fest',
//     description: 'Secure your .her domain name with CreateHER Fest - empowering women in technology with their own web3 identity.',
//     url: 'https://createherfest.com/claim',
//     siteName: 'CreateHER Fest',
//     images: [
//       {
//         url: 'https://createherfest.com/og-image-domain.jpg',
//         width: 1200,
//         height: 630
//       }
//     ],
//     type: 'website',
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: 'Claim Your .her Domain | CreateHER Fest',
//     description: 'Secure your .her domain name with CreateHER Fest - empowering women in technology with their own web3 identity.',
//     images: ['https://createherfest.com/og-image-domain.jpg'],
//   }
// };

// export default function ClaimPage() {
//   return <DomainClaimPage />;
// }

// src/app/claim/page.tsx
import { redirect } from 'next/navigation';

export default function ClaimPage() {
  // Redirect to Unstoppable Domains
  redirect('https://links.unstoppabledomains.com/e/c/eyJlbWFpbF9pZCI6ImRnU1dqUVVEQU9XYWt3SGptcE1CQVpWczFQdktIRWVHQUlMcEJkRzFLUT09IiwiaHJlZiI6Imh0dHBzOi8vdW5zdG9wcGFibGV3ZWIuY28vM1h0VllVNyIsImludGVybmFsIjoiOTY4ZDA1NTBlMzVjZTU5YTkzMDEiLCJsaW5rX2lkIjoyNjQwNX0/d1b2cff2e6009cc9a88f7bfadc66acf6ffb6cbfe632aeffb9f9704ec75ba57e8');
  
  // This will never be rendered
  return null;
}