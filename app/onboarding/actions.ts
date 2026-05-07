"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/db"

export async function validateAndCreateSchool(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { success: false, error: "กรุณาเข้าสู่ระบบก่อน" }
  }

  const accessCode = formData.get("accessCode") as string
  const schoolName = formData.get("schoolName") as string
  const fullName = formData.get("fullName") as string
  const slug = formData.get("slug") as string

  if (!accessCode || !schoolName || !slug || !fullName) {
    return { success: false, error: "กรุณากรอกข้อมูลให้ครบถ้วน" }
  }

  // Basic slug validation
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { success: false, error: "Slug ต้องเป็นตัวอักษรภาษาอังกฤษพิมพ์เล็ก ตัวเลข หรือขีดกลางเท่านั้น" }
  }

  try {
    // 1. Validate Access Code
    const codeRecord = await prisma.schoolAccessCode.findUnique({
      where: { code: accessCode },
    })

    if (!codeRecord || codeRecord.usedAt) {
      return { success: false, error: "รหัสไม่ถูกต้องหรือถูกใช้งานไปแล้ว" }
    }

    // 2. Check slug
    const existingSchool = await prisma.school.findUnique({ where: { slug } })
    if (existingSchool) {
      return { success: false, error: "Slug นี้ถูกใช้งานแล้ว" }
    }

    // 3. Save to Master DB (Without DB Connection yet)
    const newSchool = await prisma.$transaction(async (tx) => {
      const globalUser = await tx.globalUser.findUnique({
        where: { id: session.user.id }
      })

      const school = await tx.school.create({
        data: {
          name: schoolName,
          slug: slug,
          dbConnectionString: null,
        },
      })

      await tx.schoolAccessCode.update({
        where: { code: accessCode },
        data: { usedBySchoolId: school.id, usedAt: new Date() },
      })

      // Link the global user - with recovery if ID mismatch
      try {
        if (globalUser) {
          await tx.globalUser.update({
            where: { id: globalUser.id },
            data: { schoolId: school.id },
          })
        } else {
          throw new Error("Global user not found")
        }
      } catch (e) {
        console.warn("User ID lookup failed, attempting email recovery...")
        // If ID lookup fails, try to find by email (from session)
        const userByEmail = await tx.globalUser.findUnique({
          where: { email: session.user.email || "" }
        })

        if (userByEmail) {
          await tx.globalUser.update({
            where: { id: userByEmail.id },
            data: { schoolId: school.id }
          })
        } else {
          // Fallback: Create if absolutely missing
          console.error("User not found by ID or Email. Creating fallback...")
          await tx.globalUser.create({
            data: {
              email: session.user.email || "unknown@ferrum.com",
              googleSub: "manual-" + Math.random(),
              schoolId: school.id
            }
          })
        }
      }

      // 4. Create the initial ADMIN user record for this school
      const tenantUser = await tx.user.create({
        data: {
          displayName: fullName,
          role: "ADMIN",
          schoolId: school.id,
        }
      })

      // 5. Link the Google identity to the new tenant user
      await tx.userGoogleAccount.create({
        data: {
          userId: tenantUser.id,
          googleSub: globalUser?.googleSub || session.user.id, // Fallback to id if sub missing
          email: session.user.email || "admin@school.com"
        }
      })

      return school
    })

    return { success: true, schoolId: newSchool.id }
  } catch (error) {
    console.error("Onboarding failed:", error)
    return { success: false, error: "เกิดข้อผิดพลาดภายในระบบ" }
  }
}
