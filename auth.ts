import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { prisma } from "@/lib/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== "google" || !profile?.email || !profile.sub) {
        return false
      }

      try {
        // Find or create global identity based on Google sub
        let globalUser = await prisma.globalUser.findUnique({
          where: { googleSub: profile.sub },
        })

        if (!globalUser) {
          console.log("Creating new GlobalUser for email:", profile.email)
          // Check if email already exists but with different sub (edge case)
          const existingEmail = await prisma.globalUser.findUnique({
            where: { email: profile.email },
          })
          
          if (existingEmail) {
            console.log("Updating existing email record with new sub")
            globalUser = await prisma.globalUser.update({
              where: { email: profile.email },
              data: { googleSub: profile.sub },
            })
          } else {
            console.log("Inserting new GlobalUser record")
            globalUser = await prisma.globalUser.create({
              data: {
                email: profile.email,
                googleSub: profile.sub,
              },
            })
          }
        } else {
          console.log("GlobalUser already exists:", globalUser.id)
        }

        return true
      } catch (error) {
        console.error("Authentication Error Details:", error)
        return false
      }
    },
    async jwt({ token, profile }) {
      // Upon initial login, `profile` is available.
      // We look up their GlobalUser entry to get their schoolId.
      if (profile?.sub) {
        const dbUser = await prisma.globalUser.findUnique({
          where: { googleSub: profile.sub },
          select: { id: true, schoolId: true, googleSub: true },
        })

        if (dbUser) {
          token.globalUserId = dbUser.id
          token.schoolId = dbUser.schoolId
          token.googleSub = dbUser.googleSub

          // Fetch the specific school user profile if they have one assigned
          if (dbUser.schoolId) {
            const tenantUser = await prisma.user.findFirst({
              where: {
                schoolId: dbUser.schoolId,
                googleAccounts: { some: { googleSub: dbUser.googleSub } }
              },
              select: { displayName: true, avatarUrl: true }
            })

            if (tenantUser) {
              token.name = tenantUser.displayName
              token.picture = tenantUser.avatarUrl
            }
          }
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token.globalUserId) {
        session.user.id = token.globalUserId as string
        // We use TypeScript module augmentation (in a types file) to add schoolId and googleSub to session.user
        ;(session.user as any).schoolId = token.schoolId as string | null
        ;(session.user as any).googleSub = token.googleSub as string | null
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
  },
})
