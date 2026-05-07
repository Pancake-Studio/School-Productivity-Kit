"use client"

import { Button } from "@heroui/react"
import { useRouter } from "next/navigation"

export default function LoginButton() {
    const router = useRouter()

    return (
        <Button 
            variant="primary"
            className="font-medium text-lg px-8 py-6 rounded-full"
            onClick={() => router.push("/auth/login")}
        >
            Get Started
        </Button>
    )
}