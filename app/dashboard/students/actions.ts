"use server"

import { requirePermission } from "@/lib/tenant"
import { PERMISSIONS } from "@/lib/rbac"
import { Role } from "@prisma/client"

export async function getStudentRecords() {
  try {
    const { db, schoolId } = await requirePermission(PERMISSIONS.VIEW_STUDENT_RECORDS)

    // Fetch all students and their profiles
    const students = await db.user.findMany({
      where: {
        schoolId,
        role: Role.STUDENT
      },
      include: {
        studentProfile: {
          include: {
            classroom: true
          }
        },
        googleAccounts: {
          select: { email: true }
        }
      },
      orderBy: { displayName: 'asc' }
    })

    const classrooms = await db.classroom.findMany({
      where: { schoolId },
      orderBy: { name: 'asc' }
    })

    return { 
      success: true, 
      data: {
        students,
        classrooms
      } 
    }
  } catch (error: any) {
    return { success: false, error: error.message || "ไม่สามารถดึงข้อมูลนักเรียนได้" }
  }
}

export async function updateStudentProfile(
  userId: string, 
  data: { studentCode?: string; studentNumber?: number; studyTrack?: string; classroomId?: string; parentName?: string; parentContact?: string }
) {
  try {
    const { db, schoolId } = await requirePermission(PERMISSIONS.MANAGE_STUDENT_RECORDS)

    // Verify user belongs to same school
    const user = await db.user.findFirst({ where: { id: userId, schoolId } })
    if (!user) throw new Error("ไม่พบนักเรียนในโรงเรียนนี้")

    // Upsert student profile
    await db.studentProfile.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data
      }
    })

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" }
  }
}
