import { Role } from "@prisma/client"

/**
 * Define all system permissions as constants to prevent typo strings.
 */
export const PERMISSIONS = {
  // ─── USER & ROLE MANAGEMENT ──────────────────────────────────────────
  MANAGE_USERS: "MANAGE_USERS",
  MANAGE_ROLES: "MANAGE_ROLES",
  
  // ─── DEPARTMENT MANAGEMENT ───────────────────────────────────────────
  MANAGE_DEPARTMENTS: "MANAGE_DEPARTMENTS",

  // ─── NEWS & ACTIVITIES ───────────────────────────────────────────────
  CREATE_NEWS: "CREATE_NEWS",
  EDIT_NEWS: "EDIT_NEWS",
  DELETE_NEWS: "DELETE_NEWS",

  // ─── TEACHER DIRECTORY ───────────────────────────────────────────────
  VIEW_TEACHER_DIRECTORY: "VIEW_TEACHER_DIRECTORY",
  MANAGE_TEACHER_DIRECTORY: "MANAGE_TEACHER_DIRECTORY",

  // ─── STUDENT RECORDS ─────────────────────────────────────────────────
  VIEW_STUDENT_RECORDS: "VIEW_STUDENT_RECORDS",
  MANAGE_STUDENT_RECORDS: "MANAGE_STUDENT_RECORDS",
  
  // ─── ADMIN SYSTEM ───────────────────────────────────────────────────
  ADMIN_SETTINGS: "ADMIN_SETTINGS",
  MANAGE_DATABASE: "MANAGE_DATABASE",
} as const;

export type PermissionKey = typeof PERMISSIONS[keyof typeof PERMISSIONS]

/**
 * Define default permissions inherited automatically by each role.
 * ADMIN implicitly has all permissions (handled in code logic),
 * but we can also explicitly list them if needed.
 */
export const ROLE_DEFAULT_PERMISSIONS: Record<Role, PermissionKey[]> = {
  ADMIN: [
    // ADMIN has bypass in the validator, but explicitly listed here for reference
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_ROLES,
    PERMISSIONS.MANAGE_DEPARTMENTS,
    PERMISSIONS.CREATE_NEWS,
    PERMISSIONS.EDIT_NEWS,
    PERMISSIONS.DELETE_NEWS,
    PERMISSIONS.VIEW_TEACHER_DIRECTORY,
    PERMISSIONS.MANAGE_TEACHER_DIRECTORY,
    PERMISSIONS.VIEW_STUDENT_RECORDS,
    PERMISSIONS.MANAGE_STUDENT_RECORDS,
    PERMISSIONS.ADMIN_SETTINGS,
    PERMISSIONS.MANAGE_DATABASE,
  ],
  DEPARTMENT_HEAD: [
    PERMISSIONS.CREATE_NEWS,
    PERMISSIONS.EDIT_NEWS,
    PERMISSIONS.VIEW_TEACHER_DIRECTORY,
    PERMISSIONS.VIEW_STUDENT_RECORDS,
  ],
  REGISTRAR: [
    PERMISSIONS.VIEW_STUDENT_RECORDS,
    PERMISSIONS.MANAGE_STUDENT_RECORDS,
    PERMISSIONS.VIEW_TEACHER_DIRECTORY,
  ],
  TEACHER: [
    PERMISSIONS.VIEW_TEACHER_DIRECTORY,
    PERMISSIONS.VIEW_STUDENT_RECORDS,
  ],
  STUDENT: [
    PERMISSIONS.VIEW_TEACHER_DIRECTORY,
  ],
}

/**
 * Check if a role inherently has a permission without checking the database.
 */
export function hasInheritedPermission(role: Role, permission: PermissionKey): boolean {
  if (role === Role.ADMIN) return true
  return ROLE_DEFAULT_PERMISSIONS[role].includes(permission)
}
