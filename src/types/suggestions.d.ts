// types/suggestions.d.ts

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
  
  export default interface Suggestions {
    items: DomainSuggestion[];
    error?: {
      message: string;
      details: any;
    };
  }