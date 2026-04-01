import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"
import { getUserByEmail } from "@/lib/userCache"

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],

    callbacks: {
        async signIn({ account, profile }) {
            if (account?.provider !== "google" || !profile?.email_verified) {
                return false
            }

            const existingUser = await getUserByEmail(profile.email!)

            if (!existingUser) {
                const [firstName, ...rest] = (profile.name ?? "").split(" ")

                try {
                    await prisma.user.create({
                        data: {
                            email: profile.email!,
                            firstName: firstName ?? null,
                            lastName: rest.join(" ") || null,
                            picture: (profile as any).picture ?? null,
                            emailVerified: true,
                            isProfileComplete: false,
                        },
                    })
                } catch (e) {
                    console.error("Failed to create user:", e)
                    return false
                }
            }

            return true
        },

        async jwt({ token, account, profile, trigger }) {
            // First sign-in — account & profile are only available once
            if (account && profile) {
                const dbUser = await getUserByEmail(token.email!)
                if (dbUser) {
                    token.userId = dbUser.id
                    token.isProfileComplete = dbUser.isProfileComplete
                    token.picture = dbUser.picture
                }
            }

            // Called when update() is triggered from the client
            if (trigger === "update") {
                const dbUser = await getUserByEmail(token.email as string)
                if (dbUser) {
                    token.isProfileComplete = dbUser.isProfileComplete
                    token.picture = dbUser.picture
                }
            }

            // Returning user with stale token — re-sync if still marked incomplete
            if (!token.isProfileComplete && token.email) {
                const dbUser = await getUserByEmail(token.email as string)
                if (dbUser) {
                    token.userId = dbUser.id
                    token.isProfileComplete = dbUser.isProfileComplete
                    token.picture = dbUser.picture ?? token.picture
                }
            }

            return token
        },

        async session({ session, token }) {
            session.user.id = token.userId as string
            session.user.image = token.picture as string
            session.user.isProfileComplete = token.isProfileComplete as boolean
            return session
        },
    },

    pages: {
        signIn: "/auth/signin",
    },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }