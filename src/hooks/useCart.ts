// // hooks/useCart.ts

// 'use client';

// import { useState, useEffect, createContext, useContext } from 'react';

// // Types
// export interface DomainSuggestion {
//   name: string;
//   availability: {
//     status: string;
//   };
//   price: {
//     listPrice: {
//       usdCents: number;
//     };
//   };
// }

// export interface CartItem {
//   suggestion: DomainSuggestion;
//   operationId: string;
//   available: boolean;
// }

// interface CartContextType {
//   items: CartItem[];
//   addItem: (item: DomainSuggestion) => void;
//   removeItem: (domainName: string) => void;
//   updateItemOperation: (domainName: string, operationId: string) => void;
//   updateItemAvailability: (domainName: string, available: boolean) => void;
//   clearCart: () => void;
//   total: number;
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export const CartProvider = ({ children }: { children: React.ReactNode }) => {
//   const [items, setItems] = useState<CartItem[]>([]);
  
//   // Load cart from localStorage on initial render
//   useEffect(() => {
//     const storedCart = localStorage.getItem('domain_cart');
//     if (storedCart) {
//       try {
//         setItems(JSON.parse(storedCart));
//       } catch (error) {
//         console.error('Error parsing cart data:', error);
//         localStorage.removeItem('domain_cart');
//       }
//     }
//   }, []);
  
//   // Save cart to localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem('domain_cart', JSON.stringify(items));
//   }, [items]);
  
//   const addItem = (item: DomainSuggestion) => {
//     if (!items.some(cartItem => cartItem.suggestion.name === item.name)) {
//       setItems([...items, { suggestion: item, operationId: '', available: true }]);
//     }
//   };
  
//   const removeItem = (domainName: string) => {
//     setItems(items.filter(item => item.suggestion.name !== domainName));
//   };
  
//   const updateItemOperation = (domainName: string, operationId: string) => {
//     setItems(
//       items.map(item => 
//         item.suggestion.name === domainName 
//           ? { ...item, operationId } 
//           : item
//       )
//     );
//   };
  
//   const updateItemAvailability = (domainName: string, available: boolean) => {
//     setItems(
//       items.map(item => 
//         item.suggestion.name === domainName 
//           ? { ...item, available } 
//           : item
//       )
//     );
//   };
  
//   const clearCart = () => {
//     setItems([]);
//   };
  
//   // Calculate total price in USD cents
//   const total = items.reduce(
//     (sum, item) => sum + (item.suggestion.price?.listPrice?.usdCents || 0), 
//     0
//   );
  
//   // In hooks/useCart.ts
// return (
//     <CartContext.Provider 
//       value={{ 
//         items, 
//         addItem, 
//         removeItem, 
//         updateItemOperation, 
//         updateItemAvailability, 
//         clearCart, 
//         total 
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (context === undefined) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };