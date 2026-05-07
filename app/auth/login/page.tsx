'use client'

import { Button, Card, CardContent, CardHeader } from "@heroui/react"
import { signIn } from "next-auth/react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "motion/react"

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" className="mr-2 inline-block">
    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
    </g>
  </svg>
)

export default function Login() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (status === "loading") return

        if (session) {
            router.push("/dashboard")
        }
    }, [session, status, router])

    const handleLogin = () => {
        setIsLoading(true)
        signIn("google")
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Background Gradient */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" 
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                className="w-full max-w-md z-10"
            >
                <Card className="w-full shadow-2xl bg-background/60 backdrop-blur-xl border border-default-200 overflow-hidden">
                    {/* Top gradient highlight for the card */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
                    
                    <CardHeader className="flex flex-col gap-2 items-center justify-center pt-10 pb-4 relative">
                        <motion.div 
                            initial={{ rotate: -15, scale: 0.8 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                            className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4"
                        >
                            <span className="text-3xl font-black text-primary">SPK</span>
                        </motion.div>
                        <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
                        <p className="text-sm text-default-500 text-center">Sign in to continue your productivity journey</p>
                    </CardHeader>
                    <CardContent className="py-8 px-6">
                        <Button 
                            variant="outline"
                            className="w-full font-medium h-14 group"
                            onClick={handleLogin}
                            isDisabled={isLoading}
                        >
                            {!isLoading && <GoogleIcon />}
                            <span className="group-hover:translate-x-1 transition-transform">
                                {isLoading ? "Loading..." : "Continue with Google"}
                            </span>
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}