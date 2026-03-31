"use client"

import Navbar from "../components/navbar"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession()
    const router = useRouter()
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        if (!session) {
            router.push("/")
        }
    }, [session])
    return (
        <div className="pl-14">
            <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            <div className={cn(
                "transition-all duration-300",
                menuOpen ? "pl-40" : "pl-2"
            )}>
                {children}
            </div>
        </div>
    )
};