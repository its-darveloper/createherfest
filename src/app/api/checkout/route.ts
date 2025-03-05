// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_UD_API_URL || 'https://api.ud-sandbox.com/partner/v3';
const API_KEY = process.env.UD_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domains, walletAddress, payment } = body;

    console.log(`Processing checkout for domains:`, domains.map((d: any) => d.name));
    console.log(`Wallet Address:`, walletAddress);
    console.log(`Payment Status:`, payment ? 'Success' : 'Failed');

    if (!domains || !domains.length || !walletAddress) {
      return NextResponse.json({ 
        error: { message: 'Domains and wallet address are required' } 
      }, { status: 400 });
    }

    // Process domains - first step is to register all domains
    const results = [];
    for (const domain of domains) {
      try {
        console.log(`Processing domain: ${domain.name}`);
        
        // If payment failed, we'll skip registration and just return domains if they exist
        if (!payment) {
          try {
            // Check if domain exists and is registered to us
            const domainCheck = await axios.get(
              `${API_BASE_URL}/domains/${domain.name}`,
              {
                headers: {
                  Authorization: `Bearer ${API_KEY}`
                }
              }
            );
            
            // If we own the domain, return it
            console.log(`Payment failed, returning domain ${domain.name}...`);
            
            const response = await axios.post(
              `${API_BASE_URL}/domains/${domain.name}/return`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${API_KEY}`,
                  'Content-Type': 'application/json'
                }
              }
            );
            
            console.log(`Domain ${domain.name} return initiated:`, response.data);
            
            results.push({
              domain: domain.name,
              success: true,
              message: `Domain ${domain.name} has been returned`,
              operation: response.data
            });
          } catch (error) {
            // If domain doesn't exist, nothing to do
            console.log(`Domain ${domain.name} doesn't exist, nothing to return.`);
            results.push({
              domain: domain.name,
              success: true,
              message: `No action needed for ${domain.name}`
            });
          }
          continue;
        }
        
        // For successful payments, we register domains

        // First check if we have a pending operation already
        if (domain.operationId) {
          console.log(`Domain ${domain.name} has existing operation ${domain.operationId}, checking status...`);
          
          try {
            const opStatus = await axios.get(
              `${API_BASE_URL}/operations/${domain.operationId}`,
              {
                headers: {
                  Authorization: `Bearer ${API_KEY}`
                }
              }
            );
            
            console.log(`Operation ${domain.operationId} status:`, opStatus.data.status);
            
            // Store the operation data
            await axios.post(`${BASE_URL}/api/store-operation`, {
              domain: domain.name,
              operationId: domain.operationId,
              status: opStatus.data.status,
              walletAddress: walletAddress,
              needsTransfer: opStatus.data.status === 'COMPLETED'
            });
            
            // If operation is complete, we can proceed to transfer
            if (opStatus.data.status === 'COMPLETED') {
              console.log(`Domain ${domain.name} registration is complete, proceeding to transfer...`);
              
              try {
                // Transfer domain to user
                const transferResponse = await axios.patch(
                  `${API_BASE_URL}/domains/${domain.name}`,
                  {
                    owner: {
                      type: 'USER',
                      address: walletAddress
                    }
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${API_KEY}`,
                      'Content-Type': 'application/json'
                    }
                  }
                );
                
                console.log(`Domain ${domain.name} transfer initiated:`, transferResponse.data);
                
                // Store the transfer operation
                await axios.post(`${BASE_URL}/api/store-operation`, {
                  domain: domain.name,
                  operationId: transferResponse.data.operation.id,
                  status: 'PENDING',
                  walletAddress: walletAddress,
                  needsTransfer: false
                });
                
                results.push({
                  domain: domain.name,
                  success: true,
                  message: `Domain ${domain.name} is being transferred to ${walletAddress}`,
                  operation: transferResponse.data.operation
                });
              } catch (transferError: any) {
                console.error(`Error transferring domain ${domain.name}:`, transferError);
                console.error(`Response data:`, transferError.response?.data);
                
                results.push({
                  domain: domain.name,
                  success: false,
                  message: `Failed to transfer domain ${domain.name}`,
                  error: transferError.response?.data || transferError.message
                });
              }
            } else {
              // Operation still pending
              console.log(`Domain ${domain.name} registration is still in progress (${opStatus.data.status})`);
              results.push({
                domain: domain.name,
                success: true,
                message: `Domain ${domain.name} registration in progress (${opStatus.data.status})`,
                operation: opStatus.data,
                needsTransfer: true
              });
            }
          } catch (opError: any) {
            console.error(`Error checking operation ${domain.operationId}:`, opError);
            
            // Assume operation ID is invalid, attempt to register domain
            console.log(`Will attempt to register domain ${domain.name}...`);
          }
        } else {
          // No operation ID, try to register domain
          console.log(`No operation ID for ${domain.name}, checking domain status...`);
          
          try {
            // Check if domain already exists
            const domainCheck = await axios.get(
              `${API_BASE_URL}/domains/${domain.name}`,
              {
                headers: {
                  Authorization: `Bearer ${API_KEY}`
                }
              }
            );
            
            console.log(`Domain ${domain.name} found:`, domainCheck.data);
            
            // Check if domain is available or we need to register it
            if (domainCheck.data.availability?.status === 'AVAILABLE' || 
                domainCheck.data.owner?.type === 'NONE') {
              
              console.log(`Domain ${domain.name} is available, registering...`);
              
              // Register the domain
              const registerResponse = await axios.post(
                `${API_BASE_URL}/domains`,
                { name: domain.name },
                {
                  headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                  }
                }
              );
              
              console.log(`Domain ${domain.name} registration initiated:`, registerResponse.data);
              
              // Store operation data
              if (registerResponse.data.operation && registerResponse.data.operation.id) {
                await axios.post(`${BASE_URL}/api/store-operation`, {
                  domain: domain.name,
                  operationId: registerResponse.data.operation.id,
                  status: 'PENDING',
                  walletAddress: walletAddress,
                  needsTransfer: true
                });
              }
              
              results.push({
                domain: domain.name,
                success: true,
                message: `Domain ${domain.name} registration initiated`,
                operation: registerResponse.data.operation,
                needsTransfer: true
              });
            } else if (domainCheck.data.owner?.type === 'ME') {
              // We already own the domain, transfer it
              console.log(`Domain ${domain.name} is already owned by us, transferring...`);
              
              const transferResponse = await axios.patch(
                `${API_BASE_URL}/domains/${domain.name}`,
                {
                  owner: {
                    type: 'USER',
                    address: walletAddress
                  }
                },
                {
                  headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                  }
                }
              );
              
              console.log(`Domain ${domain.name} transfer initiated:`, transferResponse.data);
              
              // Store transfer operation
              if (transferResponse.data.operation && transferResponse.data.operation.id) {
                await axios.post(`${BASE_URL}/api/store-operation`, {
                  domain: domain.name,
                  operationId: transferResponse.data.operation.id,
                  status: 'PENDING',
                  walletAddress: walletAddress,
                  needsTransfer: false
                });
              }
              
              results.push({
                domain: domain.name,
                success: true,
                message: `Domain ${domain.name} is being transferred to ${walletAddress}`,
                operation: transferResponse.data.operation
              });
            } else {
              // Domain is owned by someone else
              console.log(`Domain ${domain.name} is owned by someone else, cannot transfer.`);
              
              results.push({
                domain: domain.name,
                success: false,
                message: `Domain ${domain.name} is already owned by another user`,
                error: { code: 'DOMAIN_UNAVAILABLE' }
              });
            }
          } catch (domainError: any) {
            if (domainError.response?.status === 404) {
              // Domain doesn't exist, register it
              console.log(`Domain ${domain.name} not found, registering...`);
              
              const registerResponse = await axios.post(
                `${API_BASE_URL}/domains`,
                { name: domain.name },
                {
                  headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                  }
                }
              );
              
              console.log(`Domain ${domain.name} registration initiated:`, registerResponse.data);
              
              // Store operation data
              if (registerResponse.data.operation && registerResponse.data.operation.id) {
                await axios.post(`${BASE_URL}/api/store-operation`, {
                  domain: domain.name,
                  operationId: registerResponse.data.operation.id,
                  status: 'PENDING',
                  walletAddress: walletAddress,
                  needsTransfer: true
                });
              }
              
              results.push({
                domain: domain.name,
                success: true,
                message: `Domain ${domain.name} registration initiated`,
                operation: registerResponse.data.operation,
                needsTransfer: true
              });
            } else {
              // Other error
              console.error(`Error checking domain ${domain.name}:`, domainError);
              console.error(`Response data:`, domainError.response?.data);
              
              results.push({
                domain: domain.name,
                success: false,
                message: `Error checking domain ${domain.name}`,
                error: domainError.response?.data || domainError.message
              });
            }
          }
        }
      } catch (domainError: any) {
        console.error(`Error processing domain ${domain.name}:`, domainError);
        console.error(`Response data:`, domainError.response?.data);
        console.error(`Request URL:`, domainError.config?.url);
        console.error(`Request data:`, domainError.config?.data);
        
        results.push({
          domain: domain.name,
          success: false,
          error: domainError.response?.data || domainError.message
        });
      }
    }

    // Check if all domains were processed successfully
    const allSuccessful = results.every((result: any) => result.success);
    
    console.log(`Checkout process completed. All successful: ${allSuccessful}`);
    console.log(`Results:`, results);

    return NextResponse.json({
      success: allSuccessful,
      results,
      error: !allSuccessful ? {
        message: "Failed to process some domains",
        details: results.filter((r: any) => !r.success)
      } : undefined
    });
  } catch (error: any) {
    console.error('Error in checkout process:', error);
    console.error('Stack trace:', error.stack);
    
    return NextResponse.json({ 
      success: false,
      error: { 
        message: 'Failed to process checkout', 
        details: error.response?.data || error.message 
      } 
    }, { status: 500 });
  }
}