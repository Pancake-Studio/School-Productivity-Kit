import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import ProfileClient from "./profile-client"

export default async function ProfilePage() {
  const session = await auth()
  
  if (!session?.user?.id || !(session.user as any).schoolId) {
    redirect("/auth/login")
  }

  const schoolId = (session.user as any).schoolId

  // Fetch the specific school user profile
  const tenantUser = await prisma.user.findFirst({
    where: {
      schoolId,
      googleAccounts: { some: { googleSub: (session.user as any).googleSub } }
    },
    include: {
      googleAccounts: true
    }
  })

  if (!tenantUser) {
    // This shouldn't happen if they are logged in and have a schoolId
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>ไม่พบข้อมูลผู้ใช้ในฐานข้อมูลโรงเรียนนี้</p>
      </div>
    )
  }

  const userData = {
    displayName: tenantUser.displayName,
    avatarUrl: tenantUser.avatarUrl,
    email: tenantUser.googleAccounts[0]?.email || session.user.email || ""
  }

  return <ProfileClient user={userData} />
}
