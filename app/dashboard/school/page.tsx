"use client"

import { motion } from "motion/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSchool, faMapLocationDot, faUsers, faGraduationCap } from "@fortawesome/free-solid-svg-icons"
import { Card } from "@heroui/react"

export default function School() {
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
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-500">
                        <FontAwesomeIcon icon={faSchool} className="text-lg" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">โรงเรียนของฉัน</h1>
                </div>
                <p className="text-sm text-[var(--text-muted)] ml-[52px]">ข้อมูลโรงเรียนและรายละเอียดสำคัญ</p>
            </motion.div>

            {/* School Card - Clean */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
            >
                <Card className="w-full items-stretch md:flex-row overflow-hidden border border-[var(--card-border)] bg-[var(--surface-elevated)] shadow-none">
                    <div className="relative z-10 flex flex-col md:flex-row items-stretch w-full p-2">
                        <div className="relative h-[140px] w-full shrink-0 overflow-hidden sm:h-[120px] sm:w-[120px] flex items-center justify-center bg-[var(--surface-subtle)] rounded-xl m-4 md:m-0 md:mr-4">
                            <img
                                alt="School Logo"
                                className="pointer-events-none h-20 w-20 object-contain select-none"
                                loading="lazy"
                                src="https://suntisuk.ac.th/_files_school/55100582/data/55100582_0_20190906-090600.png"
                            />
                        </div>
                        <div className="flex flex-1 flex-col gap-2 p-4 md:pl-2 justify-center">
                            <h2 className="text-2xl font-bold text-[var(--foreground)] m-0">
                                โรงเรียนสันติสุขพิทยาคม
                            </h2>
                            <p className="text-sm text-[var(--text-muted)] leading-relaxed m-0">
                                45 หมู่ 8 ตำบลดู่พงษ์ อำเภอสันติสุข จังหวัดน่าน เขตพื้นที่การศึกษามัธยมศึกษาน่าน เขต 2
                            </p>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* School Info Cards */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6"
            >
                {[
                    {
                        icon: faMapLocationDot,
                        label: "ที่ตั้ง",
                        value: "อ.สันติสุข จ.น่าน",
                        colorClass: "text-blue-500",
                        bgClass: "bg-blue-500/10",
                    },
                    {
                        icon: faUsers,
                        label: "สังกัด",
                        value: "สพม.น่าน เขต 2",
                        colorClass: "text-indigo-500",
                        bgClass: "bg-indigo-500/10",
                    },
                    {
                        icon: faGraduationCap,
                        label: "ระดับ",
                        value: "มัธยมศึกษา",
                        colorClass: "text-emerald-500",
                        bgClass: "bg-emerald-500/10",
                    },
                ].map((info, i) => (
                    <div
                        key={info.label}
                        className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 transition-shadow hover:shadow-[var(--card-shadow)]"
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${info.bgClass} ${info.colorClass}`}>
                            <FontAwesomeIcon icon={info.icon} className="text-lg" />
                        </div>
                        <p className="text-sm text-[var(--text-muted)] font-medium mb-1">{info.label}</p>
                        <p className="text-lg font-bold text-[var(--foreground)]">{info.value}</p>
                    </div>
                ))}
            </motion.div>
        </div>
    )
}