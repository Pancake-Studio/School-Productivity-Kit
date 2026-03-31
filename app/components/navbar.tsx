'use client'

import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"
import { HamburgerButton } from "./hamburgerButton"
import "m3-ripple/ripple.css";
import { Avatar } from "@heroui/react";
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";

interface NavbarProps {
    menuOpen: boolean
    setMenuOpen: (open: boolean) => void
}

export default function Navbar({ menuOpen, setMenuOpen }: NavbarProps) {
    const { data: session } = useSession()
    const userName = session?.user?.name
    const userImage = session?.user?.image
    const router = useRouter()

    const menuItems = [
        { icon: "🏠", label: "Menu", href: "/menu" },
        { icon: "📊", label: "Time Table", href: "/timetable" },
        { icon: "⚙️", label: "Settings", href: "/settings" },
    ]

    const handleMenuClick = (href: string) => {
        router.push(`/dashboard/${href.toLowerCase()}`)
    }

    return (
        <>
            <div className={cn(" z-20 bg-(--navbar-background)/30 backdrop-blur-xl sticky top-0 px-72 py-4 border-b")}>
                <div className="grid grid-cols-3 items-center">
                    <div>
                        <HamburgerButton isOpen={menuOpen} onToggle={(open: boolean) => setMenuOpen(open)} defaultOpen={menuOpen} />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">SPK</h1>
                    </div>
                    <div className="flex gap-x-2 justify-end">
                        <ThemeToggle />
                        <Avatar>
                            <Avatar.Image alt="John Doe" src={userImage as string} />
                            <Avatar.Fallback>{userName as string}</Avatar.Fallback>
                        </Avatar>
                    </div>
                </div>
            </div>
            <div className={cn(
                "z-20 bg-(--navbar-background)/30 backdrop-blur-xl fixed top-16 left-0 h-screen border-r flex flex-col py-4 gap-2 transition-all duration-300 overflow-hidden",
                menuOpen ? "w-52" : "w-14"
            )}>
                {menuItems.map((item) => (
                    <button key={item.label} onClick={() => {
                        setMenuOpen(false)
                        handleMenuClick(item.href)
                    }} className="flex items-center gap-3 px-4 py-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-md w-full">
                        <span className="text-xl shrink-0">{item.icon}</span>
                        <span className={cn(
                            "transition-all duration-300 whitespace-nowrap",
                            menuOpen ? "opacity-100" : "opacity-0"
                        )}>
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>
        </>
    )
};