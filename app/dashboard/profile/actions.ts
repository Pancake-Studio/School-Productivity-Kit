"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function updateProfile(data: { displayName?: string, avatarUrl?: string }) {
  const session = await auth()
  
  if (!session?.user?.id || !(session.user as any).schoolId) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const schoolId = (session.user as any).schoolId
    
    // Find the user record linked to this school and global identity
    const user = await prisma.user.findFirst({
      where: {
        schoolId,
        googleAccounts: { some: { googleSub: (session.user as any).googleSub } }
      },
      include: { googleAccounts: true }
    })

    if (!user) {
      return { success: false, error: "User profile not found in this school" }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        displayName: data.displayName || undefined,
        avatarUrl: data.avatarUrl || undefined,
      }
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Failed to update profile:", error)
    return { success: false, error: "Internal Server Error" }
  }
}
