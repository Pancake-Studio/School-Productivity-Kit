import { prisma } from "@/lib/prisma"

const cache = new Map<string, { data: CachedUser; expiresAt: number }>()
const TTL_MS = 1000 * 60 * 5 // 5 minutes

type CachedUser = {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
    picture: string | null
    isProfileComplete: boolean
}

type CacheEntry = {
    data: CachedUser
    expiresAt: number
}

export async function getUserByEmail(email: string): Promise<CachedUser | null> {
    const cached = cache.get(email)

    if (cached && cached.expiresAt > Date.now()) {
        return cached.data
    }

    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            picture: true,
            isProfileComplete: true,
        },
    })

    if (user) {
        cache.set(email, { data: user, expiresAt: Date.now() + TTL_MS })
    }

    return user
}

export function invalidateUserCache(email: string) {
    cache.delete(email)
}