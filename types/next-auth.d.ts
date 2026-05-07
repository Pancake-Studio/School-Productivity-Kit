import NextAuth from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            email: string
            image: string
            name: string
            schoolId: string | null
        }
    }
    interface Profile {
        email_verified?: boolean;
        sub: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        globalUserId: string
        schoolId: string | null
    }
}
