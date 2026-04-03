import NextAuth from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            email: string
            image: string
            isProfileComplete: boolean
            name: string
        }
    }
    interface Profile {
        email_verified?: boolean;
        id: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        userId: string
        picture: string | undefined
        isProfileComplete: boolean
        name: string
    }
}

