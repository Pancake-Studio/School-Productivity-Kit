"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardFooter, Input, Button } from "@heroui/react"
import { Building2, Key, Link as LinkIcon } from "lucide-react"
import { validateAndCreateSchool } from "./actions"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

export default function OnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const result = await validateAndCreateSchool(formData)
    
    if (result.success) {
      // Hard refresh to update session and db instances
      window.location.href = "/dashboard/menu"
    } else {
      setError(result.error || "เกิดข้อผิดพลาดในการตรวจสอบ")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background">
      {/* Background Mesh */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-[40rem] w-[40rem] bg-primary/20 rounded-full blur-3xl opacity-50 animate-pulse-slow" />
        <div className="h-[30rem] w-[30rem] bg-secondary/20 rounded-full blur-3xl opacity-50 absolute right-[-10%] top-[-10%]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md px-4 relative z-10"
      >
        <Card className="bg-background/60 backdrop-blur-xl border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit}>
            <CardHeader className="flex flex-col gap-2 pt-8 px-8 pb-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center mb-2 shadow-lg">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">สร้างพื้นที่การเรียนรู้ของคุณ</h1>
              <p className="text-sm text-default-500">
                กรอกรหัสยืนยันที่ได้รับจาก Ferrum Group เพื่อเปิดใช้งานระบบโรงเรียน
              </p>
            </CardHeader>
            <hr className="border-t border-white/5 w-full" />
            <div className="px-8 py-6 flex flex-col gap-5">
              {error && (
                <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm text-center">
                  {error}
                </div>
              )}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-default-700">ชื่อ-นามสกุล ผู้บริหาร (Full Name)</label>
                  <Input
                    name="fullName"
                    placeholder="เช่น นายกิตติคุณ ใจดี"
                    required
                    className="bg-default-100/50 rounded-xl"
                  />
                  <p className="text-[10px] text-default-400">ชื่อนี้จะใช้แสดงผลในระบบและเอกสารต่างๆ</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-default-700">ชื่อโรงเรียน (School Name)</label>
                  <Input
                    name="schoolName"
                    placeholder="เช่น โรงเรียนตัวอย่างวิทยา"
                    required
                    className="bg-default-100/50 rounded-xl"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-default-700">ตัวย่อภาษาอังกฤษ (Slug)</label>
                  <Input
                    name="slug"
                    placeholder="เช่น example-school"
                    required
                    className="bg-default-100/50 rounded-xl"
                  />
                  <p className="text-[10px] text-default-400">ใช้สำหรับสร้างลิงก์เฉพาะของโรงเรียน ห้ามมีเว้นวรรค</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-default-700">รหัสยืนยัน (Access Code)</label>
                  <Input
                    name="accessCode"
                    placeholder="กรอกรหัสจาก Ferrum Group"
                    required
                    className="bg-default-100/50 rounded-xl"
                  />
                </div>
              </div>
            </div>
            <CardFooter className="px-8 pb-8 pt-2 flex flex-col gap-4">
              <Button 
                type="submit" 
                className={`w-full font-medium shadow-lg shadow-primary/30 bg-primary text-white ${loading ? "opacity-70 pointer-events-none" : ""}`}
                size="lg"
              >
                {loading ? "กำลังดำเนินการ..." : "ยืนยันการสร้างโรงเรียน"}
              </Button>

              <Button
                variant="ghost"
                className="w-full border-danger text-danger hover:bg-danger/10"
                onPress={() => signOut({ callbackUrl: "/auth/login" })}
              >
                <div className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  <span>ออกจากระบบ (Sign Out)</span>
                </div>
              </Button>
              <p className="text-xs text-center text-default-400">
                หากยังไม่มีรหัสยืนยัน กรุณาติดต่อ <a href="https://t.me/FerrumGroup" className="text-primary hover:underline font-semibold">@FerrumGroup</a> หรือ <span className="text-primary">support@ferrum.com</span> เท่านั้น
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
