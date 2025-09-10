// hooks/use-auth.ts
"use client"

import { useSession } from "next-auth/react"
import { UserRole } from "@prisma/client"

export function useAuth() {
  const { data: session, status } = useSession()
  
  const isLoading = status === "loading"
  const isAuthenticated = !!session
  const user = session?.user
  
  const hasRole = (roles: UserRole | UserRole[]) => {
    if (!user) return false
    const rolesArray = Array.isArray(roles) ? roles : [roles]
    return rolesArray.includes(user.role)
  }

  const isAdmin = hasRole("ADMIN")
  const isStaff = hasRole(["ADMIN", "MODERATOR", "VENDOR"])
  const isCustomer = hasRole("CUSTOMER")

  return {
    session,
    user,
    isLoading,
    isAuthenticated,
    hasRole,
    isAdmin,
    isStaff,
    isCustomer,
  }
}