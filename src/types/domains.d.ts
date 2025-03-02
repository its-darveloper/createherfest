// types/domains.d.ts

export interface Domain {
    name: string;
    availability: {
      status: string;
    };
  }
  
  export default interface Domains {
    items: Domain[];
    error?: {
      message: string;
      details: any;
    };
  }