// // components/sections/DomainClaimPage.tsx

// 'use client';

// import { useState } from 'react';
// import DomainSearch from '@/components/domain/DomainSearch';
// import DomainCart from '@/components/domain/DomainCart';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import DomainCheckout from '@/components/domain/DomainCheckout';
// import PageHeader from '@/components/layout/PageHeader';

// export default function DomainClaimPage() {
//   const [activeTab, setActiveTab] = useState('search');
  
//   return (
//     <div className="container mx-auto px-4 py-12">
//       <PageHeader
//         title="Claim Your .her Domain"
//         description="Join the movement of women reclaiming their digital identity in Web3"
//       />

//       <div className="max-w-5xl mx-auto mt-8">
//         <Tabs defaultValue="search" value={activeTab} onValueChange={setActiveTab}>
//           <TabsList className="grid w-full grid-cols-3">
//             <TabsTrigger value="search">Search</TabsTrigger>
//             <TabsTrigger value="cart">Cart</TabsTrigger>
//             <TabsTrigger value="checkout" disabled={activeTab !== 'checkout'}>Checkout</TabsTrigger>
//           </TabsList>
          
//           <TabsContent value="search">
//             <DomainSearch onAddToCart={() => {}} />
//           </TabsContent>
          
//           <TabsContent value="cart">
//             <DomainCart onProceedToCheckout={() => setActiveTab('checkout')} />
//           </TabsContent>
          
//           <TabsContent value="checkout">
//             <DomainCheckout onSuccess={() => {}} />
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// }