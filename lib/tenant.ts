import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { PrismaClient, Role } from "@prisma/client"
import { PermissionKey, hasInheritedPermission } from "./rbac"

export class UnauthorizedError extends Error {
  constructor(message = "กรุณาเข้าสู่ระบบก่อนใช้งาน") {
    super(message)
    this.name = "UnauthorizedError"
  }
}

export class NoSchoolError extends Error {
  constructor(message = "คุณยังไม่ได้เข้าร่วมหรือสร้างโรงเรียนในระบบ") {
    super(message)
    this.name = "NoSchoolError"
  }
}

export class ForbiddenError extends Error {
  constructor(message = "คุณไม่มีสิทธิ์ในการเข้าถึงส่วนนี้") {
    super(message)
    this.name = "ForbiddenError"
  }
}

/**
 * Middleware utility for Server Actions and API Routes.
 * Automatically validates the user's session and resolves their School Context.
 * 
 * @returns {Promise<{ db: PrismaClient, session: any, tenantUserId: string, role: Role, schoolId: string }>}
 */
export async function requireTenantDb() {
  const session = await auth()
  
  if (!session?.user) {
    throw new UnauthorizedError()
  }

  if (!session.user.schoolId) {
    throw new NoSchoolError()
  }

  const schoolId = session.user.schoolId;

  // 1. Fetch the Google Sub from the GlobalUser
  const globalUser = await prisma.globalUser.findUnique({
    where: { id: session.user.id },
    select: { googleSub: true }
  })

  if (!globalUser) {
    throw new UnauthorizedError("ไม่พบข้อมูลผู้ใช้ส่วนกลาง")
  }

  // 2. Find the exact user by matching the googleSub and schoolId
  const tenantUser = await prisma.user.findFirst({
    where: {
      schoolId: schoolId,
      googleAccounts: {
        some: { googleSub: globalUser.googleSub }
      }
    },
    select: { id: true, role: true }
  })

  if (!tenantUser) {
    throw new UnauthorizedError("ไม่พบบัญชีผู้ใช้ของคุณในโรงเรียนนี้")
  }
  
  return { 
    db: prisma, 
    session, 
    tenantUserId: tenantUser.id, 
    role: tenantUser.role,
    schoolId
  }
}

/**
 * Validates if the current user has a specific permission.
 * Checks inherited role defaults first, then checks explicit overrides in the database.
 */
export async function requirePermission(permission: PermissionKey) {
  const { db, session, tenantUserId, role, schoolId } = await requireTenantDb()

  // 1. Check if the role inherently has this permission
  if (hasInheritedPermission(role, permission)) {
    return { db, session, tenantUserId, role, schoolId }
  }

  // 2. If not inherited, check explicit database overrides
  const explicitPermission = await db.permission.findUnique({
    where: {
      userId_permissionKey: {
        userId: tenantUserId,
        permissionKey: permission,
      }
    }
  })

  if (!explicitPermission) {
    throw new ForbiddenError()
  }

  return { db, session, tenantUserId, role, schoolId }
}

/**
 * Safe version of requirePermission that returns a boolean for UI conditional rendering.
 * Does not throw errors.
 */
export async function checkPermission(permission: PermissionKey): Promise<boolean> {
  try {
    const { tenantUserId, role, db } = await requireTenantDb()
    
    if (hasInheritedPermission(role, permission)) {
      return true
    }

    const explicitPermission = await db.permission.findUnique({
      where: {
        userId_permissionKey: {
          userId: tenantUserId,
          permissionKey: permission,
        }
      }
    })

    return !!explicitPermission
  } catch (error) {
    return false
  }
}
