// types/cart.d.ts
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

export interface CartItem {
  suggestion: DomainSuggestion;
  operationId: string;
  available: boolean;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (item: DomainSuggestion) => void;
  removeItem: (domainName: string) => void;
  updateItemOperation: (domainName: string, operationId: string) => void;
  updateItemAvailability: (domainName: string, available: boolean) => void;
  clearCart: () => void;
  total: number;
}