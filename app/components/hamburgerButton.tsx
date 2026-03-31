"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface HamburgerToggle {
    isOpen: boolean;
    onToggle: (open: boolean) => void;
    defaultOpen: boolean;
}

export function HamburgerButton({ isOpen, onToggle, defaultOpen = false }: HamburgerToggle) {
    const [open, setOpen] = useState(defaultOpen)

    const toggle = () => {
        setOpen(!open)
        onToggle(!isOpen)
    }

    return (
        <button
            onClick={toggle}
            className="flex flex-col items-center justify-center gap-[5px] w-10 h-10 rounded-md border border-border bg-transparent cursor-pointer"
            aria-label="Menu"
        >
            <span className={cn(
                "block w-[18px] h-[2px] bg-foreground rounded-sm transition-all duration-250 origin-center",
                isOpen && "translate-y-[7px] rotate-45"
            )} />
            <span className={cn(
                "block w-[18px] h-[2px] bg-foreground rounded-sm transition-all duration-250",
                isOpen && "opacity-0"
            )} />
            <span className={cn(
                "block w-[18px] h-[2px] bg-foreground rounded-sm transition-all duration-250 origin-center",
                isOpen && "-translate-y-[7px] -rotate-45"
            )} />
        </button>
    )
}