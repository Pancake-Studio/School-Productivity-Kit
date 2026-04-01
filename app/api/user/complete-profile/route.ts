import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { invalidateUserCache } from "@/lib/userCache"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { firstName, lastName } = await req.json()

    await prisma.user.upsert({
        where: { email: session.user.email },
        update: {
            firstName,
            lastName,
            isProfileComplete: true,
        },
        create: {
            email: session.user.email,
            firstName,
            lastName,
            picture: session.user.image ?? null,
            emailVerified: true,
            isProfileComplete: true,
        },
    })

    invalidateUserCache(session.user.email)

    return NextResponse.json({ ok: true })
}