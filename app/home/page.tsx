'use client'

import { motion } from "motion/react";
import LoginButton from '../components/loginButton';

export default function Home() {
    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col relative overflow-hidden">
            <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-6 max-w-4xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-[var(--card-border)] bg-[var(--surface-elevated)]">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-sm font-medium text-[var(--text-muted)] tracking-wide">School Productivity Kit</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight text-[var(--foreground)]">
                        Elevate your academic <br className="hidden md:block" />
                        <span className="text-[var(--accent-1)]">experience today.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-[var(--text-muted)] font-normal max-w-2xl mx-auto leading-relaxed">
                        Your ultimate companion to organize, manage, and excel. A clean and modern platform designed for students.
                    </p>

                    <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <LoginButton />
                    </div>
                </motion.div>
            </main>
        </div>
    )
}