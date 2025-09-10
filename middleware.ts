// middleware.ts
import { auth } from "@/auth"
import { NextResponse } from "next/server"


export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/products",
    "/categories",
    "/search",
    "/auth/signin",
    "/auth/signup", 
    "/auth/error",
    "/api/auth",
  ]

  // Admin/Staff only routes
  const adminRoutes = [
    "/admin",
    "/dashboard",
    "/staff",
  ]

  // Customer only routes
  const customerRoutes = [
    "/profile",
    "/orders",
    "/wishlist",
    "/cart",
  ]

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )

  // Allow access to public routes
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Redirect to signin if not authenticated
  if (!session) {
    const signInUrl = new URL("/auth/signin", req.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Check if account is active
  if (!session.user.isActive) {
    const errorUrl = new URL("/auth/error", req.url)
    errorUrl.searchParams.set("error", "AccountDeactivated")
    return NextResponse.redirect(errorUrl)
  }

  // Check admin routes
  const isAdminRoute = adminRoutes.some(route => 
    pathname.startsWith(route)
  )

  if (isAdminRoute) {
    const allowedRoles = ["ADMIN", "MODERATOR", "VENDOR"]
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }
  }

  // Check customer routes
  const isCustomerRoute = customerRoutes.some(route => 
    pathname.startsWith(route)
  )

  if (isCustomerRoute && session.user.role !== "CUSTOMER") {
    return NextResponse.redirect(new URL("/unauthorized", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
  ],
}