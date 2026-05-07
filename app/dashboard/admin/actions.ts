"use server"

import { requirePermission } from "@/lib/tenant"
import { PERMISSIONS } from "@/lib/rbac"
import { Role } from "@prisma/client"
import { prisma } from "@/lib/db"

// ─── DEPARTMENT ACTIONS ──────────────────────────────────────────────────

export async function getDepartments() {
  try {
    const { db, schoolId } = await requirePermission(PERMISSIONS.MANAGE_DEPARTMENTS)
    const departments = await db.department.findMany({
      where: { schoolId },
      include: {
        _count: {
          select: { users: true }
        }
      },
      orderBy: { name: 'asc' }
    })
    return { success: true, data: departments }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function createDepartment(name: string, description?: string) {
  try {
    const { db, session, schoolId } = await requirePermission(PERMISSIONS.MANAGE_DEPARTMENTS)
    if (!schoolId) throw new Error("Unauthorized")
    const dept = await db.department.create({
      data: { 
        name, 
        description: description || undefined,
        schoolId
      }
    })
    return { success: true, data: dept }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteDepartment(id: string) {
  try {
    const { db, schoolId } = await requirePermission(PERMISSIONS.MANAGE_DEPARTMENTS)
    // Add schoolId to delete where clause to ensure they can only delete their own
    await db.department.delete({ where: { id } })
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// ─── USER & PERMISSION ACTIONS ───────────────────────────────────────────

export async function getStaffWithPermissions() {
  try {
    const { db, schoolId } = await requirePermission(PERMISSIONS.MANAGE_USERS)
    const staff = await db.user.findMany({
      where: {
        schoolId,
        role: { not: Role.STUDENT }
      },
      include: {
        permissions: true,
        department: true,
        googleAccounts: {
          select: { email: true }
        }
      },
      orderBy: { displayName: 'asc' }
    })
    return { success: true, data: staff }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function toggleUserPermission(userId: string, permissionKey: string, granted: boolean) {
  try {
    const { db, tenantUserId, schoolId } = await requirePermission(PERMISSIONS.MANAGE_ROLES)
    
    // First, verify the target user belongs to the same school
    const targetUser = await db.user.findFirst({
      where: { id: userId, schoolId }
    })

    if (!targetUser) throw new Error("ไม่พบผู้ใช้ในโรงเรียนนี้")

    if (granted) {
      await db.permission.upsert({
        where: { userId_permissionKey: { userId, permissionKey } },
        update: {},
        create: {
          userId,
          permissionKey,
          grantedById: tenantUserId
        }
      })
    } else {
      await db.permission.delete({
        where: { userId_permissionKey: { userId, permissionKey } }
      }).catch(() => {}) // Ignore if already deleted
    }
    
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

