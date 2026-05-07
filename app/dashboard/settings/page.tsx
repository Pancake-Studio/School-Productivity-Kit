"use client"

import { motion } from "motion/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGear, faPalette, faBell, faShieldHalved, faUser, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { useTheme } from "../../theme-provider"

export default function Settings() {
    const { theme, toggleTheme } = useTheme()

    const sections = [
        {
            title: "บัญชีผู้ใช้",
            items: [
                { icon: faUser, label: "โปรไฟล์", desc: "แก้ไขชื่อและข้อมูลส่วนตัว", colorClass: "text-blue-500", bgClass: "bg-blue-500/10" },
                { icon: faShieldHalved, label: "ความเป็นส่วนตัว", desc: "จัดการความปลอดภัย", colorClass: "text-emerald-500", bgClass: "bg-emerald-500/10" },
            ]
        },
        {
            title: "การปรับแต่ง",
            items: [
                { icon: faPalette, label: "ธีม", desc: "เปลี่ยนโหมดสี", colorClass: "text-rose-500", bgClass: "bg-rose-500/10", isTheme: true },
                { icon: faBell, label: "การแจ้งเตือน", desc: "ตั้งค่าการแจ้งเตือน", colorClass: "text-amber-500", bgClass: "bg-amber-500/10" },
            ]
        },
    ]

    return (
        <div className="p-4 sm:p-8 max-w-4xl mx-auto">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-500/10 text-slate-500">
                        <FontAwesomeIcon icon={faGear} className="text-lg" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">ตั้งค่า</h1>
                </div>
                <p className="text-sm text-[var(--text-muted)] ml-[52px]">ปรับแต่งการใช้งานให้เหมาะกับคุณ</p>
            </motion.div>

            {sections.map((section, si) => (
                <motion.div key={section.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 + si * 0.1 }} className="mb-8">
                    <h2 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4 ml-1">{section.title}</h2>
                    <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden divide-y divide-[var(--card-border)]">
                        {section.items.map((item) => (
                            <button key={item.label} onClick={item.isTheme ? toggleTheme : undefined} className="w-full p-4 flex items-center gap-4 hover:bg-[var(--surface-subtle)] transition-all duration-200 text-left group cursor-pointer">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${item.bgClass} ${item.colorClass}`}>
                                    <FontAwesomeIcon icon={item.icon} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold mb-0.5 text-[var(--foreground)]">{item.label}</p>
                                    <p className="text-xs text-[var(--text-muted)] truncate">{item.desc}</p>
                                </div>
                                {item.isTheme ? (
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-xs text-[var(--text-muted)] font-medium">{theme === "dark" ? "มืด" : "สว่าง"}</span>
                                        <div className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${theme === "dark" ? "bg-blue-500" : "bg-slate-300"}`}>
                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${theme === "dark" ? "translate-x-5" : "translate-x-1"}`} />
                                        </div>
                                    </div>
                                ) : (
                                    <FontAwesomeIcon icon={faChevronRight} className="text-xs text-[var(--text-subtle)] group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                )}
                            </button>
                        ))}
                    </div>
                </motion.div>
            ))}
        </div>
    )
}