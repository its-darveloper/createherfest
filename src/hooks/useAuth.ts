// // hooks/useAuth.ts

// 'use client';

// import { useState, useEffect, createContext, useContext } from 'react';

// interface UAuthUser {
//   sub: string;
//   wallet_address: string;
//   email?: string;
// }

// interface AuthContextType {
//   user: UAuthUser | null;
//   isLoading: boolean;
//   login: () => Promise<void>;
//   logout: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // For the mock implementation, we'll simulate a login
// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<UAuthUser | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
  
//   useEffect(() => {
//     // Check if user is stored in localStorage
//     const storedUser = localStorage.getItem('auth_user');
//     if (storedUser) {
//       try {
//         setUser(JSON.parse(storedUser));
//       } catch (error) {
//         console.error('Error parsing auth data:', error);
//         localStorage.removeItem('auth_user');
//       }
//     }
//   }, []);
  
//   const login = async () => {
//     setIsLoading(true);
    
//     try {
//       // Simulate auth delay
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       // Mock user for development
//       const mockUser: UAuthUser = {
//         sub: 'user.her',
//         wallet_address: '0x1234567890abcdef1234567890abcdef12345678'
//       };
      
//       setUser(mockUser);
//       localStorage.setItem('auth_user', JSON.stringify(mockUser));
      
//     } catch (error) {
//       console.error('Login error:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   const logout = async () => {
//     setIsLoading(true);
    
//     try {
//       await new Promise(resolve => setTimeout(resolve, 500));
//       setUser(null);
//       localStorage.removeItem('auth_user');
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   // In hooks/useAuth.ts
// return (
//     <AuthContext.Provider value={{ user, isLoading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };