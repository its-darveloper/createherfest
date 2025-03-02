// app/api/unstoppableDomains.ts

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_UD_API_URL || 'https://api.ud-sandbox.com/partner/v3';
const API_KEY = process.env.UD_API_KEY;

// Types
export interface DomainSuggestion {
  name: string;
  availability: {
    status: string;
  };
  price: {
    listPrice: {
      usdCents: number;
    };
  };
}

export interface SuggestionsResponse {
  items: DomainSuggestion[];
  error?: {
    message: string;
    details: any;
  };
}

export interface RegistrationResponse {
  operation: {
    id: string;
    status: string;
    domain: string;
  };
  error?: {
    message: string;
    details: any;
  };
}

export interface AvailabilityResponse {
  items: {
    name: string;
    availability: {
      status: string;
    };
  }[];
  error?: {
    message: string;
    details: any;
  };
}

// API functions
export const fetchDomainSuggestions = async (query: string): Promise<SuggestionsResponse> => {
  try {
    const response = await axios.get(`/api/domains?query=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching domain suggestions:', error);
    return { 
      items: [],
      error: { 
        message: 'Failed to fetch domain suggestions', 
        details: error 
      } 
    };
  }
};

export const checkDomainAvailability = async (domains: string[]): Promise<AvailabilityResponse> => {
  try {
    const response = await axios.post('/api/availability', { domains });
    return response.data;
  } catch (error) {
    console.error('Error checking domain availability:', error);
    return { 
      items: [],
      error: { 
        message: 'Failed to check domain availability', 
        details: error 
      } 
    };
  }
};

export const registerDomain = async (domainId: string): Promise<RegistrationResponse> => {
  try {
    const response = await axios.post('/api/register', { domainId });
    return response.data;
  } catch (error) {
    console.error('Error registering domain:', error);
    return { 
      operation: { id: '', status: 'FAILED', domain: '' },
      error: { 
        message: 'Failed to register domain', 
        details: error 
      } 
    };
  }
};

export const initializeCheckout = async (
  domain: string, 
  walletAddress: string, 
  payment: boolean, 
  operationId: string
): Promise<any> => {
  try {
    const response = await axios.post(`/api/checkout/${domain}`, {
      wallet: walletAddress,
      payment,
      operationId
    });
    return response.data;
  } catch (error) {
    console.error('Error initializing checkout:', error);
    return { 
      error: { 
        message: 'Failed to initialize checkout', 
        details: error 
      } 
    };
  }
};