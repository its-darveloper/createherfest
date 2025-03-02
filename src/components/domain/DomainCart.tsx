// // components/domain/DomainCart.tsx

// 'use client';

// import { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { useToast } from '@/hooks/use-toast';
// import { Loader2, Trash2, ShoppingCart } from 'lucide-react';
// import { useCart } from '@/hooks/useCart';
// import { useAuth } from '@/hooks/useAuth';
// import Link from 'next/link';

// export default function DomainCart({ onProceedToCheckout }: { onProceedToCheckout: () => void }) {
//   const { items, removeItem, clearCart, total } = useCart();
//   const { user, login } = useAuth();
//   const { toast } = useToast();
//   const [isChecking, setIsChecking] = useState(false);
  
//   // Format price from cents to dollars
//   const formatPrice = (cents: number) => {
//     return `$${(cents / 100).toFixed(2)}`;
//   };
  
//   // Check domain availability periodically
//   useEffect(() => {
//     const checkAvailability = async () => {
//       // In a real implementation, we would check availability with the API
//       // For now, we'll just simulate it
//       setIsChecking(true);
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       setIsChecking(false);
//     };
    
//     if (items.length > 0) {
//       checkAvailability();
      
//       // Set up interval to check every minute
//       const interval = setInterval(checkAvailability, 60000);
//       return () => clearInterval(interval);
//     }
//   }, [items]);
  
//   const handleRemoveItem = (domainName: string) => {
//     removeItem(domainName);
//     toast({
//       title: "Removed from cart",
//       description: `${domainName} has been removed from your cart`,
//       duration: 3000
//     });
//   };
  
//   const handleClearCart = () => {
//     clearCart();
//     toast({
//       title: "Cart cleared",
//       description: "All domains have been removed from your cart",
//       duration: 3000
//     });
//   };
  
//   const handleProceedToCheckout = () => {
//     if (!user) {
//       toast({
//         title: "Authentication required",
//         description: "Please connect your wallet to proceed to checkout",
//         variant: "destructive",
//         duration: 5000
//       });
//       return;
//     }
    
//     onProceedToCheckout();
//   };

//   return (
//     <div className="bg-white rounded-lg p-6 shadow-sm">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-[#150e60]">Your Domain Cart</h2>
//         {items.length > 0 && (
//           <Button 
//             variant="outline" 
//             className="border-red-500 text-red-500 hover:bg-red-50" 
//             onClick={handleClearCart}
//           >
//             <Trash2 className="h-4 w-4 mr-2" />
//             Clear Cart
//           </Button>
//         )}
//       </div>
      
//       {items.length === 0 ? (
//         <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
//           <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-3" />
//           <p className="text-gray-500 mb-4">Your cart is empty</p>
//           <Link href="/claim">
//             <Button className="bg-[#473dc6] hover:bg-[#150e60]">
//               Search for Domains
//             </Button>
//           </Link>
//         </div>
//       ) : (
//         <>
//           <div className="space-y-4 mb-8">
//             {items.map((item) => (
//               <div 
//                 key={item.suggestion.name} 
//                 className="flex justify-between items-center p-4 border border-[#cfe6ff] rounded-lg"
//               >
//                 <div>
//                   <p className="font-semibold text-lg text-[#150e60]">{item.suggestion.name}</p>
//                   <p className="text-[#2b2b2b]">{formatPrice(item.suggestion.price?.listPrice?.usdCents || 0)}</p>
//                 </div>
//                 <div className="flex items-center gap-4">
//                   {isChecking ? (
//                     <Loader2 className="h-5 w-5 animate-spin text-[#473dc6]" />
//                   ) : item.available ? (
//                     <span className="text-green-600 text-sm">Available</span>
//                   ) : (
//                     <span className="text-red-500 text-sm">Unavailable</span>
//                   )}
//                   <Button 
//                     variant="ghost" 
//                     className="text-red-500 hover:bg-red-50 hover:text-red-600"
//                     onClick={() => handleRemoveItem(item.suggestion.name)}
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>
          
//           <div className="border-t border-gray-200 pt-4 mb-6">
//             <div className="flex justify-between items-center text-lg font-semibold">
//               <span>Total</span>
//               <span className="text-[#150e60]">{formatPrice(total)}</span>
//             </div>
//           </div>
          
//           <div className="flex flex-col space-y-4">
//             <Button 
//               className="bg-[#473dc6] hover:bg-[#150e60] py-6 text-lg"
//               onClick={handleProceedToCheckout}
//             >
//               Proceed to Checkout
//             </Button>
            
//             {!user && (
//               <Button 
//                 variant="outline" 
//                 className="border-[#473dc6] text-[#473dc6] hover:bg-[#f1eae7]"
//                 onClick={login}
//               >
//                 Connect Wallet to Continue
//               </Button>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }