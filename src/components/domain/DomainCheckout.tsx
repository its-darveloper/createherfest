// // components/domain/DomainCheckout.tsx

// 'use client';

// import { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { useToast } from '@/hooks/use-toast';
// import { Loader2, Check, Clock } from 'lucide-react';
// import { useCart } from '@/hooks/useCart';
// import { useAuth } from '@/hooks/useAuth';
// import { useRouter } from 'next/navigation';

// export default function DomainCheckout({ onSuccess }: { onSuccess: () => void }) {
//   const { items, total, clearCart } = useCart();
//   const { user } = useAuth();
//   const { toast } = useToast();
//   const router = useRouter();
  
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(120); // 2 minute countdown
  
//   // Format price from cents to dollars
//   const formatPrice = (cents: number) => {
//     return `$${(cents / 100).toFixed(2)}`;
//   };
  
//   // Countdown timer
//   useEffect(() => {
//     if (timeLeft > 0 && !isSuccess) {
//       const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
//       return () => clearTimeout(timer);
//     } else if (timeLeft === 0 && !isSuccess) {
//       toast({
//         title: "Checkout expired",
//         description: "Your checkout session has expired. Please try again.",
//         variant: "destructive",
//         duration: 5000
//       });
//       router.push('/claim');
//     }
//   }, [timeLeft, isSuccess, router, toast]);
  
//   // Format the countdown timer
//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
//   };
  
//   const handleCheckout = async () => {
//     if (!user) {
//       toast({
//         title: "Authentication required",
//         description: "Please connect your wallet to proceed to checkout",
//         variant: "destructive",
//         duration: 5000
//       });
//       return;
//     }
    
//     setIsProcessing(true);
    
//     try {
//       // Simulate API call for domain registration
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       setIsSuccess(true);
      
//       toast({
//         title: "Checkout successful!",
//         description: "Your domains have been registered successfully",
//         duration: 5000
//       });
      
//       // Clear cart after successful checkout
//       setTimeout(() => {
//         clearCart();
//         onSuccess();
//       }, 3000);
      
//     } catch (error) {
//       toast({
//         title: "Checkout failed",
//         description: "There was an error processing your order. Please try again.",
//         variant: "destructive",
//         duration: 5000
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg p-6 shadow-sm">
//       <h2 className="text-2xl font-bold mb-6 text-[#150e60]">Complete Your Purchase</h2>
      
//       {isSuccess ? (
//         <div className="text-center py-8">
//           <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <Check className="h-8 w-8 text-green-600" />
//           </div>
//           <h3 className="text-xl font-bold text-[#150e60] mb-2">Purchase Complete!</h3>
//           <p className="text-gray-600 mb-6">
//             Your domains have been registered and will be transferred to your wallet shortly.
//           </p>
//           <Button 
//             className="bg-[#473dc6] hover:bg-[#150e60]"
//             onClick={() => router.push('/claim')}
//           >
//             Return to Domain Search
//           </Button>
//         </div>
//       ) : (
//         <>
//           <div className="mb-8">
//             <div className="flex justify-between items-center p-4 bg-[#f1eae7] rounded-lg mb-4">
//               <div className="flex items-center">
//                 <Clock className="h-5 w-5 mr-2 text-[#150e60]" />
//                 <span>Time remaining to complete checkout:</span>
//               </div>
//               <span className="font-bold">{formatTime(timeLeft)}</span>
//             </div>
            
//             <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
//             <div className="space-y-3 mb-6">
//               {items.map((item) => (
//                 <div 
//                   key={item.suggestion.name} 
//                   className="flex justify-between items-center p-3 border-b border-gray-200"
//                 >
//                   <span className="font-medium">{item.suggestion.name}</span>
//                   <span>{formatPrice(item.suggestion.price?.listPrice?.usdCents || 0)}</span>
//                 </div>
//               ))}
//             </div>
            
//             <div className="flex justify-between items-center text-lg font-semibold">
//               <span>Total</span>
//               <span className="text-[#150e60]">{formatPrice(total)}</span>
//             </div>
//           </div>
          
//           <div className="mb-6">
//             <h3 className="text-xl font-semibold mb-4">Domain Delivery</h3>
//             <div className="p-4 border border-[#cfe6ff] rounded-lg">
//               <p className="font-medium text-[#150e60] mb-1">Wallet Address</p>
//               <p className="text-gray-600 break-all">{user?.wallet_address || 'No wallet connected'}</p>
//             </div>
//           </div>
          
//           <Button 
//             className="w-full bg-[#473dc6] hover:bg-[#150e60] py-6 text-lg"
//             onClick={handleCheckout}
//             disabled={isProcessing || !user}
//           >
//             {isProcessing ? (
//               <>
//                 <Loader2 className="mr-2 h-5 w-5 animate-spin" />
//                 Processing...
//               </>
//             ) : (
//               `Pay ${formatPrice(total)}`
//             )}
//           </Button>
//         </>
//       )}
//     </div>
//   );
// }