// app/domains/status/page.tsx
'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Loader2, CheckCircle, AlertCircle, Clock, RefreshCw, ArrowRight, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';

type DomainOperation = {
  name: string;
  operationId: string;
  status: string;
  lastUpdated: string;
  walletAddress?: string;
  needsTransfer?: boolean;
  refundStatus?: string;
};

export default function DomainStatusPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [domains, setDomains] = useState<DomainOperation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [retryingDomain, setRetryingDomain] = useState<string | null>(null);
  const [processingRefund, setProcessingRefund] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [lastFetch, setLastFetch] = useState(0); // Add a timestamp for last fetch
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  
  // Add a ref to store the user wallet address to avoid dependency issues
  const walletAddressRef = useRef<string | undefined>(user?.wallet_address);
  
  // Update ref when user changes
  useEffect(() => {
    walletAddressRef.current = user?.wallet_address;
  }, [user?.wallet_address]);
  
  // Handle failed mint and process refund
  const handleFailedMint = useCallback(async (domain: DomainOperation) => {
    try {
      console.log(`Handling failed mint for ${domain.name}`);
      setProcessingRefund(domain.name);
      
      // Get payment intent ID from local storage or your database
      const paymentData = JSON.parse(localStorage.getItem('DOMAIN_PAYMENTS') || '{}');
      const paymentIntentId = paymentData[domain.name];
      
      const response = await axios.post('/api/handle-failed-mint', {
        domainName: domain.name,
        operationId: domain.operationId,
        paymentIntentId: paymentIntentId
      });
      
      if (response.data.success) {
        console.log(`Successfully handled failed mint for ${domain.name}`);
        
        // Update domain in local state to show handled status
        setDomains(prevDomains => 
          prevDomains.map(d => {
            if (d.name === domain.name) {
              return {
                ...d,
                status: 'FAILED_HANDLED',
                refundStatus: response.data.refund?.status || 'unknown'
              };
            }
            return d;
          })
        );
        
        // Update server-side storage too
        await axios.post('/api/store-operation', {
          domain: domain.name,
          operationId: domain.operationId,
          status: 'FAILED_HANDLED',
          walletAddress: domain.walletAddress,
          needsTransfer: false,
          refundStatus: response.data.refund?.status || 'unknown'
        });
        
        // Remove payment record from local storage
        if (paymentIntentId) {
          delete paymentData[domain.name];
          localStorage.setItem('DOMAIN_PAYMENTS', JSON.stringify(paymentData));
        }
        
        // Show a success message to the user
        const refundMessage = response.data.refund?.success ? 
          " and your payment has been refunded." : 
          " and a refund has been initiated.";
        
        setSuccessMessage(`Domain ${domain.name} registration failed${refundMessage}`);
      } else {
        console.error(`Failed to handle failed mint for ${domain.name}:`, response.data);
        setError(`Failed to handle refund for ${domain.name}. Please contact support.`);
      }
    } catch (err) {
      console.error(`Error handling failed mint for ${domain.name}:`, err);
      setError(`Error processing refund for ${domain.name}. Please try again later.`);
    } finally {
      setProcessingRefund(null);
    }
  }, []);
  
  // Use useCallback to memoize the fetchDomains function
  const fetchDomains = useCallback(async () => {
    // Skip if we fetched recently (debounce)
    const now = Date.now();
    if (now - lastFetch < 5000) { // Skip if less than 5 seconds since last fetch
      console.log("Skipping fetch - too soon");
      return;
    }
    
    // Skip if no wallet address
    if (!walletAddressRef.current) {
      console.log("Skipping fetch - no wallet address");
      return;
    }
    
    try {
      console.log("Fetching domains...");
      setRefreshing(true);
      setLastFetch(now);
      
      // Get operations from server API
      const response = await axios.get(`/api/store-operation?wallet=${walletAddressRef.current}`);
      
      if (response.data.operations) {
        setDomains(response.data.operations);
        console.log(`Found ${response.data.operations.length} domains`);
        
        // Check statuses of operations
        const operationIds = response.data.operations
          .filter((d: DomainOperation) => d.operationId && d.status !== 'FAILED_HANDLED')
          .map((d: DomainOperation) => d.operationId);
          
        if (operationIds.length > 0) {
          console.log(`Checking status for ${operationIds.length} operations`);
          const statusResponse = await axios.post('/api/domain-status', {
            operationIds
          });
          
          // Update operation statuses
          if (statusResponse.data.results) {
            const updatedDomains = response.data.operations.map((domain: DomainOperation) => {
              // Don't update domains that are already marked as FAILED_HANDLED
              if (domain.status === 'FAILED_HANDLED') {
                return domain;
              }
              
              const opResult = statusResponse.data.results.find(
                (r: any) => r.operationId === domain.operationId
              );
              
              if (opResult) {
                // Only update if status has changed
                if (domain.status !== opResult.status) {
                  // Update operation on server
                  axios.post('/api/store-operation', {
                    domain: domain.name,
                    operationId: domain.operationId,
                    status: opResult.status,
                    walletAddress: domain.walletAddress,
                    needsTransfer: domain.needsTransfer,
                    refundStatus: domain.refundStatus
                  });
                }
                
                return {
                  ...domain,
                  status: opResult.status,
                  lastUpdated: new Date().toISOString()
                };
              }
              
              return domain;
            });
            
            setDomains(updatedDomains);
            
            // Check for failed operations that haven't been handled
            const failedDomains = updatedDomains.filter(
              domain => domain.status === 'FAILED' && domain.status !== 'FAILED_HANDLED'
            );
            
            if (failedDomains.length > 0) {
              console.log(`Found ${failedDomains.length} failed domain registrations to handle`);
              // Process each failed domain
              for (const domain of failedDomains) {
                await handleFailedMint(domain);
              }
            }
            
            // Check for domains needing transfer
            const domainsNeedingTransfer = updatedDomains.filter(
              domain => domain.status === 'COMPLETED' && domain.needsTransfer
            );
            
            if (domainsNeedingTransfer.length > 0) {
              console.log(`Found ${domainsNeedingTransfer.length} domains needing transfer`);
              // Process domains needing transfer (one at a time to avoid race conditions)
              for (const domain of domainsNeedingTransfer) {
                await processTransfer(domain);
              }
            }
          }
        }
      }
    } catch (err) {
      console.error('Error fetching domain status:', err);
      setError('Failed to load domain status. Please refresh the page.');
    } finally {
      setRefreshing(false);
    }
  }, [lastFetch, handleFailedMint]); // Only depend on lastFetch and handleFailedMint
  
  // Helper function to process transfers
  const processTransfer = useCallback(async (domain: DomainOperation) => {
    if (!walletAddressRef.current) return;
    
    try {
      console.log(`Attempting to transfer ${domain.name} to ${walletAddressRef.current}`);
      
      const transferResponse = await axios.post('/api/domain-transfer', {
        domainName: domain.name,
        operationId: domain.operationId,
        walletAddress: walletAddressRef.current
      });
      
      if (transferResponse.data.success) {
        console.log(`Transfer initiated for ${domain.name}:`, transferResponse.data);
        
        // Update domain transfer status on server
        await axios.post('/api/store-operation', {
          domain: domain.name,
          operationId: transferResponse.data.operation.id,
          status: 'PENDING',
          walletAddress: walletAddressRef.current,
          needsTransfer: false
        });
        
        // Update local state too
        setDomains(prevDomains => 
          prevDomains.map(d => {
            if (d.name === domain.name) {
              return {
                ...d,
                operationId: transferResponse.data.operation.id,
                status: 'PENDING',
                lastUpdated: new Date().toISOString(),
                needsTransfer: false
              };
            }
            return d;
          })
        );
      } else {
        console.log(`Transfer could not be initiated for ${domain.name}:`, transferResponse.data);
        // If we get a 400, it might be that the domain registration is still processing
        if (transferResponse.data.status === 400 || 
            transferResponse.data.message?.includes("not complete yet")) {
          // Keep needsTransfer flag true to try again later
          console.log(`Will retry transfer later for ${domain.name}`);
        }
      }
    } catch (transferError: any) {
      console.error(`Error transferring domain ${domain.name}:`, transferError);
      
      // Check if it's a status error
      if (transferError.response?.data?.details?.includes("still processing")) {
        console.log(`Domain registration still processing, will retry later for ${domain.name}`);
        // No need to update status, keep needsTransfer true to retry later
      }
    }
  }, []);
  
  // Initial fetch
  useEffect(() => {
    let isMounted = true;
    
    // Only do initial fetch once
    if (!initialFetchDone && walletAddressRef.current) {
      const doInitialFetch = async () => {
        if (!isMounted) return;
        setLoading(true);
        await fetchDomains();
        setLoading(false);
        setInitialFetchDone(true);
      };
      
      doInitialFetch();
    }
    
    return () => {
      isMounted = false;
    };
  }, [initialFetchDone, fetchDomains]);
  
  // Separate polling effect
  useEffect(() => {
    if (!initialFetchDone) return;
    
    console.log("Setting up polling interval");
    const interval = setInterval(() => {
      fetchDomains();
    }, 30000); // Check every 30 seconds
    
    return () => {
      console.log("Clearing polling interval");
      clearInterval(interval);
    };
  }, [initialFetchDone, fetchDomains]);
  
  // Update wallet address ref when user changes
  useEffect(() => {
    if (user?.wallet_address !== walletAddressRef.current) {
      console.log("Wallet address changed, resetting fetch state");
      walletAddressRef.current = user?.wallet_address;
      setInitialFetchDone(false); // Reset to trigger a new initial fetch
      setLastFetch(0);
    }
  }, [user?.wallet_address]);
  
  // Clear success message after timeout
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);
  
  const handleRefresh = () => {
    setLastFetch(0); // Reset lastFetch to force a refresh
    fetchDomains();
  };
  
  const handleRetryTransfer = async (domain: DomainOperation) => {
    if (!walletAddressRef.current) {
      setError('Wallet address is required to retry transfer');
      return;
    }
    
    setRetryingDomain(domain.name);
    
    try {
      // Check domain ownership first
      const domainCheckResponse = await axios.get(`/api/domain-ownership?domain=${domain.name}`);
      
      if (!domainCheckResponse.data.isOwned) {
        setError(`Domain ${domain.name} is not owned by this account and cannot be transferred.`);
        setRetryingDomain(null);
        return;
      }
      
      // Try to transfer domain
      const response = await axios.post('/api/domain-transfer', {
        domainName: domain.name,
        walletAddress: walletAddressRef.current
      });
      
      if (response.data.success) {
        // Update domain operation
        await axios.post('/api/store-operation', {
          domain: domain.name,
          operationId: response.data.operation.id,
          status: 'PENDING',
          walletAddress: walletAddressRef.current,
          needsTransfer: false
        });
        
        // Update local state
        setDomains(domains.map(d => {
          if (d.name === domain.name) {
            return {
              ...d,
              operationId: response.data.operation.id,
              status: 'PENDING',
              lastUpdated: new Date().toISOString(),
              needsTransfer: false
            };
          }
          return d;
        }));
        
        setSuccessMessage(`Transfer retry initiated for ${domain.name}`);
      } else {
        setError(`Failed to retry transfer for ${domain.name}: ${response.data.error}`);
      }
    } catch (error: any) {
      console.error('Error retrying transfer:', error);
      setError(`Failed to retry transfer for ${domain.name}`);
    } finally {
      setRetryingDomain(null);
    }
  };
  
  const handleManualRefund = async (domain: DomainOperation) => {
    setProcessingRefund(domain.name);
    
    try {
      await handleFailedMint(domain);
    } finally {
      setProcessingRefund(null);
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'PROCESSING':
      case 'PENDING':
      case 'QUEUED':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'FAILED':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'FAILED_HANDLED':
        return <DollarSign className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string, refundStatus?: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Complete';
      case 'PROCESSING':
        return 'Processing';
      case 'PENDING':
        return 'Pending';
      case 'QUEUED':
        return 'Queued';
      case 'FAILED':
        return 'Failed';
      case 'FAILED_HANDLED':
        return refundStatus === 'succeeded' ? 'Refunded' : 'Refund Pending';
      default:
        return status || 'Unknown';
    }
  };
  
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center py-12">
        <div className="bg-[#150e60] rounded-xl p-6 border border-[#473dc6]/40 shadow-glow">
          <h2 className="text-xl font-semibold mb-4 text-white">Connect Your Wallet to View Domains</h2>
          <p className="text-white/70 mb-6">You need to connect your wallet to view your domains.</p>
          <Button
            onClick={() => router.push('/claim')}
            className="bg-[#473dc6] hover:bg-[#5c51e6] text-white py-2 px-4 rounded"
          >
            Go to Domain Search
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-[#150e60] rounded-xl p-6 border border-[#473dc6]/40 shadow-glow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Your Domains</h1>
          
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-[#1b1653] hover:bg-[#242060] text-white py-2 px-3 rounded-lg flex items-center gap-2"
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/40 px-4 py-3 rounded mb-4">
            <p className="text-red-400">{error}</p>
            <Button
              onClick={() => setError('')}
              className="text-red-400 hover:text-red-300 text-xs mt-2 underline"
            >
              Dismiss
            </Button>
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-500/20 border border-green-500/40 px-4 py-3 rounded mb-4">
            <p className="text-green-400">{successMessage}</p>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#473dc6]" />
            <p className="ml-2 text-white/70">Loading your domains...</p>
          </div>
        ) : domains.length === 0 ? (
          <div className="text-center py-8 bg-[#1b1653] rounded-lg">
            <p className="text-white/70 mb-4">You don't have any domains yet.</p>
            <Button
              onClick={() => router.push('/claim')}
              className="bg-[#473dc6] hover:bg-[#5c51e6] text-white py-2 px-4 rounded"
            >
              Search Domains
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {domains.map((domain, index) => (
              <motion.div 
                key={domain.name} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border border-[#473dc6]/30 bg-[#1b1653] rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div>
                  <p className="font-semibold text-white">{domain.name}</p>
                  <p className="text-sm text-white/60">
                    {domain.lastUpdated 
                      ? `Last updated: ${new Date(domain.lastUpdated).toLocaleString()}`
                      : 'Status update pending'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-[#150e60] px-3 py-1 rounded-full">
                    {getStatusIcon(domain.status)}
                    <span className="ml-2 text-sm font-medium text-white/80">
                      {getStatusText(domain.status, domain.refundStatus)}
                    </span>
                  </div>
                  
                  {/* Add retry button for domains needing transfer */}
                  {(domain.status === 'COMPLETED' && domain.needsTransfer) && (
                    <Button
                      onClick={() => handleRetryTransfer(domain)}
                      disabled={retryingDomain === domain.name}
                      className="text-xs bg-[#473dc6] hover:bg-[#5c51e6] text-white py-1 px-2 rounded flex items-center gap-1"
                    >
                      {retryingDomain === domain.name ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <ArrowRight className="h-3 w-3" />
                      )}
                      Transfer
                    </Button>
                  )}
                  
                  {/* Add refund button for failed domains */}
                  {domain.status === 'FAILED' && (
                    <Button
                      onClick={() => handleManualRefund(domain)}
                      disabled={processingRefund === domain.name}
                      className="text-xs bg-[#473dc6] hover:bg-[#5c51e6] text-white py-1 px-2 rounded flex items-center gap-1"
                    >
                      {processingRefund === domain.name ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <DollarSign className="h-3 w-3" />
                      )}
                      Process Refund
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Link href="/claim" className="text-[#caa3d6] hover:text-[#d9bee2] text-sm">
            Search for more domains
          </Link>
        </div>
      </div>
    </div>
  );
}