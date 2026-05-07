"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Mail, Settings2, ShieldCheck,
  GraduationCap, Briefcase, X,
  MoreVertical, Edit2, Building
} from "lucide-react"
import { updateStaffInfo } from "./actions"

// ── Role Configuration ──
const ROLE_CONFIG: Record<string, {
  label: string
  icon: any
  colorClass: string
  bgClass: string
}> = {
  ADMIN: {
    label: "ผู้ดูแลระบบ",
    icon: ShieldCheck,
    colorClass: "text-rose-500",
    bgClass: "bg-rose-500/10",
  },
  DEPARTMENT_HEAD: {
    label: "หัวหน้าหมวด",
    icon: Briefcase,
    colorClass: "text-amber-500",
    bgClass: "bg-amber-500/10",
  },
  TEACHER: {
    label: "ครูผู้สอน",
    icon: GraduationCap,
    colorClass: "text-blue-500",
    bgClass: "bg-blue-500/10",
  },
  REGISTRAR: {
    label: "นายทะเบียน",
    icon: Settings2,
    colorClass: "text-purple-500",
    bgClass: "bg-purple-500/10",
  },
}

export default function TeachersClient({
  initialStaff,
  departments,
  canManage,
}: {
  initialStaff: any[]
  departments: any[]
  canManage: boolean
}) {
  const [staff, setStaff] = useState(initialStaff)
  const [search, setSearch] = useState("")
  const [deptFilter, setDeptFilter] = useState<string>("ALL")
  const [roleFilter, setRoleFilter] = useState<string>("ALL")

  const [selectedTeacher, setSelectedTeacher] = useState<any>(null)
  const [editingTeacher, setEditingTeacher] = useState<any>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  // Filters Logic
  const filteredStaff = useMemo(() => {
    return staff.filter((person) => {
      const matchesSearch =
        person.displayName.toLowerCase().includes(search.toLowerCase()) ||
        person.googleAccounts?.[0]?.email.toLowerCase().includes(search.toLowerCase())
      const matchesDept = deptFilter === "ALL" || person.departmentId === deptFilter
      const matchesRole = roleFilter === "ALL" || person.role === roleFilter
      return matchesSearch && matchesDept && matchesRole
    })
  }, [staff, search, deptFilter, roleFilter])

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canManage || !editingTeacher) return

    const formData = new FormData(e.currentTarget)
    const displayName = formData.get("displayName") as string
    const departmentId = (formData.get("departmentId") as string) || null
    const role = formData.get("role") as string

    setIsUpdating(true)
    const result = await updateStaffInfo(editingTeacher.id, { displayName, departmentId, role })
    setIsUpdating(false)

    if (result.success) {
      setStaff((prev) =>
        prev.map((p) =>
          p.id === editingTeacher.id
            ? {
              ...p,
              displayName,
              departmentId,
              role,
              department: departments.find((d) => d.id === departmentId) || null,
            }
            : p,
        ),
      )
      setEditingTeacher(null)
    } else {
      alert(result.error)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* ── Filters Area ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[var(--text-muted)]" />
          </div>
          <input
            type="text"
            placeholder="ค้นหาชื่อ หรือ อีเมล..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors text-[var(--foreground)] placeholder:text-[var(--text-muted)]"
          />
        </div>

        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="w-full h-11 px-4 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors text-[var(--foreground)] appearance-none cursor-pointer"
        >
          <option value="ALL">ทุกหมวดวิชา/แผนก</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full h-11 px-4 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors text-[var(--foreground)] appearance-none cursor-pointer"
        >
          <option value="ALL">ทุกบทบาทหน้าที่</option>
          {Object.entries(ROLE_CONFIG).map(([key, config]) => (
            <option key={key} value={key}>
              {config.label}
            </option>
          ))}
        </select>
      </div>

      {/* ── Staff Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredStaff.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="col-span-full py-20 text-center flex flex-col items-center gap-3 border border-dashed border-[var(--card-border)] rounded-2xl bg-[var(--surface-subtle)]"
            >
              <Search className="w-8 h-8 text-[var(--text-muted)] opacity-50" />
              <p className="text-sm font-medium text-[var(--text-muted)]">ไม่พบบุคลากรที่ตรงกับเงื่อนไข</p>
              <button
                onClick={() => { setSearch(""); setDeptFilter("ALL"); setRoleFilter("ALL"); }}
                className="text-sm text-emerald-500 hover:text-emerald-600 font-medium mt-2"
              >
                ล้างตัวกรอง
              </button>
            </motion.div>
          ) : (
            filteredStaff.map((person, idx) => (
              <StaffCard
                key={person.id}
                person={person}
                idx={idx}
                canManage={canManage}
                onOpenDetail={() => setSelectedTeacher(person)}
                onEdit={() => setEditingTeacher(person)}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* ── Detail Modal ── */}
      <AnimatePresence>
        {selectedTeacher && (
          <ModalVanilla
            onClose={() => setSelectedTeacher(null)}
            title="รายละเอียดบุคลากร"
          >
            <div className="flex flex-col items-center py-6">
              <AvatarLarge src={selectedTeacher.avatarUrl} name={selectedTeacher.displayName} />
              <h2 className="text-xl font-bold text-[var(--foreground)] mt-4">{selectedTeacher.displayName}</h2>
              <div className="text-sm text-[var(--text-muted)] mb-6">
                @{selectedTeacher.displayName.toLowerCase().replace(/\s+/g, '')}
              </div>

              <div className="flex gap-2 mb-6">
                <BadgeVanilla
                  role={selectedTeacher.role}
                  label={ROLE_CONFIG[selectedTeacher.role]?.label}
                />
              </div>

              <div className="w-full space-y-3">
                <InfoRow
                  icon={<Mail className="w-4 h-4" />}
                  label="อีเมลติดต่อ"
                  value={selectedTeacher.googleAccounts?.[0]?.email || "ไม่ทราบอีเมล"}
                />
                <InfoRow
                  icon={<Building className="w-4 h-4" />}
                  label="หมวดวิชา / แผนก"
                  value={selectedTeacher.department?.name || "ยังไม่มีสังกัด"}
                />
                <InfoRow
                  icon={<ShieldCheck className="w-4 h-4" />}
                  label="รหัสบุคลากร"
                  value={selectedTeacher.id.substring(0, 8).toUpperCase()}
                />
              </div>
            </div>
          </ModalVanilla>
        )}
      </AnimatePresence>

      {/* ── Edit Modal ── */}
      <AnimatePresence>
        {editingTeacher && (
          <ModalVanilla
            onClose={() => setEditingTeacher(null)}
            title="แก้ไขข้อมูล"
          >
            <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[var(--text-muted)]">ชื่อ-นามสกุล</label>
                <input
                  name="displayName"
                  defaultValue={editingTeacher.displayName}
                  required
                  className="w-full h-11 px-4 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors text-[var(--foreground)]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[var(--text-muted)]">หมวดวิชา / แผนก</label>
                <select
                  name="departmentId"
                  defaultValue={editingTeacher.departmentId || ""}
                  className="w-full h-11 px-4 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors text-[var(--foreground)] appearance-none cursor-pointer"
                >
                  <option value="">ยังไม่มีสังกัด</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[var(--text-muted)]">ตำแหน่ง</label>
                <select
                  name="role"
                  defaultValue={editingTeacher.role}
                  className="w-full h-11 px-4 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors text-[var(--foreground)] appearance-none cursor-pointer"
                >
                  {Object.entries(ROLE_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingTeacher(null)}
                  className="flex-1 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--surface-subtle)] text-sm font-bold hover:bg-[var(--card-bg)] transition-colors text-[var(--foreground)]"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold transition-colors disabled:opacity-50"
                >
                  {isUpdating ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                </button>
              </div>
            </form>
          </ModalVanilla>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Sub-Components ──

function StaffCard({ person, idx, canManage, onOpenDetail, onEdit }: any) {
  const roleConfig = ROLE_CONFIG[person.role] || ROLE_CONFIG.TEACHER
  const RoleIcon = roleConfig.icon
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.05 } }}
      onClick={onOpenDetail}
      className="group cursor-pointer rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 transition-all hover:shadow-[var(--card-hover-shadow)] hover:border-emerald-500/30 flex flex-col gap-4 relative"
    >
      {/* Header Row: Avatar + Role Badge & Menu */}
      <div className="flex justify-between items-start">
        <div className="flex gap-3 items-center">
          <AvatarSmall src={person.avatarUrl} name={person.displayName} />
          <div>
            <h3 className="text-base font-bold text-[var(--foreground)] line-clamp-1">
              {person.displayName}
            </h3>
            <div className="text-xs text-[var(--text-muted)] line-clamp-1">
               {person.department?.name || "ยังไม่มีสังกัดแผนก"}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2" ref={menuRef}>
          {canManage && (
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-subtle)] hover:text-[var(--foreground)] transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 top-full mt-1 w-36 rounded-xl border border-[var(--card-border)] bg-[var(--surface-elevated)] shadow-lg overflow-hidden py-1 z-10"
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); onEdit(); setShowMenu(false); }}
                      className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-[var(--surface-subtle)] transition-colors text-[var(--foreground)]"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      แก้ไข
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <div className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 w-fit ${roleConfig.bgClass} ${roleConfig.colorClass}`}>
          <RoleIcon className="w-3 h-3" />
          {roleConfig.label}
        </div>
        <div className="text-xs text-[var(--text-muted)] truncate flex items-center gap-1.5">
            <Mail className="w-3 h-3" />
            {person.googleAccounts?.[0]?.email?.split('@')[0] || "No email"}
        </div>
      </div>
    </motion.div>
  )
}

function ModalVanilla({ children, onClose, title }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-sm bg-[var(--surface-elevated)] rounded-2xl border border-[var(--card-border)] shadow-xl overflow-hidden relative z-10"
      >
        <div className="px-5 py-4 flex items-center justify-between border-b border-[var(--card-border)]">
          <h2 className="text-base font-bold text-[var(--foreground)]">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-subtle)] hover:text-[var(--foreground)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-5 pb-5">
          {children}
        </div>
      </motion.div>
    </div>
  )
}

function BadgeVanilla({ role, label }: any) {
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.TEACHER
  return (
    <div className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 ${config.bgClass} ${config.colorClass}`}>
      <config.icon className="w-3.5 h-3.5" />
      {label}
    </div>
  )
}

function InfoRow({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)]">
      <div className="w-8 h-8 rounded-lg bg-[var(--surface-subtle)] flex items-center justify-center text-[var(--text-muted)]">
        {icon}
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{label}</div>
        <div className="text-sm font-medium text-[var(--foreground)] truncate">{value}</div>
      </div>
    </div>
  )
}

function AvatarLarge({ src, name }: any) {
  return (
    <div className="w-24 h-24 rounded-2xl border border-[var(--card-border)] bg-[var(--surface-subtle)] overflow-hidden flex items-center justify-center">
      {src ? (
        <img src={src} className="w-full h-full object-cover" alt={name} />
      ) : (
        <div className="text-3xl font-bold text-[var(--text-muted)]">
          {name?.charAt(0)}
        </div>
      )}
    </div>
  )
}

function AvatarSmall({ src, name }: any) {
  return (
    <div className="w-10 h-10 rounded-xl border border-[var(--card-border)] bg-[var(--surface-subtle)] overflow-hidden flex-shrink-0 flex items-center justify-center">
      {src ? (
        <img src={src} className="w-full h-full object-cover" alt={name} />
      ) : (
        <div className="text-lg font-bold text-[var(--text-muted)]">
          {name?.charAt(0)}
        </div>
      )}
    </div>
  )
}