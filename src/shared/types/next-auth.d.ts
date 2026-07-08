import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
      accessToken?: string;
      refreshToken?: string;
    };
  }

  interface User extends DefaultUser {
    id: string;
    role: string;
    email: string;
    status: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    email: string;
    status: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }
}
