"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faSchool,
    faTable,
    faClock,
    faCalendarDays,
    faArrowRight,
    faGear,
    faBolt,
    faBookOpen,
    faChartLine,
    faListCheck,
    faStar,
    faShield,
} from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState, useMemo } from "react"

const quickActions = [
    {
        icon: faSchool,
        label: "โรงเรียนของฉัน",
        sublabel: "ดูข้อมูลโรงเรียนและบุคลากร",
        href: "/dashboard/school",
        colorClass: "text-blue-500",
        bgClass: "bg-blue-500/10",
    },
    {
        icon: faTable,
        label: "จัดตารางสอน/เรียน",
        sublabel: "วางแผนตารางเรียนรายสัปดาห์",
        href: "/dashboard/timetable",
        colorClass: "text-cyan-500",
        bgClass: "bg-cyan-500/10",
    },
    {
        icon: faGear,
        label: "ตั้งค่า",
        sublabel: "ปรับแต่งการใช้งานและโปรไฟล์",
        href: "/dashboard/settings",
        colorClass: "text-slate-500",
        bgClass: "bg-slate-500/10",
    },
    {
        icon: faStar,
        label: "ข่าวสาร",
        sublabel: "อัปเดตกิจกรรมของโรงเรียน",
        href: "/dashboard/news",
        colorClass: "text-amber-500",
        bgClass: "bg-amber-500/10",
    },
    {
        icon: faSchool,
        label: "ทำเนียบบุคลากร",
        sublabel: "รายชื่อครูและผู้บริหาร",
        href: "/dashboard/teachers",
        colorClass: "text-emerald-500",
        bgClass: "bg-emerald-500/10",
    },
    {
        icon: faBookOpen,
        label: "ทะเบียนนักเรียน",
        sublabel: "ข้อมูลนักเรียนและห้องเรียน",
        href: "/dashboard/students",
        colorClass: "text-indigo-500",
        bgClass: "bg-indigo-500/10",
    },
    {
        icon: faShield,
        label: "ผู้ดูแลระบบ",
        sublabel: "ตั้งค่าฝ่ายและสิทธิ์การใช้งาน",
        href: "/dashboard/admin",
        colorClass: "text-rose-500",
        bgClass: "bg-rose-500/10",
        adminOnly: true,
    },
]

const stats = [
    {
        label: "วิชาทั้งหมด",
        value: "—",
        icon: faBookOpen,
    },
    {
        label: "คาบวันนี้",
        value: "—",
        icon: faCalendarDays,
    },
    {
        label: "งานค้าง",
        value: "—",
        icon: faListCheck,
    },
    {
        label: "คะแนนเฉลี่ย",
        value: "—",
        icon: faChartLine,
    },
]

function getGreeting(): string {
    const hour = new Date().getHours()
    if (hour < 12) return "อรุณสวัสดิ์"
    if (hour < 17) return "สวัสดีตอนบ่าย"
    return "สวัสดีตอนเย็น"
}

function formatThaiDate(): string {
    const now = new Date()
    return now.toLocaleDateString("th-TH", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })
}

export default function Menu() {
    const { data: session } = useSession()
    const router = useRouter()
    const userName = (session?.user as any)?.name?.split(" ")[0] ?? "User"
    const [currentTime, setCurrentTime] = useState("")

    useEffect(() => {
        const updateTime = () => {
            setCurrentTime(
                new Date().toLocaleTimeString("th-TH", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                })
            )
        }
        updateTime()
        const interval = setInterval(updateTime, 1000)
        return () => clearInterval(interval)
    }, [])

    const filteredActions = useMemo(() => {
        return quickActions.filter(action => {
            if (action.adminOnly) {
                return (session?.user as any)?.role === "ADMIN"
            }
            return true
        })
    }, [session?.user])

    return (
        <div className="p-4 sm:p-8 max-w-6xl mx-auto">
            {/* Welcome Hero - Clean Design */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-10 rounded-2xl p-8 sm:p-10 border border-[var(--card-border)] bg-[var(--surface-elevated)]"
            >
                <div className="flex flex-col gap-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface-subtle)] border border-[var(--card-border)] mb-2 w-fit">
                        <FontAwesomeIcon icon={faBolt} className="text-blue-500 text-xs" />
                        <span className="text-xs font-medium text-[var(--text-muted)]">School Productivity Kit</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--foreground)]">
                        {getGreeting()}, {userName}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-[var(--text-muted)] mt-2">
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faCalendarDays} className="text-sm opacity-70" />
                            <span className="text-sm font-medium">{formatThaiDate()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faClock} className="text-sm opacity-70" />
                            <span className="text-sm font-mono font-medium tabular-nums">{currentTime}</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Quick Access Cards */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mb-10"
            >
                <div className="flex items-center gap-3 mb-5">
                    <h2 className="text-lg font-bold text-[var(--foreground)]">เข้าถึงอย่างรวดเร็ว</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredActions.map((action, i) => (
                        <div
                            key={action.href}
                            onClick={() => router.push(action.href)}
                            className="group cursor-pointer rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 transition-all hover:shadow-[var(--card-hover-shadow)] hover:border-blue-500/30 flex flex-col gap-4"
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${action.bgClass} ${action.colorClass}`}>
                                <FontAwesomeIcon icon={action.icon} />
                            </div>

                            <div className="flex-1">
                                <h3 className="text-base font-bold mb-1 text-[var(--foreground)]">{action.label}</h3>
                                <p className="text-sm text-[var(--text-muted)]">{action.sublabel}</p>
                            </div>

                            <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-subtle)] group-hover:text-blue-500 transition-colors">
                                <span>เปิด</span>
                                <FontAwesomeIcon
                                    icon={faArrowRight}
                                    className="text-xs transition-transform group-hover:translate-x-1"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Stats Overview Section */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="mb-10"
            >
                <div className="flex items-center gap-3 mb-5">
                    <h2 className="text-lg font-bold text-[var(--foreground)]">ภาพรวม</h2>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <div
                            key={stat.label}
                            className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 transition-shadow hover:shadow-[var(--card-shadow)]"
                        >
                            <div className="w-10 h-10 rounded-xl bg-[var(--surface-subtle)] text-[var(--text-muted)] flex items-center justify-center mb-4">
                                <FontAwesomeIcon icon={stat.icon} className="text-lg" />
                            </div>
                            <div className="text-2xl font-bold mb-1 text-[var(--foreground)]">{stat.value}</div>
                            <div className="text-sm text-[var(--text-muted)] font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Motivational banner */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="rounded-2xl border border-[var(--card-border)] bg-[var(--surface-elevated)] p-6 flex items-center gap-4"
            >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-xl shrink-0">
                    <FontAwesomeIcon icon={faStar} />
                </div>
                <div>
                    <p className="text-sm font-bold text-[var(--foreground)] mb-1">เคล็ดลับวันนี้</p>
                    <p className="text-sm text-[var(--text-muted)]">
                        วางแผนการเรียนล่วงหน้าช่วยให้คุณจัดการเวลาได้ดีขึ้น ลองใช้ตารางเรียนเพื่อจัดระเบียบคาบเรียนของคุณ ✨
                    </p>
                </div>
            </motion.div>
        </div>
    )
}