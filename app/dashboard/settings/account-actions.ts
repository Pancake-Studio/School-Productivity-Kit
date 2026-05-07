"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { requireTenantDb } from "@/lib/tenant"

/**
 * Link a new Google account to the current user profile.
 * This allows up to 5 Gmail accounts to access the same school identity.
 */
export async function linkGoogleAccount(newProfile: { sub: string, email: string }) {
  try {
    const { db, tenantUserId, session } = await requireTenantDb()
    
    // 1. Check current link count
    const count = await db.userGoogleAccount.count({
      where: { userId: tenantUserId }
    })
    
    if (count >= 5) {
      throw new Error("คุณผูกบัญชีครบ 5 บัญชีแล้ว (ขีดจำกัดสูงสุด)")
    }

    // 2. Ensure this google account isn't already linked to someone else in this tenant
    const existing = await db.userGoogleAccount.findUnique({
      where: { googleSub: newProfile.sub }
    })
    
    if (existing) {
      throw new Error("บัญชี Google นี้ถูกผูกไว้กับผู้ใช้อื่นแล้ว")
    }

    // 3. Update Master DB: Ensure the global user for this sub exists and points to the same school
    await prisma.globalUser.upsert({
      where: { googleSub: newProfile.sub },
      update: { schoolId: session.user.schoolId },
      create: {
        googleSub: newProfile.sub,
        email: newProfile.email,
        schoolId: session.user.schoolId
      }
    })

    // 4. Update Tenant DB: Add to user_google_accounts
    await db.userGoogleAccount.create({
      data: {
        userId: tenantUserId,
        googleSub: newProfile.sub,
        email: newProfile.email
      }
    })

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function getLinkedAccounts() {
  try {
    const { db, tenantUserId } = await requireTenantDb()
    const accounts = await db.userGoogleAccount.findMany({
      where: { userId: tenantUserId },
      orderBy: { linkedAt: 'asc' }
    })
    return { success: true, data: accounts }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
