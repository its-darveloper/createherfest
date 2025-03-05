// types/auth.d.ts
export interface UAuthUser {
  idToken: {
    sub: string;
    wallet_address: string;
    email?: string;
  };
}

export interface AuthContextType {
  user: UAuthUser | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}