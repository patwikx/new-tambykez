// lib/auth-utils.ts - Server-side utilities
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { UserRole } from "@prisma/client"

export async function requireAuth() {
  const session = await auth()
  
  if (!session) {
    redirect("/auth/signin")
  }

  if (!session.user.isActive) {
    redirect("/auth/error?error=AccountDeactivated")
  }

  return session
}

export async function requireRole(allowedRoles: UserRole[]) {
  const session = await requireAuth()
  
  if (!allowedRoles.includes(session.user.role)) {
    redirect("/unauthorized")
  }

  return session
}

export async function requireAdmin() {
  return requireRole(["ADMIN"])
}

export async function requireStaff() {
  return requireRole(["ADMIN", "MODERATOR", "VENDOR"])
}

export async function requireCustomer() {
  return requireRole(["CUSTOMER"])
}