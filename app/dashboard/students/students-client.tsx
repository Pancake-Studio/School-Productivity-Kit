"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input, Button, Modal, ModalDialog, ModalHeader, ModalBody, ModalFooter, ModalBackdrop, ModalContainer, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react"
import { Search, MapPin, Mail, Settings2, GraduationCap, Phone, Users, IdCard } from "lucide-react"
import { updateStudentProfile } from "./actions"

export default function StudentsClient({ 
  initialStudents, 
  classrooms,
  canManage 
}: { 
  initialStudents: any[]
  classrooms: any[]
  canManage: boolean 
}) {
  const [students, setStudents] = useState(initialStudents)
  const [search, setSearch] = useState("")
  const [classFilter, setClassFilter] = useState<string>("ALL")
  
  // Modal State
  const [isOpen, setIsOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.displayName.toLowerCase().includes(search.toLowerCase()) || 
                            student.studentProfile?.studentCode?.toLowerCase().includes(search.toLowerCase()) ||
                            student.googleAccounts?.[0]?.email.toLowerCase().includes(search.toLowerCase())
      const matchesClass = classFilter === "ALL" || student.studentProfile?.classroomId === classFilter

      return matchesSearch && matchesClass
    })
  }, [students, search, classFilter])

  const openEditModal = (student: any) => {
    setEditingStudent(student)
    setIsOpen(true)
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const data = {
      studentCode: formData.get("studentCode") as string,
      studentNumber: formData.get("studentNumber") ? parseInt(formData.get("studentNumber") as string) : undefined,
      studyTrack: formData.get("studyTrack") as string,
      classroomId: formData.get("classroomId") as string || undefined,
      parentName: formData.get("parentName") as string,
      parentContact: formData.get("parentContact") as string,
    }
    
    // Nullify empty strings
    const cleanData = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v === "" ? null : v]))
    
    const result = await updateStudentProfile(editingStudent.id, cleanData)
    
    if (result.success) {
      window.location.reload() // Simple refresh
    } else {
      alert(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Filters Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="ค้นหาชื่อ, รหัสนักเรียน หรือ อีเมล..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-background/60 backdrop-blur-md border border-white/10"
        />
        <select 
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          className="bg-background/60 backdrop-blur-md border border-white/10 rounded-xl px-4 h-10 text-sm focus:outline-none focus:border-primary transition-colors"
        >
          <option value="ALL">ทุกห้องเรียน</option>
          <option value="UNASSIGNED">ยังไม่มีห้องเรียน</option>
          {classrooms.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Modern Table */}
      <div className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-background/60 backdrop-blur-xl shadow-xl">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-default-500 uppercase bg-default-100/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-medium rounded-tl-xl">ข้อมูลนักเรียน</th>
              <th className="px-6 py-4 font-medium">รหัส / ห้องเรียน</th>
              <th className="px-6 py-4 font-medium">ข้อมูลผู้ปกครอง</th>
              {canManage && <th className="px-6 py-4 font-medium text-right rounded-tr-xl">จัดการ</th>}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={canManage ? 4 : 3} className="px-6 py-12 text-center text-default-400">
                    ไม่พบข้อมูลนักเรียนที่ตรงกับเงื่อนไข
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, idx) => (
                  <motion.tr 
                    key={student.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                          {student.displayName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{student.displayName}</div>
                          <div className="text-xs text-default-400 flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" />
                            {student.googleAccounts?.[0]?.email || "ไม่มีอีเมล"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-sm font-medium">
                          <IdCard className="w-4 h-4 text-default-500" />
                          {student.studentProfile?.studentCode || "-"}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-default-500">
                          <MapPin className="w-3.5 h-3.5" />
                          {student.studentProfile?.classroom?.name || "ยังไม่มีห้องเรียน"} 
                          {student.studentProfile?.studentNumber ? `(เลขที่ ${student.studentProfile.studentNumber})` : ""}
                        </div>
                        {student.studentProfile?.studyTrack && (
                          <div className="text-[10px] text-primary bg-primary/10 self-start px-1.5 py-0.5 rounded mt-1">
                            {student.studentProfile.studyTrack}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-sm">
                          <Users className="w-4 h-4 text-default-500" />
                          {student.studentProfile?.parentName || "-"}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-default-500">
                          <Phone className="w-3.5 h-3.5" />
                          {student.studentProfile?.parentContact || "-"}
                        </div>
                      </div>
                    </td>
                    {canManage && (
                      <td className="px-6 py-4 text-right">
                        <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/20" onPress={() => openEditModal(student)}>
                          แก้ไขประวัติ
                        </Button>
                      </td>
                    )}
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <ModalBackdrop className="backdrop-blur-sm" />
        <ModalContainer>
          <ModalDialog className="bg-background/80 backdrop-blur-2xl border border-white/10">
            <form onSubmit={handleUpdate}>
              <ModalHeader className="flex flex-col gap-1 border-b border-white/5">แก้ไขประวัตินักเรียน</ModalHeader>
              <ModalBody className="py-6">
                <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-lg">
                    {editingStudent?.displayName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold">{editingStudent?.displayName}</div>
                    <div className="text-xs text-default-400">{editingStudent?.googleAccounts?.[0]?.email}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="studentCode"
                    label="รหัสนักเรียน"
                    placeholder="เช่น 00001"
                    defaultValue={editingStudent?.studentProfile?.studentCode || ""}
                  />
                  <Input
                    name="studentNumber"
                    type="number"
                    label="เลขที่"
                    placeholder="เช่น 1"
                    defaultValue={editingStudent?.studentProfile?.studentNumber?.toString() || ""}
                  />
                </div>
                
                <Input
                  name="studyTrack"
                  label="สายการเรียน / วิชาเอก"
                  placeholder="เช่น วิทย์-คณิต"
                  className="mt-2"
                  defaultValue={editingStudent?.studentProfile?.studyTrack || ""}
                />
                
                <div className="flex flex-col gap-2 mt-2">
                  <label className="text-sm font-medium text-default-600">ห้องเรียน</label>
                  <select 
                    name="classroomId"
                    defaultValue={editingStudent?.studentProfile?.classroomId || ""}
                    className="bg-default-100 border border-transparent rounded-xl px-4 h-14 text-sm focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="">ไม่ระบุห้องเรียน</option>
                    {classrooms.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4 mt-2">
                  <Input
                    name="parentName"
                    label="ชื่อผู้ปกครอง"
                    placeholder="ระบุชื่อผู้ปกครอง..."
                    defaultValue={editingStudent?.studentProfile?.parentName || ""}
                  />
                  <Input
                    name="parentContact"
                    label="เบอร์ติดต่อผู้ปกครอง"
                    placeholder="เช่น 081-xxx-xxxx"
                    defaultValue={editingStudent?.studentProfile?.parentContact || ""}
                  />
                </div>
              </ModalBody>
              <ModalFooter className="border-t border-white/5">
                <Button className="text-danger" variant="ghost" onPress={() => setIsOpen(false)}>
                  ยกเลิก
                </Button>
                <Button className="bg-primary text-white" type="submit" isDisabled={loading}>
                  {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                </Button>
              </ModalFooter>
            </form>
          </ModalDialog>
        </ModalContainer>
      </Modal>
    </div>
  )
}
