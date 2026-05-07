"use client"

import Navbar from "../components/navbar"
import { MouseSpotlight } from "../components/mouse-spotlight"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/")
        }
    }, [status, router])

    // Loading state — prevents flash of unauthenticated content
    if (status === "loading") {
        return (
            <div className="min-h-screen mesh-bg flex items-center justify-center">
                <div className="flex flex-col items-center gap-5">
                    {/* Animated gradient spinner */}
                    <div className="relative w-12 h-12">
                        <div
                            className="absolute inset-0 rounded-full animate-spin"
                            style={{
                                background: "conic-gradient(from 0deg, transparent, var(--accent-1), var(--accent-3), transparent)",
                                mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2.5px))",
                                WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2.5px))",
                            }}
                        />
                    </div>
                    <p className="text-sm text-[var(--text-muted)] font-medium animate-pulse">กำลังโหลด...</p>
                </div>
            </div>
        )
    }

    if (!session) return null

    return (
        <div className="min-h-screen mesh-bg relative">
            {/* Mouse spotlight gimmick */}
            <MouseSpotlight />

            <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            <div className={cn("pl-0 sm:pl-14 transition-all duration-300 ease-out")}>
                <div className={cn(
                    "transition-all duration-300 ease-out",
                    menuOpen ? "pl-40" : "pl-2"
                )}>
                    {children}
                </div>
            </div>
        </div>
    )
};