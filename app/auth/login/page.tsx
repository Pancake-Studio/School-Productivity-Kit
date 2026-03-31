'use client'

import { Button } from "@heroui/react"
import { signIn } from "next-auth/react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Login() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === "loading") return

        if (session) {
            router.push("/dashboard")
        }
    }, [session, status, router])

    return (
        <>
            <h1>Login</h1>
            <Button onClick={() => signIn("google")}>
                Login with Google
            </Button>
        </>
    )
}