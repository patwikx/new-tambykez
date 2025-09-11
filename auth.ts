// lib/auth.ts
import NextAuth, { type Account, type Profile } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import type { UserRole } from "@prisma/client"
import { z } from "zod"

// Type definitions
interface GoogleProfile extends Profile {
  sub: string
  email: string
  name?: string
  given_name?: string
  family_name?: string
  picture?: string
  locale?: string
  email_verified?: boolean
}

interface SocialAccount extends Account {
  access_token?: string
  refresh_token?: string
  expires_at?: number
  providerAccountId: string
}

interface ExtendedUser {
  id: string
  email: string
  firstName?: string | null
  lastName?: string | null
  role: UserRole
  isActive: boolean
  hasGoogleOAuth?: boolean
}

// Validation schemas
const credentialsSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

const googleProfileSchema = z.object({
  sub: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  given_name: z.string().optional(),
  family_name: z.string().optional(),
  picture: z.string().url().optional(),
  locale: z.string().optional(),
  email_verified: z.boolean().optional(),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  providers: [
    Credentials({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          // Validate input
          const { email, password } = credentialsSchema.parse(credentials)

          // Rate limiting check
          await checkRateLimit(email)

          // Find user with social logins
          const user = await prisma.user.findUnique({
            where: { email },
            include: {
              socialLogins: {
                where: { provider: "GOOGLE" },
                select: { id: true },
              },
            },
          })

          if (!user) {
            await logLoginAttempt(email, false, "user_not_found")
            return null
          }

          // Check if account is active
          if (!user.isActive || user.deletedAt) {
            await logLoginAttempt(email, false, "account_inactive")
            return null
          }

          // Verify password
          const isValid = await bcrypt.compare(password, user.password)
          if (!isValid) {
            await logLoginAttempt(email, false, "invalid_password")
            return null
          }

          // Log successful attempt
          await logLoginAttempt(email, true)

          // Check for Google OAuth
          const hasGoogleOAuth = user.socialLogins.length > 0

          return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isActive: user.isActive,
            hasGoogleOAuth,
          }
        } catch (error) {
          console.error("Credentials auth error:", error)
          return null
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile",
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      profile: (profile: GoogleProfile) => {
        const validatedProfile = googleProfileSchema.parse(profile)

        return {
          id: validatedProfile.sub,
          email: validatedProfile.email,
          name: validatedProfile.name,
          image: validatedProfile.picture,
          firstName: validatedProfile.given_name,
          lastName: validatedProfile.family_name,
          role: "CUSTOMER" as UserRole,
          isActive: true,
          hasGoogleOAuth: true,
        }
      },
    }),
  ],
  callbacks: {
    signIn: async ({ user, account, profile }) => {
      try {
        if (account?.provider === "google" && profile) {
          const typedProfile = profile as GoogleProfile
          const validatedProfile = googleProfileSchema.parse(typedProfile)

          // Find or create user
          let dbUser = await prisma.user.findUnique({
            where: { email: validatedProfile.email },
          })

          if (!dbUser) {
            // Create new customer user
            dbUser = await prisma.user.create({
              data: {
                email: validatedProfile.email,
                firstName: validatedProfile.given_name || "",
                lastName: validatedProfile.family_name || "",
                role: "CUSTOMER",
                isActive: true,
                password: await bcrypt.hash(globalThis.crypto.randomUUID(), 12),
              },
            })
          }

          // Prevent staff from using Google OAuth
          if (["ADMIN", "MODERATOR", "VENDOR"].includes(dbUser.role)) {
            return false
          }

          // Create or update social login
          await createOrUpdateSocialLogin(dbUser.id, account as SocialAccount, validatedProfile)

          user.id = dbUser.id
          user.role = dbUser.role
          user.isActive = dbUser.isActive

          return true
        }

        return true
      } catch (error) {
        console.error("SignIn callback error:", error)
        return false
      }
    },
    jwt: async ({ token, user, trigger }) => {
      if (user) {
        token.id = user.id as string
        token.role = user.role as UserRole
        token.isActive = user.isActive as boolean
        token.hasGoogleOAuth = (user as ExtendedUser).hasGoogleOAuth || false
        token.firstName = (user as ExtendedUser).firstName
        token.lastName = (user as ExtendedUser).lastName
        token.email = user.email
      }

      if (trigger === "update" && token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            include: {
              socialLogins: {
                where: { provider: "GOOGLE" },
                select: { id: true },
              },
            },
          })

          if (dbUser) {
            token.role = dbUser.role
            token.isActive = dbUser.isActive
            token.hasGoogleOAuth = dbUser.socialLogins.length > 0
            token.firstName = dbUser.firstName
            token.lastName = dbUser.lastName
            token.email = dbUser.email
          }
        } catch (error) {
          console.error("Error refreshing user data:", error)
        }
      }

      return token
    },
    session: async ({ session, token }) => {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
        session.user.isActive = token.isActive as boolean
        session.user.hasGoogleOAuth = token.hasGoogleOAuth as boolean
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.email = token.email as string
      }

      return session
    },
  },
  events: {
    signIn: async ({ user, account, isNewUser }) => {
      await prisma.securityLog.create({
        data: {
          userId: user.id as string,
          action: "LOGIN",
          details: {
            provider: account?.provider,
            isNewUser,
            userAgent: "Unknown",
          },
          success: true,
        },
      })
    },
    signOut: async (message) => {
      if ("token" in message && message.token?.id) {
        await prisma.securityLog.create({
          data: {
            userId: message.token.id as string,
            action: "LOGOUT",
            success: true,
          },
        })
      }
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
})

// Utility functions
async function checkRateLimit(email: string): Promise<void> {
  const recentAttempts = await prisma.loginAttempt.count({
    where: {
      email,
      createdAt: {
        gte: new Date(Date.now() - 15 * 60 * 1000), // Last 15 minutes
      },
      success: false,
    },
  })

  if (recentAttempts >= 5) {
    throw new Error("Too many login attempts. Please try again later.")
  }
}

async function logLoginAttempt(email: string, success: boolean, failureReason?: string): Promise<void> {
  await prisma.loginAttempt.create({
    data: {
      email,
      success,
      failureReason,
      ipAddress: "Unknown",
      userAgent: "Unknown",
    },
  })
}

// Helper function to create or update social login
async function createOrUpdateSocialLogin(
  userId: string,
  account: SocialAccount,
  profile: GoogleProfile,
): Promise<void> {
  const existingSocialLogin = await prisma.socialLogin.findFirst({
    where: {
      provider: "GOOGLE",
      providerId: account.providerAccountId,
    },
  })

  const socialLoginData = {
    userId,
    provider: "GOOGLE" as const,
    providerId: account.providerAccountId,
    email: profile.email,
    name: profile.name,
    firstName: profile.given_name,
    lastName: profile.family_name,
    picture: profile.picture,
    locale: profile.locale,
    emailVerified: profile.email_verified,
    accessToken: account.access_token,
    refreshToken: account.refresh_token,
    tokenExpires: account.expires_at ? new Date(account.expires_at * 1000) : null,
    profileData: JSON.parse(JSON.stringify(profile)),
    lastSync: new Date(),
  }

  if (existingSocialLogin) {
    await prisma.socialLogin.update({
      where: { id: existingSocialLogin.id },
      data: socialLoginData,
    })
  } else {
    await prisma.socialLogin.create({
      data: socialLoginData,
    })
  }
}
