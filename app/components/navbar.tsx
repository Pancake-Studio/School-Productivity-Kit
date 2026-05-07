'use client'

import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"
import { HamburgerButton } from "./hamburgerButton"
import "m3-ripple/ripple.css";
import { useSession, signOut } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation";
import { ArrowRightFromSquare, Gear, Persons } from "@gravity-ui/icons";
import { Avatar, Dropdown, Label } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faTable, faSchool } from '@fortawesome/free-solid-svg-icons';

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
    const pathname = usePathname()

    const menuItems = [
        { icon: (<FontAwesomeIcon icon={faHouse} />), label: "หน้าแรก", href: "/menu" },
        { icon: (<FontAwesomeIcon icon={faSchool} />), label: "โรงเรียนของฉัน", href: "/school" },
        { icon: (<FontAwesomeIcon icon={faTable} />), label: "จัดตารางสอน/เรียน", href: "/timetable" },
    ]

    const handleMenuClick = (href: string) => {
        router.push(`/dashboard${href.toLowerCase()}`)
    }

    // Check if a menu item is active
    const isActive = (href: string) => {
        const fullPath = `/dashboard${href.toLowerCase()}`
        return pathname === fullPath || pathname.startsWith(fullPath + "/")
    }

    const handleDropdownAction = (key: any) => {
        const sKey = String(key)
        switch (sKey) {
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
            <div className={cn("z-20 bg-(--navbar-background)/30 backdrop-blur-xl sticky top-0 px-4 sm:px-14 py-4 mx-2 sm:mx-40 mt-6 rounded-full border")}>
                <div className="grid grid-cols-3 items-center">
                    <div>
                        <HamburgerButton isOpen={menuOpen} onToggle={(open: boolean) => setMenuOpen(open)} defaultOpen={menuOpen} />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)]">SPK</h1>
                    </div>
                    <div className="flex gap-x-2 justify-end">
                        <ThemeToggle />
                        <Dropdown>
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
                                <Dropdown.Menu onAction={handleDropdownAction}>
                                    <Dropdown.Item id="profile" textValue="Profile">
                                        <div className="flex w-full items-center justify-between gap-2">
                                            <Label>แก้ไขโปรไฟล์</Label>
                                            <Gear className="size-3.5" />
                                        </div>
                                    </Dropdown.Item>
                                    <Dropdown.Item id="logout" textValue="Logout" variant="danger">
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
            <div className={cn(menuOpen ? " opacity-100" : "opacity-0", "sm:opacity-100")}>
                <div className={cn(
                    "z-20 bg-(--navbar-background)/30 backdrop-blur-xl fixed top-0 left-0 h-screen border-r flex flex-col py-4 gap-1 transition-all duration-300 ease-out overflow-hidden",
                    menuOpen ? "w-52" : "w-14"
                )}>
                    {menuItems.map((item) => {
                        const active = isActive(item.href)
                        return (
                            <button key={item.label} onClick={() => {
                                setMenuOpen(false)
                                handleMenuClick(item.href)
                            }} className={cn(
                                "relative flex items-center gap-3 px-4 py-2.5 rounded-md w-full transition-all duration-200",
                                active
                                    ? "bg-[var(--accent-1)]/10 text-[var(--accent-1)]"
                                    : "hover:bg-black/10 dark:hover:bg-white/10"
                            )}>
                                {/* Active indicator bar */}
                                {active && (
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[var(--accent-1)]" />
                                )}
                                <span className={cn(
                                    "text-xl shrink-0 transition-colors",
                                    active && "text-[var(--accent-1)]"
                                )}>{item.icon}</span>
                                <span className={cn(
                                    "transition-all duration-300 whitespace-nowrap font-medium",
                                    menuOpen ? "opacity-100" : "opacity-0",
                                    active && "text-[var(--accent-1)]"
                                )}>
                                    {item.label}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>
        </>
    )
}