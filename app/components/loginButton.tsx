"use client"

import { Button } from "@heroui/react"
import { useRouter } from "next/navigation"

export default function LoginButton() {
    const router = useRouter()

    return (
        <Button onClick={() => router.push("/auth/login")}>
            Login
        </Button>
    )
}