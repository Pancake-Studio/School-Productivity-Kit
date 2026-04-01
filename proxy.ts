import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

export async function proxy(req: NextRequest) {
    const token = await getToken({ req })
    const isProfileRoute = req.nextUrl.pathname === "/complete-profile"

    if (token?.email && !token.isProfileComplete) {
        // Token says incomplete — verify against DB before redirecting
        // Prevents stale JWT from causing redirect loops
        const dbUser = await prisma.user.findUnique({
            where: { email: token.email as string },
            select: { isProfileComplete: true },
        })

        const actuallyComplete = dbUser?.isProfileComplete ?? false

        if (!actuallyComplete && !isProfileRoute) {
            return NextResponse.redirect(new URL("/complete-profile", req.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!api|_next|favicon.ico|auth).*)"],
}