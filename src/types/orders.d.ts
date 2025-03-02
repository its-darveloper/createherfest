// types/orders.d.ts

export interface Operation {
    id: string;
    status: string;
    domain?: string;
  }
  
  export interface Order {
    operation: Operation;
    payment: boolean;
    walletAddress: string;
  }
  
  export default interface Orders {
    items: Order[];
  }