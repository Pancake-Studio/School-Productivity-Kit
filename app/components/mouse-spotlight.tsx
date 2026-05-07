"use client"

import { useEffect, useRef, useCallback } from "react"

/**
 * MouseSpotlight — renders a radial glow that follows the cursor.
 * Uses requestAnimationFrame + CSS transforms for GPU-accelerated rendering.
 * Color subtly shifts based on horizontal position (indigo → violet → cyan).
 */
export function MouseSpotlight() {
    const spotlightRef = useRef<HTMLDivElement>(null)
    const posRef = useRef({ x: 0, y: 0 })
    const currentRef = useRef({ x: 0, y: 0 })
    const rafRef = useRef<number>(0)

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const animate = useCallback(() => {
        currentRef.current.x = lerp(currentRef.current.x, posRef.current.x, 0.08)
        currentRef.current.y = lerp(currentRef.current.y, posRef.current.y, 0.08)

        if (spotlightRef.current) {
            spotlightRef.current.style.transform =
                `translate(${currentRef.current.x - 300}px, ${currentRef.current.y - 300}px)`

            // Subtle hue shift based on x position
            const hueShift = ((currentRef.current.x / window.innerWidth) * 40) - 20
            spotlightRef.current.style.filter = `hue-rotate(${hueShift}deg)`
        }

        rafRef.current = requestAnimationFrame(animate)
    }, [])

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            posRef.current = { x: e.clientX, y: e.clientY }
        }

        window.addEventListener("mousemove", handleMouseMove, { passive: true })
        rafRef.current = requestAnimationFrame(animate)

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            cancelAnimationFrame(rafRef.current)
        }
    }, [animate])

    return (
        <div
            ref={spotlightRef}
            aria-hidden="true"
            className="pointer-events-none fixed top-0 left-0 z-0 opacity-0 transition-opacity duration-1000"
            style={{
                width: "var(--spotlight-size, 600px)",
                height: "var(--spotlight-size, 600px)",
                background: `radial-gradient(
                    circle,
                    var(--spotlight-color) 0%,
                    transparent 70%
                )`,
                willChange: "transform, filter",
                opacity: 1,
            }}
        />
    )
}
