// // app/components/DomainSearch.tsx

// 'use client';

// import { useState } from 'react';
// import { fetchDomainSuggestions, DomainSuggestion } from '@/app/api/unstoppableDomains';
// import { useCart } from '@/app/context/CartContext';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Loader2 } from 'lucide-react';

// export default function DomainSearch({ onAddToCart }: { onAddToCart: () => void }) {
//   const [query, setQuery] = useState('');
//   const [domains, setDomains] = useState<DomainSuggestion[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const { items, addItem, removeItem } = useCart();
  
//   const domainsPerPage = 5;
  
//   const handleSearch = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     // Validate domain format
//     const isValidLength = query.length >= 1 && query.length <= 24;
//     const hasValidChars = Array.from(query).every(char => /[a-zA-Z0-9-]/.test(char));
//     const startsWithHyphen = query.startsWith('-');
//     const endsWithHyphen = query.endsWith('-');
    
//     if (!isValidLength || !hasValidChars || startsWithHyphen || endsWithHyphen) {
//       setError('Domain name must be 1-24 characters, contain only letters, numbers, and hyphens, and cannot start or end with a hyphen.');
//       setDomains([]);
//       return;
//     }
    
//     setIsLoading(true);
//     setError('');
    
//     try {
//       const response = await fetchDomainSuggestions(query);
      
//       if (response.error) {
//         setError(response.error.message);
//         setDomains([]);
//       } else {
//         setDomains(response.items);
//         setCurrentPage(1);
//       }
//     } catch (err) {
//       setError('An error occurred while fetching domains. Please try again.');
//       setDomains([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   // Calculate pagination
//   const indexOfLastDomain = currentPage * domainsPerPage;
//   const indexOfFirstDomain = indexOfLastDomain - domainsPerPage;
//   const currentDomains = domains.slice(indexOfFirstDomain, indexOfLastDomain);
  
//   // Format price from cents to dollars
//   const formatPrice = (cents: number) => {
//     return `$${(cents / 100).toFixed(2)}`;
//   };

//   const handleAddToCart = (domain: DomainSuggestion) => {
//     addItem(domain);
//     onAddToCart(); // Call the passed prop function
//   };
  
//   return (
//     <div className="w-full max-w-3xl mx-auto p-6">
//       <form onSubmit={handleSearch} className="mb-8">
//         <div className="flex gap-2">
//           <div className="relative flex-grow">
//             <Input
//               type="search"
//               placeholder="Search for your .her domain"
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               className="w-full pl-4 pr-12 py-2 text-lg"
//             />
//           </div>
//           <Button 
//             type="submit" 
//             variant="default" 
//             className="bg-[#473dc6] hover:bg-[#150e60]"
//             disabled={isLoading}
//           >
//             {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
//             Search
//           </Button>
//         </div>
//         {error && (
//           <p className="text-red-500 mt-2">{error}</p>
//         )}
//         <p className="text-gray-500 text-sm mt-2">
//           Domain must be 1-24 characters, contain only letters, numbers, and hyphens.
//         </p>
//       </form>
      
//       {isLoading ? (
//         <div className="flex justify-center py-12">
//           <Loader2 className="h-8 w-8 animate-spin text-[#473dc6]" />
//         </div>
//       ) : domains.length > 0 ? (
//         <div className="space-y-4">
//           {currentDomains.map((domain) => (
//             <div 
//               key={domain.name} 
//               className="flex justify-between items-center p-4 border rounded-lg hover:shadow-md"
//             >
//               <div>
//                 <p className="font-semibold text-xl">{domain.name}</p>
//                 <p className="text-gray-600">{formatPrice(domain.price?.listPrice?.usdCents || 0)}</p>
//               </div>
//               {items.some(item => item.suggestion.name === domain.name) ? (
//                 <Button 
//                   onClick={() => removeItem(domain.name)}
//                   variant="destructive"
//                 >
//                   Remove
//                 </Button>
//               ) : (
//                 <Button 
//                   onClick={() => handleAddToCart(domain)}
//                   className="bg-[#473dc6] hover:bg-[#150e60]"
//                 >
//                   Add to Cart
//                 </Button>
//               )}
//             </div>
//           ))}
          
//           {/* Pagination */}
//           {domains.length > domainsPerPage && (
//             <div className="flex justify-center mt-6">
//               {Array.from({ length: Math.ceil(domains.length / domainsPerPage) }).map((_, index) => (
//                 <Button
//                   key={index}
//                   variant={currentPage === index + 1 ? "default" : "outline"}
//                   className={`mx-1 ${currentPage === index + 1 ? 'bg-[#473dc6]' : ''}`}
//                   onClick={() => setCurrentPage(index + 1)}
//                 >
//                   {index + 1}
//                 </Button>
//               ))}
//             </div>
//           )}
//         </div>
//       ) : (
//         <div className="text-center py-12">
//           <p className="text-gray-500">Search for a domain to see results</p>
//         </div>
//       )}
//     </div>
//   );
// }