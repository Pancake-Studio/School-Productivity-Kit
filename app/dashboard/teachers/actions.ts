"use server"

import { requirePermission } from "@/lib/tenant"
import { PERMISSIONS } from "@/lib/rbac"
import { Role } from "@prisma/client"

export async function getTeacherDirectory() {
  try {
    const { db, schoolId } = await requirePermission(PERMISSIONS.VIEW_TEACHER_DIRECTORY)

    // Fetch all users who are not students, along with their department
    const staff = await db.user.findMany({
      where: {
        schoolId,
        role: {
          not: Role.STUDENT
        }
      },
      include: {
        department: true,
        googleAccounts: {
          select: {
            email: true,
          }
        }
      },
      orderBy: [
        { role: 'asc' },
        { displayName: 'asc' }
      ]
    })

    const departments = await db.department.findMany({
      where: { schoolId },
      orderBy: { name: 'asc' }
    })

    return { 
      success: true, 
      data: {
        staff,
        departments
      } 
    }
  } catch (error: any) {
    return { success: false, error: error.message || "ไม่สามารถดึงข้อมูลบุคลากรได้" }
  }
}

export async function updateStaffInfo(userId: string, data: { displayName?: string, departmentId: string | null, role?: string }) {
  try {
    const { db, schoolId } = await requirePermission(PERMISSIONS.MANAGE_TEACHER_DIRECTORY)

    // Verify user belongs to same school
    const user = await db.user.findFirst({ where: { id: userId, schoolId } })
    if (!user) throw new Error("ไม่พบบุคลากรในโรงเรียนนี้")

    if (data.departmentId) {
      // Verify department belongs to same school
      const dept = await db.department.findFirst({ where: { id: data.departmentId, schoolId } })
      if (!dept) throw new Error("ไม่พบแผนกในโรงเรียนนี้")
    }

    await db.user.update({
      where: { id: userId },
      data: { 
        displayName: data.displayName || undefined,
        departmentId: data.departmentId,
        role: data.role as Role || undefined
      }
    })

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" }
  }
}
