// types/auth.d.ts

export default interface Authorization {
    idToken: {
      sub: string;
      wallet_address: string;
      email?: string;
    };
  }