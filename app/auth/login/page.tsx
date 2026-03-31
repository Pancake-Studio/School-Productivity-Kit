'use client'

import { Button } from "@heroui/react"
import { signIn } from "next-auth/react"

export default function Login() {
    return (
        <>
            <h1>Login</h1>
            <Button onClick={() => signIn("google")}>
                Login with Google
            </Button>
        </>
    )
}