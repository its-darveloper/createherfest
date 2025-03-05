// components/domain/DomainSearch.tsx

'use client';

import { useState } from 'react';
import { fetchDomainSuggestions, DomainSuggestion } from '@/app/api/unstoppableDomains';
import { useCart } from '@/app/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, X, Search, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

export default function DomainSearch({ onAddToCart }: { onAddToCart: () => void }) {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { items, addItem, removeItem } = useCart();
  
  const domainsPerPage = 5;
  
  // React Query for fetching domain suggestions
  const { 
    data: domainsResponse, 
    isLoading, 
    error: queryError 
  } = useQuery({
    queryKey: ['domainSuggestions', submittedQuery],
    queryFn: () => fetchDomainSuggestions(submittedQuery),
    enabled: !!submittedQuery,
    staleTime: 60000, // Cache results for 1 minute
  });
  
  const domains = domainsResponse?.items || [];
  const error = queryError ? 'An error occurred while fetching domains.' : domainsResponse?.error?.message || '';
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      return;
    }
    
    // Validate domain format
    const isValidLength = query.length >= 1 && query.length <= 24;
    const hasValidChars = Array.from(query).every(char => /[a-zA-Z0-9-]/.test(char));
    const startsWithHyphen = query.startsWith('-');
    const endsWithHyphen = query.endsWith('-');
    
    if (!isValidLength || !hasValidChars || startsWithHyphen || endsWithHyphen) {
      return;
    }
    
    setCurrentPage(1);
    setSubmittedQuery(query);
  };
  
  // Calculate pagination
  const indexOfLastDomain = currentPage * domainsPerPage;
  const indexOfFirstDomain = indexOfLastDomain - domainsPerPage;
  const currentDomains = domains.slice(indexOfFirstDomain, indexOfLastDomain);
  
  // Format price from cents to dollars
  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const handleAddToCart = (domain: DomainSuggestion) => {
    console.log('Add to cart clicked for domain:', domain);
    addItem(domain);
    // If you have an onAddToCart prop, call it here
    if (typeof onAddToCart === 'function') {
      onAddToCart();
    }
  };

  // Input validation feedback
  const validateInput = () => {
    if (!query.trim()) {
      return "Please enter a domain name to search";
    }
    
    const isValidLength = query.length >= 1 && query.length <= 24;
    const hasValidChars = Array.from(query).every(char => /[a-zA-Z0-9-]/.test(char));
    const startsWithHyphen = query.startsWith('-');
    const endsWithHyphen = query.endsWith('-');
    
    if (!isValidLength || !hasValidChars || startsWithHyphen || endsWithHyphen) {
      return 'Domain name must be 1-24 characters, contain only letters, numbers, and hyphens, and cannot start or end with a hyphen.';
    }
    
    return '';
  };
  
  const inputError = validateInput();
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Domain search form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="shimmer-container bg-[#150e60] rounded-xl border border-[#473dc6]/40 p-4 shadow-glow">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <label htmlFor="domain-search" className="sr-only">Search for a domain name</label>
              <Input
                id="domain-search"
                type="search"
                placeholder="Search for your domain"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-5 pr-16 py-5 text-lg bg-[#1b1653] font-urbanist text-white border-[#473dc6]/50 rounded-lg placeholder-white/60 focus:border-[#caa3d6] focus:ring-[#473dc6]"
                aria-label="Domain name search"
                aria-describedby="domain-search-info"
                aria-invalid={!!inputError}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#cfe6ff] font-urbanist font-semibold">
                .her
              </div>
            </div>
            <Button 
              type="submit" 
              variant="default" 
              className="btn-shimmer bg-[#473dc6] hover:bg-[#5c51e6] hover:shadow-glow-hover text-white py-5 px-8 rounded-lg sm:w-auto w-full shadow-glow transition-all duration-300"
              disabled={isLoading || !!inputError}
              aria-label="Search for domains"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
              ) : (
                <Search className="mr-2 h-5 w-5" aria-hidden="true" />
              )}
              <span className="font-urbanist font-semibold">Search</span>
            </Button>
          </div>
        </div>
        
        <div className="mt-3 flex items-start px-1">
          <button
            type="button"
            onClick={() => setIsInfoVisible(!isInfoVisible)}
            className="text-[#cfe6ff] hover:text-white mr-2 flex items-center text-sm font-inter transition-colors duration-200"
            aria-expanded={isInfoVisible}
            aria-controls="domain-info"
            id="domain-search-info"
          >
            <Info className="h-4 w-4 mr-1" aria-hidden="true" />
            <span>Domain rules</span>
          </button>
          
          {(inputError || error) && (
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[#f87171] text-sm font-inter flex-grow"
              role="alert"
              aria-live="assertive"
            >
              {inputError || error}
            </motion.p>
          )}
        </div>
        
        <AnimatePresence>
          {isInfoVisible && (
            <motion.div
              id="domain-info"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-2 p-4 bg-[#150e60] rounded-lg border border-[#473dc6]/30 text-white/80 text-sm font-inter">
                <h3 className="font-urbanist font-semibold mb-2 text-white">Domain Name Rules:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Must be 1-24 characters in length</li>
                  <li>Can only contain letters, numbers, and hyphens</li>
                  <li>Cannot start or end with a hyphen</li>
                  <li>No special characters or spaces allowed</li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
      
      {/* Domain results section */}
      <div className="relative" aria-live="polite">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 bg-[#150e60]/50 rounded-xl border border-[#473dc6]/30">
            <Loader2 className="h-10 w-10 animate-spin text-[#caa3d6]" aria-hidden="true" />
            <p className="mt-4 text-white/70 font-inter">Searching for domains...</p>
          </div>
        ) : domains.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
            aria-label={`${domains.length} domains found for ${submittedQuery}`}
          >
            {currentDomains.map((domain, index) => (
              <motion.div 
                key={domain.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="shimmer-container group"
              >
                <div className="flex flex-col sm:flex-row justify-between items-center p-5 bg-[#150e60] rounded-xl border border-[#473dc6]/40 group-hover:border-[#caa3d6]/70 transition-all duration-300 shadow-glow group-hover:shadow-glow-hover">
                  <div className="mb-4 sm:mb-0 text-center sm:text-left">
                    <p className="font-urbanist font-semibold text-xl text-white">{domain.name}</p>
                    <p className="text-[#cfe6ff] font-inter">{formatPrice(domain.price?.listPrice?.usdCents || 0)}</p>
                  </div>
                  
                  {items.some(item => item.suggestion.name === domain.name) ? (
                    <Button 
                      onClick={() => removeItem(domain.name)}
                      variant="destructive"
                      className="bg-red-500/80 hover:bg-red-600 text-white rounded-lg px-4 py-2 transition-all duration-300 font-urbanist w-full sm:w-auto"
                      aria-label={`Remove ${domain.name} from cart`}
                    >
                      <X className="mr-2 h-4 w-4" aria-hidden="true" />
                      Remove
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleAddToCart(domain)}
                      className="btn-shimmer bg-[#473dc6] hover:bg-[#5c51e6] text-white rounded-lg px-4 py-2 transition-all duration-300 hover:shadow-glow-hover shadow-glow font-urbanist w-full sm:w-auto"
                      aria-label={`Add ${domain.name} to cart for ${formatPrice(domain.price?.listPrice?.usdCents || 0)}`}
                    >
                      <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                      Add to Cart
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
            
            {/* Pagination */}
            {domains.length > domainsPerPage && (
              <nav className="flex justify-center mt-8" aria-label="Pagination">
                <div className="bg-[#150e60] p-1 rounded-lg border border-[#473dc6]/30 inline-flex">
                  {Array.from({ length: Math.ceil(domains.length / domainsPerPage) }).map((_, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      aria-label={`Page ${index + 1}`}
                      aria-current={currentPage === index + 1 ? "page" : undefined}
                      className={`mx-1 ${
                        currentPage === index + 1 
                          ? 'bg-[#473dc6] text-white' 
                          : 'bg-transparent text-white/70 hover:bg-[#473dc6]/20'
                      } transition-all duration-200 w-10 h-10 rounded-md font-urbanist`}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
              </nav>
            )}
          </motion.div>
        ) : submittedQuery ? (
          <div className="text-center py-12 bg-[#150e60] rounded-lg border border-[#473dc6]/30">
            <p className="text-white/70 font-inter">No domains found matching "{submittedQuery}"</p>
            <p className="text-white/50 text-sm mt-2 font-inter">Try a different search term</p>
          </div>
        ) : (
          <div className="text-center py-16 bg-[#150e60] rounded-lg border border-[#473dc6]/30 shimmer-container">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#473dc6]/20 flex items-center justify-center">
              <Search className="h-10 w-10 text-[#cfe6ff]" aria-hidden="true" />
            </div>
            <h2 className="text-white text-lg font-urbanist">Search for your perfect .her domain</h2>
            <p className="text-white/60 mt-2 max-w-md mx-auto font-inter">Enter a name above to find your unique digital identity in the Web3 space</p>
          </div>
        )}
      </div>
    </div>
  );
}