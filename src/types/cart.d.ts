// types/cart.d.ts

import { DomainSuggestion } from './suggestions';

export default interface CartItem {
  suggestion: DomainSuggestion;
  operationId: string;
  available: boolean;
}