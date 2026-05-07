import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { invalidateUserCache } from "@/lib/userCache"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const session = await auth()

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { displayName } = await req.json()

    await prisma.user.update({
        where: { id: session.user.id },
        data: {
            displayName,
            avatarUrl: session.user.image ?? null,
        },
    })

    invalidateUserCache(session.user.email)

    return NextResponse.json({ ok: true })
}