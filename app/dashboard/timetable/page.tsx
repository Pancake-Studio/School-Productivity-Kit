"use client"

import { motion } from "motion/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTable, faPlus, faInfoCircle } from "@fortawesome/free-solid-svg-icons"

const daysOfWeek = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์"]
const periods = ["1", "2", "3", "4", "5", "6", "7", "8"]

export default function Timetable() {
    return (
        <div className="p-4 sm:p-8 max-w-6xl mx-auto">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-500/10 text-cyan-500">
                        <FontAwesomeIcon icon={faTable} className="text-lg" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">จัดตารางสอน/เรียน</h1>
                </div>
                <p className="text-sm text-[var(--text-muted)] ml-[52px]">วางแผนตารางเรียนรายสัปดาห์ของคุณ</p>
            </motion.div>

            {/* Timetable Grid */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead>
                            <tr className="bg-[var(--surface-subtle)]">
                                <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--card-border)] w-16">
                                    คาบ
                                </th>
                                {daysOfWeek.map((day) => (
                                    <th
                                        key={day}
                                        className="p-4 text-sm font-bold text-[var(--foreground)] border-b border-[var(--card-border)] text-center"
                                    >
                                        {day}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {periods.map((period) => (
                                <tr key={period} className="group">
                                    <td className="p-3 text-center text-sm font-bold text-[var(--text-muted)] border-b border-[var(--card-border)] bg-[var(--surface-subtle)]/30">
                                        {period}
                                    </td>
                                    {daysOfWeek.map((day) => (
                                        <td
                                            key={`${day}-${period}`}
                                            className="p-2 border-b border-[var(--card-border)] text-center"
                                        >
                                            <div className="h-14 rounded-xl border border-dashed border-[var(--card-border)] flex items-center justify-center text-[var(--text-subtle)] hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all duration-200 cursor-pointer group/cell">
                                                <FontAwesomeIcon
                                                    icon={faPlus}
                                                    className="text-xs opacity-0 group-hover/cell:opacity-60 transition-opacity text-cyan-500"
                                                />
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Info bar */}
                <div className="p-4 flex items-center gap-3 border-t border-[var(--card-border)] bg-[var(--surface-subtle)]">
                    <FontAwesomeIcon icon={faInfoCircle} className="text-cyan-500 text-sm" />
                    <p className="text-xs text-[var(--text-muted)]">
                        คลิกที่ช่องเพื่อเพิ่มวิชา — ระบบจะบันทึกอัตโนมัติ
                    </p>
                </div>
            </motion.div>
        </div>
    )
}