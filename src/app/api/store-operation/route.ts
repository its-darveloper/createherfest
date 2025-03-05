// app/api/store-operation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Simple file-based storage for development
const OPERATIONS_FILE = path.join(process.cwd(), 'operations.json');

// Initialize operations file if it doesn't exist
if (!fs.existsSync(OPERATIONS_FILE)) {
  fs.writeFileSync(OPERATIONS_FILE, JSON.stringify([]));
}

export async function POST(request: NextRequest) {
  try {
    const { domain, operationId, status, walletAddress, needsTransfer } = await request.json();
    
    console.log(`Storing operation for domain ${domain}:`, {
      operationId,
      status,
      walletAddress: walletAddress ? `${walletAddress.substring(0, 8)}...` : undefined,
      needsTransfer
    });
    
    if (!domain || !operationId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Domain and operationId are required' 
      }, { status: 400 });
    }
    
    // Read current operations
    const operations = JSON.parse(fs.readFileSync(OPERATIONS_FILE, 'utf8'));
    
    // Check if operation already exists
    const existingIndex = operations.findIndex((op: any) => op.domain === domain || op.name === domain);
    
    if (existingIndex >= 0) {
      // Update existing operation
      operations[existingIndex] = {
        ...operations[existingIndex],
        domain,
        name: domain, // Store both domain and name for compatibility
        operationId,
        status: status || operations[existingIndex].status || 'PENDING',
        lastUpdated: new Date().toISOString(),
        walletAddress: walletAddress || operations[existingIndex].walletAddress,
        needsTransfer: needsTransfer !== undefined ? needsTransfer : operations[existingIndex].needsTransfer
      };
    } else {
      // Add new operation
      operations.push({
        domain,
        name: domain, // Store both domain and name for compatibility
        operationId,
        status: status || 'PENDING',
        lastUpdated: new Date().toISOString(),
        walletAddress,
        needsTransfer: needsTransfer !== undefined ? needsTransfer : true
      });
    }
    
    // Write back to file
    fs.writeFileSync(OPERATIONS_FILE, JSON.stringify(operations, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error storing operation:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the wallet address from the query parameter
    const walletAddress = request.nextUrl.searchParams.get('wallet');
    
    console.log(`Getting operations${walletAddress ? ` for wallet ${walletAddress.substring(0, 8)}...` : ''}`);
    
    // Read operations from file
    const operations = JSON.parse(fs.readFileSync(OPERATIONS_FILE, 'utf8'));
    
    // Filter by wallet if provided
    if (walletAddress) {
      const filteredOperations = operations.filter((op: any) => op.walletAddress === walletAddress);
      console.log(`Found ${filteredOperations.length} operations for wallet`);
      
      // Map each operation to ensure it has both name and domain fields
      const normalizedOperations = filteredOperations.map((op: any) => ({
        ...op,
        name: op.name || op.domain || '',
        domain: op.domain || op.name || ''
      }));
      
      return NextResponse.json({
        operations: normalizedOperations
      });
    }
    
    console.log(`Returning ${operations.length} total operations`);
    
    // Map each operation to ensure it has both name and domain fields
    const normalizedOperations = operations.map((op: any) => ({
      ...op,
      name: op.name || op.domain || '',
      domain: op.domain || op.name || ''
    }));
    
    return NextResponse.json({ operations: normalizedOperations });
  } catch (error: any) {
    console.error('Error getting operations:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}