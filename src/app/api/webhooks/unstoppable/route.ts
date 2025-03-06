// src/app/api/webhooks/unstoppable/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.UD_API_KEY!;
const OPERATIONS_FILE = path.join(process.cwd(), 'operations.json');

// Ensure operations file exists
if (!fs.existsSync(OPERATIONS_FILE)) {
  fs.writeFileSync(OPERATIONS_FILE, JSON.stringify([]));
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-ud-signature');
    const body = await request.text();
    const jsonBody = JSON.parse(body);
    
    console.log('Received webhook:', jsonBody.type);
    
    // Verify webhook signature
    if (!verifySignature(body, signature)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    
    // Process based on webhook type
    switch (jsonBody.type) {
      case 'OPERATION_FINISHED':
        await handleOperationFinished(jsonBody);
        break;
      default:
        console.log(`Unhandled webhook type: ${jsonBody.type}`);
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function verifySignature(body: string, signature?: string | null): boolean {
  if (!signature) return false;
  
  try {
    const computed = crypto
      .createHmac('sha256', API_KEY)
      .update(body)
      .digest('base64');
    
    return computed === signature;
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
}

async function handleOperationFinished(payload: any) {
  const { operation } = payload;
  console.log(`Operation ${operation.id} finished with status: ${operation.status}`);
  
  try {
    // Read operations file
    const operations = JSON.parse(fs.readFileSync(OPERATIONS_FILE, 'utf8'));
    
    // Find the operation in our data
    const operationIndex = operations.findIndex((op: any) => op.operationId === operation.id);
    
    if (operationIndex >= 0) {
      // Update operation status
      operations[operationIndex].status = operation.status;
      operations[operationIndex].lastUpdated = new Date().toISOString();
      
      // If operation was successful and needs transfer, initiate transfer
      if (operation.status === 'COMPLETED' && operations[operationIndex].needsTransfer && operations[operationIndex].walletAddress) {
        if (!operations[operationIndex].isReservation) {
          // Only transfer if not a reservation (i.e., a real purchase)
          await transferDomain(operation.domain, operations[operationIndex].walletAddress);
        }
      } else if (operation.status === 'FAILED') {
        // If operation failed, log it
        console.log(`Operation ${operation.id} for domain ${operation.domain} failed`);
        // Could implement refund logic here if needed
      }
      
      // Save updated operations
      fs.writeFileSync(OPERATIONS_FILE, JSON.stringify(operations, null, 2));
    } else {
      console.log(`Operation ${operation.id} not found in our records`);
    }
  } catch (error) {
    console.error('Error handling operation update:', error);
  }
}

async function transferDomain(domainName: string, walletAddress: string) {
  try {
    console.log(`Transferring domain ${domainName} to ${walletAddress}`);
    
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_UD_API_URL}/domains/${domainName}`,
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
    
    console.log(`Transfer for ${domainName} initiated:`, response.data);
    
    // Update our records with the transfer operation ID
    const operations = JSON.parse(fs.readFileSync(OPERATIONS_FILE, 'utf8'));
    operations.push({
      domain: domainName,
      operationId: response.data.operation.id,
      status: 'PENDING',
      lastUpdated: new Date().toISOString(),
      walletAddress,
      needsTransfer: false,
      isTransfer: true
    });
    
    fs.writeFileSync(OPERATIONS_FILE, JSON.stringify(operations, null, 2));
  } catch (error) {
    console.error(`Error transferring domain ${domainName}:`, error);
  }
}