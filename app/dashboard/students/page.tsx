import { getStudentRecords } from "./actions"
import { checkPermission } from "@/lib/tenant"
import { PERMISSIONS } from "@/lib/rbac"
import StudentsClient from "./students-client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBookOpen } from "@fortawesome/free-solid-svg-icons"

export default async function StudentsPage() {
  const [recordsResult, canManageStudents] = await Promise.all([
    getStudentRecords(),
    checkPermission(PERMISSIONS.MANAGE_STUDENT_RECORDS),
  ])

  const students = recordsResult.success && recordsResult.data ? recordsResult.data.students : []
  const classrooms = recordsResult.success && recordsResult.data ? recordsResult.data.classrooms : []

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-500/10 text-indigo-500">
                <FontAwesomeIcon icon={faBookOpen} className="text-lg" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">ทะเบียนนักเรียน</h1>
        </div>
        <p className="text-sm text-[var(--text-muted)] ml-[52px]">ข้อมูลนักเรียน ห้องเรียน และผู้ปกครอง</p>
      </div>
      
      <StudentsClient 
        initialStudents={students} 
        classrooms={classrooms}
        canManage={canManageStudents} 
      />
    </div>
  )
}
