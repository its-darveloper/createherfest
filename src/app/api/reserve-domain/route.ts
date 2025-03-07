// src/app/api/reserve-domain/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_UD_API_URL || 'https://api.ud-sandbox.com/partner/v3';
const API_KEY = process.env.UD_API_KEY;

// For tracking reservations - in a production environment, this should be a database
// This is temporary storage and will reset when the server restarts
interface Reservation {
  domain: string;
  operationId: string;
  walletAddress: string;
  timestamp: number;
  status: string;
}

// In-memory store for reservations
let reservations: Reservation[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Handle both parameter formats
    const domains = body.domains || (body.domainName ? [body.domainName] : []);
    const walletAddress = body.walletAddress || body.userId;
    
    if (!domains || domains.length === 0) {
      return NextResponse.json({ 
        success: false,
        error: { message: 'Domain names are required' } 
      }, { status: 400 });
    }
    
    if (!walletAddress) {
      return NextResponse.json({ 
        success: false,
        error: { message: 'Wallet address is required' } 
      }, { status: 400 });
    }
    
    console.log(`Attempting to reserve domains:`, domains);
    
    // Process domains one by one to reserve them
    const results = [];
    let allSuccessful = true;
    
    for (const domainName of domains) {
      try {
        console.log(`Checking availability for ${domainName}...`);
        
        // Check if domain is still available
        const availabilityCheck = await axios.get(
          `${API_BASE_URL}/domains/${domainName}`,
          {
            headers: {
              Authorization: `Bearer ${API_KEY}`
            }
          }
        );
        
        if (availabilityCheck.data.availability?.status === 'AVAILABLE' || 
            availabilityCheck.data.owner?.type === 'NONE') {
          console.log(`Domain ${domainName} is available, reserving...`);
          
          // Register domain to the partner account (reserve it)
          const reservationResponse = await axios.post(
            `${API_BASE_URL}/domains`,
            { name: domainName },
            {
              headers: {
                Authorization: `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          console.log(`Domain ${domainName} reservation initiated:`, reservationResponse.data);
          
          // Store operation data in our API
          await axios.post('/api/store-operation', {
            domain: domainName,
            operationId: reservationResponse.data.operation.id,
            status: 'PENDING',
            walletAddress,
            needsTransfer: true,
            isReservation: true
          });
          
          // Store in our local reservations array
          reservations.push({
            domain: domainName,
            operationId: reservationResponse.data.operation.id,
            walletAddress,
            timestamp: Date.now(),
            status: 'PENDING'
          });
          
          results.push({
            domain: domainName,
            success: true,
            message: `Domain ${domainName} has been reserved`,
            operation: reservationResponse.data.operation
          });
        } else if (availabilityCheck.data.owner?.type === 'ME') {
          // We already own this domain, it's already reserved
          console.log(`Domain ${domainName} is already reserved by us`);
          
          // Check if it's already in our reservations list
          const existingReservation = reservations.find(
            r => r.domain === domainName
          );
          
          // If not, add it
          if (!existingReservation) {
            reservations.push({
              domain: domainName,
              operationId: 'already-owned',
              walletAddress,
              timestamp: Date.now(),
              status: 'COMPLETED'
            });
          } else if (existingReservation.walletAddress !== walletAddress) {
            // If it's reserved by someone else
            results.push({
              domain: domainName,
              success: false,
              message: `Domain ${domainName} is already reserved by another user`,
              error: { code: 'DOMAIN_ALREADY_RESERVED' }
            });
            
            allSuccessful = false;
            continue;
          }
          
          results.push({
            domain: domainName,
            success: true,
            message: `Domain ${domainName} was already reserved`,
            alreadyReserved: true
          });
        } else {
          // Domain is not available
          console.log(`Domain ${domainName} is not available`);
          
          results.push({
            domain: domainName,
            success: false,
            message: `Domain ${domainName} is no longer available`,
            error: { code: 'DOMAIN_UNAVAILABLE' }
          });
          
          allSuccessful = false;
        }
      } catch (error: any) {
        console.error(`Error reserving domain ${domainName}:`, error);
        
        results.push({
          domain: domainName,
          success: false,
          message: `Failed to reserve domain ${domainName}`,
          error: error.response?.data || error.message
        });
        
        allSuccessful = false;
      }
    }
    
    return NextResponse.json({
      success: allSuccessful,
      results
    });
  } catch (error: any) {
    console.error('Error in domain reservation process:', error);
    
    return NextResponse.json({ 
      success: false,
      error: { 
        message: 'Failed to reserve domains', 
        details: error.message 
      } 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const domain = request.nextUrl.searchParams.get('domain');
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!domain || !userId) {
      return NextResponse.json({ 
        success: false,
        error: { message: 'Domain and userId are required parameters' } 
      }, { status: 400 });
    }
    
    console.log(`Checking reservation for domain ${domain} and user ${userId}`);
    
    // First, check our reservations list
    const reservation = reservations.find(
      r => r.domain === domain
    );
    
    // If we have a reservation
    if (reservation) {
      const ownReservation = reservation.walletAddress === userId;
      
      return NextResponse.json({
        domain,
        reserved: true,
        ownReservation,
        reservedBy: reservation.walletAddress,
        timestamp: reservation.timestamp,
        status: reservation.status
      });
    }
    
    // If no reservation found in our system, check the blockchain
    try {
      const domainCheck = await axios.get(
        `${API_BASE_URL}/domains/${domain}`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`
          }
        }
      );
      
      // If we own the domain, it's considered "reserved" but not specifically for this user
      const isOwnedByUs = domainCheck.data.owner?.type === 'ME';
      
      if (isOwnedByUs) {
        // Add to our reservations for future reference
        reservations.push({
          domain,
          operationId: 'existing-domain',
          walletAddress: 'unknown', // We don't know who it's for
          timestamp: Date.now(),
          status: 'OWNED'
        });
      }
      
      return NextResponse.json({
        domain,
        reserved: isOwnedByUs,
        ownReservation: false, // Since it's not in our reservations system for this user
        owner: domainCheck.data.owner
      });
    } catch (error: any) {
      if (error.response?.status === 404) {
        return NextResponse.json({
          domain,
          reserved: false,
          ownReservation: false,
          error: 'Domain not found'
        });
      }
      
      throw error; // Re-throw for the catch block below
    }
  } catch (error: any) {
    console.error('Error checking domain reservation:', error);
    
    return NextResponse.json({ 
      success: false,
      error: { 
        message: 'Failed to check domain reservation', 
        details: error.response?.data || error.message 
      } 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const data = await request.json();
    const { domainName, userId } = data;
    
    if (!domainName || !userId) {
      return NextResponse.json({ 
        success: false,
        error: { message: 'Domain name and user ID are required' } 
      }, { status: 400 });
    }
    
    console.log(`Releasing reservation for domain ${domainName} for user ${userId}`);
    
    // Find the reservation
    const reservationIndex = reservations.findIndex(
      r => r.domain === domainName && r.walletAddress === userId
    );
    
    if (reservationIndex === -1) {
      return NextResponse.json({
        success: false,
        message: `No reservation found for domain ${domainName} for user ${userId}`
      }, { status: 404 });
    }
    
    // Get the reservation before removing it
    const reservation = reservations[reservationIndex];
    
    // Remove from our reservations list
    reservations.splice(reservationIndex, 1);
    
    // If the domain was actually registered to our account and not just a placeholder reservation
    if (reservation.operationId && reservation.operationId !== 'already-owned' && reservation.operationId !== 'existing-domain') {
      // Check the operation status to see if it completed
      try {
        const operationCheck = await axios.get(
          `${API_BASE_URL}/operations/${reservation.operationId}`,
          {
            headers: {
              Authorization: `Bearer ${API_KEY}`
            }
          }
        );
        
        // If the operation completed successfully, we need to return the domain
        if (operationCheck.data.status === 'COMPLETED') {
          try {
            // Return the domain back to Unstoppable
            const returnResponse = await axios.post(
              `${API_BASE_URL}/domains/${domainName}/return`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${API_KEY}`,
                  'Content-Type': 'application/json'
                }
              }
            );
            
            console.log(`Domain ${domainName} return initiated:`, returnResponse.data);
            
            // Store the return operation in our tracking system
            await axios.post('/api/store-operation', {
              domain: domainName,
              operationId: returnResponse.data.operation.id,
              status: 'PENDING',
              walletAddress: userId,
              isReturn: true
            });
            
            return NextResponse.json({
              success: true,
              message: `Reservation for ${domainName} has been released and domain return has been initiated`,
              operation: returnResponse.data.operation
            });
          } catch (returnError: any) {
            console.error(`Error returning domain ${domainName}:`, returnError);
            
            return NextResponse.json({
              success: false,
              message: `Reservation released but domain return failed: ${returnError.message}`,
              error: returnError.response?.data || returnError.message
            });
          }
        }
      } catch (opError) {
        console.error(`Error checking operation ${reservation.operationId}:`, opError);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Reservation for ${domainName} has been released`
    });
  } catch (error: any) {
    console.error('Error releasing domain reservation:', error);
    
    return NextResponse.json({ 
      success: false,
      error: { 
        message: 'Failed to release domain reservation', 
        details: error.message 
      } 
    }, { status: 500 });
  }
}