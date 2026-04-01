'use client'

import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"
import { HamburgerButton } from "./hamburgerButton"
import "m3-ripple/ripple.css";
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation";
import { ArrowRightFromSquare, Gear, Persons } from "@gravity-ui/icons";
import { Avatar, Dropdown, Label } from "@heroui/react";

interface NavbarProps {
    menuOpen: boolean
    setMenuOpen: (open: boolean) => void
}

export default function Navbar({ menuOpen, setMenuOpen }: NavbarProps) {
    const { data: session } = useSession()
    const userName = session?.user?.name ?? "User"
    const userEmail = session?.user?.email ?? ""
    const userImage = session?.user?.image ?? ""
    // Get initials for Avatar fallback
    const initials = userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)

    const router = useRouter()

    const menuItems = [
        { icon: "🏠", label: "Menu", href: "/menu" },
        { icon: "📊", label: "Time Table", href: "/timetable" },
        { icon: "⚙️", label: "Settings", href: "/settings" },
    ]

    const handleMenuClick = (href: string) => {
        router.push(`/dashboard${href.toLowerCase()}`)
    }

    const handleDropdownAction = (key: string) => {
        switch (key) {
            case "dashboard":
                router.push("/dashboard")
                break
            case "profile":
                router.push("/dashboard/profile")
                break
            case "settings":
                router.push("/dashboard/settings")
                break
            case "new-project":
                router.push("/dashboard/team/new")
                break
            case "logout":
                signOut({ callbackUrl: "/auth/signin" })
                break
        }
    }

    return (
        <>
            <div className={cn("z-20 bg-(--navbar-background)/30 backdrop-blur-xl sticky top-0 px-72 py-4 border-b")}>
                <div className="grid grid-cols-3 items-center">
                    <div>
                        <HamburgerButton isOpen={menuOpen} onToggle={(open: boolean) => setMenuOpen(open)} defaultOpen={menuOpen} />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">SPK</h1>
                    </div>
                    <div className="flex gap-x-2 justify-end">
                        <ThemeToggle />
                        <Dropdown onAction={(key) => handleDropdownAction(String(key))}>
                            <Dropdown.Trigger className="rounded-full">
                                <Avatar>
                                    {userImage
                                        ? <Avatar.Image alt={userName} src={userImage} />
                                        : null
                                    }
                                    <Avatar.Fallback delayMs={userImage ? 600 : 0}>
                                        {initials}
                                    </Avatar.Fallback>
                                </Avatar>
                            </Dropdown.Trigger>
                            <Dropdown.Popover>
                                <div className="px-3 pt-3 pb-1">
                                    <div className="flex items-center gap-2">
                                        <Avatar size="sm">
                                            {userImage
                                                ? <Avatar.Image alt={userName} src={userImage} />
                                                : null
                                            }
                                            <Avatar.Fallback delayMs={userImage ? 600 : 0}>
                                                {initials}
                                            </Avatar.Fallback>
                                        </Avatar>
                                        <div className="flex flex-col gap-0">
                                            <p className="text-sm leading-5 font-medium">{userName}</p>
                                            <p className="text-xs leading-none text-muted">{userEmail}</p>
                                        </div>
                                    </div>
                                </div>
                                <Dropdown.Menu>
                                    <Dropdown.Item id="dashboard" textValue="Dashboard">
                                        <Label>Dashboard</Label>
                                    </Dropdown.Item>
                                    <Dropdown.Item id="profile" textValue="Profile">
                                        <Label>Profile</Label>
                                    </Dropdown.Item>
                                    <Dropdown.Item id="settings" textValue="Settings">
                                        <div className="flex w-full items-center justify-between gap-2">
                                            <Label>Settings</Label>
                                            <Gear className="size-3.5 text-muted" />
                                        </div>
                                    </Dropdown.Item>
                                    <Dropdown.Item id="new-project" textValue="New project">
                                        <div className="flex w-full items-center justify-between gap-2">
                                            <Label>Create Team</Label>
                                            <Persons className="size-3.5 text-muted" />
                                        </div>
                                    </Dropdown.Item>
                                    <Dropdown.Item id="logout" textValue="Logout" variant="danger" onClick={() => signOut({ callbackUrl: "/" })}>
                                        <div className="flex w-full items-center justify-between gap-2">
                                            <Label>Log Out</Label>
                                            <ArrowRightFromSquare className="size-3.5 text-danger" />
                                        </div>
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown.Popover>
                        </Dropdown>
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
}