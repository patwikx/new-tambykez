// Role-based component wrapper
import { useAuth } from "@/hooks/use-auth"
import { UserRole } from "@prisma/client"
import { ReactNode } from "react"

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: UserRole[]
  fallback?: ReactNode
  requireAll?: boolean
}

export function RoleGuard({ 
  children, 
  allowedRoles, 
  fallback = null,
  requireAll = false 
}: RoleGuardProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div> // Or your loading component
  }

  if (!user) {
    return fallback
  }

  const hasAccess = requireAll 
    ? allowedRoles.every(role => user.role === role)
    : allowedRoles.includes(user.role)

  return hasAccess ? <>{children}</> : <>{fallback}</>
}