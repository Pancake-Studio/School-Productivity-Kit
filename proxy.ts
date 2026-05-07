import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/auth"

// Define protected routes that require a school assignment
const isProtectedRoute = (pathname: string) => {
  return pathname.startsWith("/dashboard") || pathname.startsWith("/admin")
}

// In this custom Next.js version, 'proxy' replaces 'middleware'
export const proxy = auth((req: any) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const hasSchool = !!req.auth?.user?.schoolId

  // 1. Root redirect logic
  if (nextUrl.pathname === "/") {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard/menu", nextUrl))
    } else {
      return NextResponse.redirect(new URL("/api/auth/signin", nextUrl))
    }
  }

  // 2. If user is accessing a protected route but not logged in, redirect to login
  if (isProtectedRoute(nextUrl.pathname) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/api/auth/signin", nextUrl))
  }

  // 3. If user is logged in, but has no school, and tries to access dashboard, force them to onboarding
  if (isLoggedIn && !hasSchool && isProtectedRoute(nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/onboarding", nextUrl))
  }

  // 4. If user is logged in and HAS a school, but accesses /onboarding, redirect to dashboard
  if (isLoggedIn && hasSchool && nextUrl.pathname === "/onboarding") {
    return NextResponse.redirect(new URL("/dashboard/menu", nextUrl))
  }

  return NextResponse.next()
})

// Configure proxy to only run on specific paths
export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}