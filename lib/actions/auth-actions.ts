// lib/actions/auth.ts
"use server"

import { signIn, signOut, auth } from "@/lib/auth/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { AuthError } from "next-auth"
import { headers } from "next/headers"

// Validation schemas
const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  callbackUrl: z.string().optional(),
})

const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain uppercase, lowercase, number and special character",
    ),
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  phone: z.string().optional(),
})

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain uppercase, lowercase, number and special character",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

// Action result types
type ActionResult<T = null> = {
  success: boolean
  message?: string
  errors?: Record<string, string[]>
  data?: T
}

// Helper to get client info
async function getClientInfo() {
  const headersList = await headers()
  return {
    userAgent: headersList.get("user-agent") || "Unknown",
    ipAddress: headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "Unknown",
  }
}

export async function credentialsSignIn(prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      callbackUrl: formData.get("callbackUrl") as string,
    }

    const validatedData = signInSchema.parse(data)

    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirectTo: validatedData.callbackUrl || "/",
    })

    return { success: true }
  } catch (error) {
    console.error("Sign in error:", error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed",
        errors: error.flatten().fieldErrors,
      }
    }

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            message: "Invalid email or password",
          }
        case "CallbackRouteError":
          return {
            success: false,
            message: "Authentication failed. Please try again.",
          }
        default:
          return {
            success: false,
            message: "An authentication error occurred",
          }
      }
    }

    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}

export async function googleSignIn(callbackUrl?: string): Promise<void> {
  await signIn("google", {
    redirectTo: callbackUrl || "/",
  })
}

export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: "/" })
}

export async function signUpAction(prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      phone: formData.get("phone") as string,
    }

    const validatedData = signUpSchema.parse(data)
    const { userAgent, ipAddress } = await getClientInfo()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return {
        success: false,
        message: "An account with this email already exists",
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phone: validatedData.phone || null,
        role: "CUSTOMER",
        isActive: true,
      },
    })

    // Log the registration
    await prisma.securityLog.create({
      data: {
        userId: user.id,
        action: "LOGIN", // First login after registration
        details: {
          type: "registration",
          userAgent,
          ipAddress,
        },
        ipAddress,
        userAgent,
        success: true,
      },
    })

    // Automatically sign in the new user
    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirectTo: "/",
    })

    return { success: true }
  } catch (error) {
    console.error("Sign up error:", error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed",
        errors: error.flatten().fieldErrors,
      }
    }

    return {
      success: false,
      message: "Failed to create account. Please try again.",
    }
  }
}

export async function changePasswordAction(prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    // This would typically require the user to be authenticated
    // You'd get the user ID from the session
    const session = await auth()

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Not authenticated",
      }
    }

    const data = {
      currentPassword: formData.get("currentPassword") as string,
      newPassword: formData.get("newPassword") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    }

    const validatedData = changePasswordSchema.parse(data)
    const { userAgent, ipAddress } = await getClientInfo()

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return {
        success: false,
        message: "User not found",
      }
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(validatedData.currentPassword, user.password)

    if (!isCurrentPasswordValid) {
      return {
        success: false,
        message: "Current password is incorrect",
      }
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(validatedData.newPassword, 12)

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedNewPassword,
        updatedAt: new Date(),
      },
    })

    // Log password change
    await prisma.securityLog.create({
      data: {
        userId: user.id,
        action: "PASSWORD_CHANGE",
        details: {
          userAgent,
          ipAddress,
        },
        ipAddress,
        userAgent,
        success: true,
      },
    })

    return {
      success: true,
      message: "Password changed successfully",
    }
  } catch (error) {
    console.error("Change password error:", error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed",
        errors: error.flatten().fieldErrors,
      }
    }

    return {
      success: false,
      message: "Failed to change password. Please try again.",
    }
  }
}

export async function updateProfileAction(prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    // This would typically require the user to be authenticated
    // You'd get the user ID from the session
    const session = await auth()

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Not authenticated",
      }
    }

    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      phone: formData.get("phone") as string,
    }

    // Validate data
    const updateSchema = z.object({
      firstName: z.string().min(1, "First name is required").max(50),
      lastName: z.string().min(1, "Last name is required").max(50),
      phone: z.string().optional(),
    })

    const validatedData = updateSchema.parse(data)

    // Update user profile
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phone: validatedData.phone || null,
        updatedAt: new Date(),
        updatedBy: session.user.id,
      },
    })

    return {
      success: true,
      message: "Profile updated successfully",
    }
  } catch (error) {
    console.error("Update profile error:", error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed",
        errors: error.flatten().fieldErrors,
      }
    }

    return {
      success: false,
      message: "Failed to update profile. Please try again.",
    }
  }
}
