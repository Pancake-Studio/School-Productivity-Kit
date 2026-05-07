import { getTeacherDirectory } from "./actions"
import { checkPermission } from "@/lib/tenant"
import { PERMISSIONS } from "@/lib/rbac"
import TeachersClient from "./teachers-client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSchool } from "@fortawesome/free-solid-svg-icons"

export default async function TeachersPage() {
  const [directoryResult, canManageDirectory] = await Promise.all([
    getTeacherDirectory(),
    checkPermission(PERMISSIONS.MANAGE_TEACHER_DIRECTORY),
  ])

  const staff = directoryResult.success && directoryResult.data ? directoryResult.data.staff : []
  const departments = directoryResult.success && directoryResult.data ? directoryResult.data.departments : []

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-500">
                <FontAwesomeIcon icon={faSchool} className="text-lg" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">ทำเนียบบุคลากร</h1>
        </div>
        <p className="text-sm text-[var(--text-muted)] ml-[52px]">รายชื่อผู้บริหาร ครู และบุคลากรของโรงเรียน</p>
      </div>
      
      <TeachersClient 
        initialStaff={staff} 
        departments={departments}
        canManage={canManageDirectory} 
      />
    </div>
  )
}
