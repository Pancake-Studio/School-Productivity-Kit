"use client"

import { useState } from "react"
import { 
  Card, CardHeader, Button, Input, 
  Tabs, Tab, Chip,
  Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
  Switch
} from "@heroui/react"
import { 
  Building2, Trash2, 
  Mail, Settings2
} from "lucide-react"
import { 
  createDepartment, deleteDepartment, 
  toggleUserPermission
} from "./actions"
import { PERMISSIONS } from "@/lib/rbac"

interface AdminClientProps {
  initialDepartments: any[]
  initialStaff: any[]
}

export default function AdminClient({ initialDepartments, initialStaff }: AdminClientProps) {
  const [departments, setDepartments] = useState(initialDepartments)
  const [staff, setStaff] = useState(initialStaff)
  const [newDeptName, setNewDeptName] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCreateDept = async () => {
    if (!newDeptName) return
    setLoading(true)
    const result = await createDepartment(newDeptName)
    if (result.success) {
      setDepartments([...departments, result.data])
      setNewDeptName("")
    } else {
      alert(result.error)
    }
    setLoading(false)
  }

  const handleDeleteDept = async (id: string) => {
    if (!confirm("ยืนยันการลบแผนกนี้?")) return
    const result = await deleteDepartment(id)
    if (result.success) {
      setDepartments(departments.filter(d => d.id !== id))
    } else {
      alert(result.error)
    }
  }

  const handleTogglePermission = async (userId: string, permissionKey: string, granted: boolean) => {
    const result = await toggleUserPermission(userId, permissionKey, granted)
    if (result.success) {
      setStaff(staff.map(s => {
        if (s.id === userId) {
          const newPerms = granted 
            ? [...s.permissions, { permissionKey }]
            : s.permissions.filter((p: any) => p.permissionKey !== permissionKey)
          return { ...s, permissions: newPerms }
        }
        return s
      }))
    } else {
      alert(result.error)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Tabs 
        aria-label="Admin Sections" 
        variant="primary"
        className="w-full"
      >
        <Tab
          key="departments"
          aria-label="จัดการฝ่าย/แผนก"
        >
          <div className="pt-4 space-y-6">
            <Card className="bg-background/60 backdrop-blur-xl border-white/10">
              <CardHeader className="flex justify-between items-center px-6 py-6 pb-2">
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold">สร้างฝ่ายใหม่</h3>
                  <p className="text-sm text-default-500">เพิ่มโครงสร้างหน่วยงานภายในโรงเรียน</p>
                </div>
              </CardHeader>
              <div className="px-6 pb-6">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-default-700">ชื่อฝ่าย</label>
                  <div className="flex gap-3">
                    <Input 
                      placeholder="เช่น ฝ่ายวิชาการ, กลุ่มสาระฯ ภาษาไทย"
                      value={newDeptName}
                      onChange={(e) => setNewDeptName(e.target.value)}
                      className="max-w-md"
                    />
                    <Button 
                      className="bg-primary text-white" 
                      onPress={handleCreateDept}
                    >
                      {loading ? "กำลังเพิ่ม..." : "เพิ่ม"}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map((dept) => (
                <Card key={dept.id} className="bg-background/40 backdrop-blur-md border-white/5 hover:border-primary/20 transition-all">
                  <div className="flex flex-row items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{dept.name}</h4>
                        <p className="text-xs text-default-500">{dept._count?.users || 0} บุคลากร</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="text-danger hover:bg-danger/10 border-transparent"
                      onPress={() => handleDeleteDept(dept.id)}
                    >
                      ลบ
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Tab>

        <Tab
          key="permissions"
          aria-label="จัดการสิทธิ์บุคลากร"
        >
          <div className="pt-4">
            <div className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-background/60 backdrop-blur-xl shadow-xl">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-default-500 uppercase bg-default-100/50 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 font-medium">ชื่อบุคลากร</th>
                    <th className="px-6 py-4 font-medium">บทบาทหลัก</th>
                    <th className="px-6 py-4 font-medium">ฝ่าย/แผนก</th>
                    <th className="px-6 py-4 font-medium text-right">สิทธิ์เพิ่มเติม</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((person) => (
                    <tr key={person.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{person.displayName}</span>
                          <span className="text-xs text-default-400">{person.googleAccounts?.[0]?.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Chip size="sm" variant="primary">
                          {person.role}
                        </Chip>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-default-600">{person.department?.name || "ไม่ระบุ"}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Dropdown>
                          <DropdownTrigger
                            className="text-primary hover:bg-primary/10 border border-transparent px-3 py-1 rounded-md text-sm cursor-pointer transition-colors inline-flex items-center h-auto min-w-0"
                          >
                            แก้ไขสิทธิ์
                          </DropdownTrigger>
                          <DropdownMenu aria-label="Permissions">
                            {(Object.entries(PERMISSIONS) as any[]).map(([key, value]) => {
                              const isGranted = person.permissions.some((p: any) => p.permissionKey === value)
                              return (
                                <DropdownItem key={value} textValue={key}>
                                  <div className="flex items-center justify-between gap-4 w-full">
                                    <span className="text-xs">{key}</span>
                                    <input 
                                      type="checkbox"
                                      checked={isGranted}
                                      onChange={(e) => handleTogglePermission(person.id, value, e.target.checked)}
                                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                  </div>
                                </DropdownItem>
                              )
                            })}
                          </DropdownMenu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  )
}
