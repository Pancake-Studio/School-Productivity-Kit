"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Mail, Camera, Save, CheckCircle2, Shield, UserCircle2, Sparkles } from "lucide-react"
import { updateProfile } from "./actions"
import * as LR from "@uploadcare/blocks"

// Register Uploadcare Blocks is now handled inside useEffect to prevent SSR issues

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      'lr-config': any;
      'lr-file-uploader-regular': any;
    }
  }
}

interface ProfileClientProps {
  user: {
    displayName: string
    avatarUrl: string | null
    email: string
  }
}

export default function ProfileClient({ user: initialUser }: ProfileClientProps) {
  const [displayName, setDisplayName] = useState(initialUser.displayName)
  const [avatarUrl, setAvatarUrl] = useState(initialUser.avatarUrl)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const uploaderRef = useRef<any>(null)

  useEffect(() => {
    // Register blocks on mount
    LR.registerBlocks(LR)

    const handleUpload = (e: any) => {
      const file = e.detail.data?.[0]
      if (file && file.status === "success") {
        setAvatarUrl(file.cdnUrl)
      }
    }

    const uploader = uploaderRef.current
    if (uploader) {
      uploader.addEventListener("data-output", handleUpload)
    }

    return () => {
      if (uploader) {
        uploader.removeEventListener("data-output", handleUpload)
      }
    }
  }, [])

  const handleSave = async () => {
    setLoading(true)
    setSuccess(false)
    
    const result = await updateProfile({ 
      displayName, 
      avatarUrl: avatarUrl || undefined 
    })
    
    if (result.success) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } else {
      alert(result.error)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen mesh-bg pb-20 pt-8 px-4 overflow-hidden relative">
      {/* Ambient Decorations */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[100px] rounded-full -z-10" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        {/* ── Header Section ── */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group p-1"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-[2.8rem] opacity-20 group-hover:opacity-30 blur transition duration-1000" />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 p-10 rounded-[2.5rem] bg-white/70 dark:bg-black/20 backdrop-blur-3xl border border-white/20 dark:border-white/10 shadow-2xl">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <Shield className="w-4 h-4 text-primary animate-bounce-slow" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Security & Identity</span>
              </div>
              <h1 className="text-4xl font-black text-foreground tracking-tight mb-2">
                ตั้งค่าโปรไฟล์
              </h1>
              <p className="text-default-600 dark:text-default-400 font-medium max-w-md">จัดการตัวตนของคุณและข้อมูลการเข้าถึงระบบให้ทันสมัยอยู่เสมอ</p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <div className="text-3xl font-black text-foreground">Verified</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-primary">Account Status</div>
              </div>
              <div className="h-12 w-[1px] bg-default-200 dark:bg-white/10" />
              <div className="p-4 rounded-2xl bg-white/10 border border-default-200 dark:border-white/10">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── Left Column: Avatar & Quick Info ── */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4 space-y-6"
          >
            <div className="relative p-10 rounded-[3rem] bg-white/60 dark:bg-white/[0.04] backdrop-blur-3xl border border-white/20 dark:border-white/10 flex flex-col items-center gap-8 shadow-xl overflow-hidden group">
               <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-primary/10 to-transparent opacity-50" />
               
               <div className="relative pt-4">
                 <AvatarLarge src={avatarUrl} name={displayName} />
                 <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                        const shadowRoot = uploaderRef.current?.shadowRoot;
                        const uploadBtn = shadowRoot?.querySelector('button');
                        if (uploadBtn) uploadBtn.click();
                    }}
                    className="absolute bottom-2 right-2 p-4 rounded-2xl bg-primary text-white shadow-xl shadow-primary/30 border-2 border-background z-20 hover:bg-primary/90 transition-all cursor-pointer"
                  >
                    <Camera className="w-5 h-5" />
                  </motion.button>
               </div>

               <div className="text-center relative z-10">
                 <h3 className="text-2xl font-black text-foreground tracking-tight">{displayName}</h3>
                 <p className="text-default-600 dark:text-default-400 font-bold flex items-center justify-center gap-2 mt-1">
                   <Mail className="w-4 h-4 text-primary" />
                   {initialUser.email}
                 </p>
               </div>

               <div className="w-full grid grid-cols-2 gap-3 mt-4 relative z-10">
                 <div className="p-4 rounded-2xl bg-white/10 dark:bg-white/5 border border-default-200 dark:border-white/10 text-center">
                   <div className="text-xs font-black text-default-600 dark:text-default-400 uppercase tracking-tighter mb-1">Role</div>
                   <div className="text-sm font-black text-primary">Staff</div>
                 </div>
                 <div className="p-4 rounded-2xl bg-white/10 dark:bg-white/5 border border-default-200 dark:border-white/10 text-center">
                   <div className="text-xs font-black text-default-600 dark:text-default-400 uppercase tracking-tighter mb-1">Status</div>
                   <div className="text-sm font-black text-success">Active</div>
                 </div>
               </div>

               {/* Hidden Uploadcare Uploader */}
               <div className="hidden">
                 <lr-config
                   ctx-name="my-uploader"
                   pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY}
                 />
                 <lr-file-uploader-regular
                   ctx-name="my-uploader"
                   ref={uploaderRef}
                 />
               </div>
            </div>

            <div className="p-6 rounded-[2rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
               <div className="flex items-center gap-3 mb-3">
                 <Sparkles className="w-5 h-5 text-primary" />
                 <span className="text-sm font-black uppercase tracking-widest text-primary">Pro Tip</span>
               </div>
               <p className="text-xs text-default-600 dark:text-default-400 leading-relaxed font-bold">
                 ใช้รูปโปรไฟล์ที่เป็นทางการเพื่อให้เพื่อนร่วมงานระบุตัวตนของคุณได้ง่ายขึ้นในระบบ และช่วยสร้างความเป็นมืออาชีพในสถานศึกษา
               </p>
            </div>
          </motion.div>

          {/* ── Right Column: Configuration Form ── */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-8"
          >
            <div className="p-10 rounded-[3rem] bg-white/60 dark:bg-white/[0.04] backdrop-blur-3xl border border-white/20 dark:border-white/10 shadow-xl relative overflow-hidden">
               <div className="flex items-center gap-4 mb-10">
                 <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                   <UserCircle2 className="w-6 h-6 text-primary" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-foreground tracking-tight uppercase">ข้อมูลพื้นฐาน</h3>
                    <p className="text-xs text-default-500 font-bold">ข้อมูลที่แสดงบนบัตรประจำตัวดิจิทัลของคุณ</p>
                 </div>
               </div>

               <div className="space-y-8">
                 <div className="space-y-3">
                   <label className="text-xs font-black uppercase tracking-[0.2em] text-default-600 dark:text-default-400 ml-2 flex items-center gap-2">
                     <User className="w-3.5 h-3.5" />
                     ชื่อ-นามสกุล (Display Name)
                   </label>
                   <InputVanilla 
                      placeholder="กรอกชื่อของคุณ..." 
                      value={displayName} 
                      onChange={(e: any) => setDisplayName(e.target.value)}
                   />
                   <p className="text-[10px] text-default-600 dark:text-default-400 font-bold ml-2">ชื่อนี้จะปรากฏในรายงาน กิจกรรม และหน้าทำเนียบบุคลากร</p>
                 </div>

                 <div className="space-y-3">
                   <label className="text-xs font-black uppercase tracking-[0.2em] text-default-600 dark:text-default-400 ml-2 flex items-center gap-2">
                     <Mail className="w-3.5 h-3.5" />
                     อีเมล (Email Address)
                   </label>
                   <div className="relative group">
                     <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                        <Mail className="w-5 h-5 text-default-500" />
                     </div>
                     <input 
                       value={initialUser.email}
                       disabled
                       className="w-full h-16 pl-14 pr-6 rounded-3xl bg-default-50 dark:bg-white/[0.02] border border-default-200 dark:border-white/10 outline-none font-black text-default-600 dark:text-default-400 cursor-not-allowed opacity-60"
                     />
                   </div>
                   <p className="text-[10px] text-primary/70 font-black italic ml-2">* ผูกกับบัญชี Google Workspace ขององค์กร ไม่สามารถเปลี่ยนแปลงได้</p>
                 </div>

                 <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-default-100 dark:border-white/10">
                    <AnimatePresence>
                      {success && (
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-success/10 border border-success/20 text-success font-black text-sm"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                          บันทึกข้อมูลเรียบร้อยแล้ว
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <div className="flex-1" />
                    
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={loading}
                      onClick={handleSave}
                      className="w-full sm:w-auto px-10 py-5 rounded-3xl bg-primary text-white font-black shadow-2xl shadow-primary/40 flex items-center justify-center gap-3 hover:bg-primary/90 transition-all disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          บันทึกการเปลี่ยนแปลง
                        </>
                      )}
                    </motion.button>
                 </div>
               </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        lr-file-uploader-regular {
          --cfg-pubkey: "${process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY}";
        }
      `}</style>
    </div>
  )
}

// ── Shared Sub-Components (Vanilla Style) ──

function InputVanilla({ placeholder, value, onChange }: any) {
  return (
    <div className="relative group">
      <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-primary transition-colors">
        <User className="w-5 h-5 text-default-500 group-focus-within:text-primary transition-colors" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full h-16 pl-14 pr-6 rounded-3xl bg-white/60 dark:bg-white/[0.03] border border-default-200 dark:border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-bold placeholder:text-default-500 dark:placeholder:text-default-400 shadow-xl text-foreground"
      />
    </div>
  )
}

function AvatarLarge({ src, name }: any) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 blur-3xl opacity-30 bg-primary rounded-full group-hover:opacity-50 transition-opacity" />
      <div className="w-48 h-48 rounded-[3.5rem] p-2 bg-gradient-to-br from-default-200 dark:from-white/20 to-transparent border border-default-200 dark:border-white/10 relative z-10 shadow-2xl">
        <div className="w-full h-full rounded-[2.8rem] overflow-hidden bg-default-100 dark:bg-[#1a1a1a] shadow-inner">
          {src ? (
            <img src={src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={name} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-7xl font-black text-default-400 dark:text-default-500 uppercase">
              {name?.charAt(0)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
