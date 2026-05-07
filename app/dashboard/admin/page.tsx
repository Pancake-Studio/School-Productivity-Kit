import { requirePermission } from "@/lib/tenant"
import { PERMISSIONS } from "@/lib/rbac"
import AdminClient from "./admin-client"
import { getDepartments, getStaffWithPermissions } from "./actions"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faShield } from "@fortawesome/free-solid-svg-icons"

export default async function AdminSettingsPage() {
  await requirePermission(PERMISSIONS.MANAGE_DEPARTMENTS)
  
  const [deptsResult, staffResult] = await Promise.all([
    getDepartments(),
    getStaffWithPermissions()
  ])

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-rose-500/10 text-rose-500">
                <FontAwesomeIcon icon={faShield} className="text-lg" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">การตั้งค่าผู้ดูแลระบบ</h1>
        </div>
        <p className="text-sm text-[var(--text-muted)] ml-[52px]">จัดการโครงสร้างองค์กรและกำหนดสิทธิ์การใช้งานบุคลากร</p>
      </div>

      <AdminClient 
        initialDepartments={(deptsResult.success ? deptsResult.data : []) || []} 
        initialStaff={(staffResult.success ? staffResult.data : []) || []}
      />
    </div>
  )
}
