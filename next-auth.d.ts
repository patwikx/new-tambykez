// src/types/next-auth.d.ts
import type { UserRole } from "@prisma/client"
import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      firstName?: string | null
      lastName?: string | null
      role: UserRole
      isActive: boolean
      hasGoogleOAuth: boolean
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    email: string
    firstName?: string | null
    lastName?: string | null
    role: UserRole
    isActive: boolean
    hasGoogleOAuth?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: UserRole
    isActive: boolean
    hasGoogleOAuth: boolean
    firstName?: string | null
    lastName?: string | null
    email?: string | null
  }
}
