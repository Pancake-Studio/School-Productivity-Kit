"use client"

import { useRef, useState, useCallback } from "react"
import { cn } from "@/lib/utils"

interface TiltCardProps {
    children: React.ReactNode
    className?: string
    glowColor?: string
    onClick?: () => void
}

/**
 * TiltCard — 3D perspective tilt card that reacts to mouse position.
 * Features:
 * - Smooth 3D tilt toward cursor
 * - Glowing border highlight that follows mouse along the card edge
 * - Spring-back animation when mouse leaves
 */
export function TiltCard({ children, className, glowColor = "var(--accent-1)", onClick }: TiltCardProps) {
    const cardRef = useRef<HTMLDivElement>(null)
    const [style, setStyle] = useState<React.CSSProperties>({})
    const [glowStyle, setGlowStyle] = useState<React.CSSProperties>({})
    const [isHovered, setIsHovered] = useState(false)

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return

        const rect = cardRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2

        // Tilt calculation — max 8 degrees
        const rotateX = ((y - centerY) / centerY) * -8
        const rotateY = ((x - centerX) / centerX) * 8

        setStyle({
            transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
            transition: "transform 0.1s ease-out",
        })

        // Glow position — follows mouse along the card
        setGlowStyle({
            background: `radial-gradient(
                300px circle at ${x}px ${y}px,
                ${glowColor}33,
                transparent 60%
            )`,
            opacity: 1,
        })
    }, [glowColor])

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false)
        setStyle({
            transform: "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
            transition: "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
        })
        setGlowStyle({ opacity: 0 })
    }, [])

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true)
    }, [])

    return (
        <div
            ref={cardRef}
            className={cn(
                "relative rounded-2xl overflow-hidden cursor-pointer group",
                "border border-(--card-border) bg-(--card-bg)",
                "shadow-[var(--card-shadow)]",
                "hover:shadow-[var(--card-hover-shadow)]",
                "transition-shadow duration-300",
                className
            )}
            style={style}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
        >
            {/* Glow overlay */}
            <div
                className="absolute inset-0 z-10 pointer-events-none rounded-2xl transition-opacity duration-300"
                style={glowStyle}
            />

            {/* Subtle border glow on hover */}
            <div
                className={cn(
                    "absolute inset-0 z-0 rounded-2xl transition-opacity duration-500 pointer-events-none",
                    isHovered ? "opacity-100" : "opacity-0"
                )}
                style={{
                    background: `linear-gradient(135deg, ${glowColor}15, transparent 50%, ${glowColor}10)`,
                }}
            />

            {/* Content */}
            <div className="relative z-20">
                {children}
            </div>
        </div>
    )
}
