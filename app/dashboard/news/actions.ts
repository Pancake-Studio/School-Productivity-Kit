"use server"

import { requirePermission, requireTenantDb } from "@/lib/tenant"
import { PERMISSIONS } from "@/lib/rbac"
import { revalidatePath } from "next/cache"

export async function createNews(formData: FormData) {
  try {
    // Requires CREATE_NEWS permission
    const { db, tenantUserId, schoolId } = await requirePermission(PERMISSIONS.CREATE_NEWS)

    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const isPublished = formData.get("isPublished") === "true"

    if (!title || !content) {
      return { success: false, error: "กรุณากรอกข้อมูลให้ครบถ้วน" }
    }

    const news = await db.news.create({
      data: {
        title,
        content,
        isPublished,
        authorId: tenantUserId,
        schoolId
      },
    })

    revalidatePath("/dashboard/news")
    return { success: true, newsId: news.id }
  } catch (error: any) {
    console.error("Create News Error:", error)
    return { success: false, error: error.message || "เกิดข้อผิดพลาดในการสร้างข่าว" }
  }
}

export async function deleteNews(newsId: string) {
  try {
    const { db, schoolId } = await requirePermission(PERMISSIONS.DELETE_NEWS)

    // Verify news belongs to school
    const newsItem = await db.news.findFirst({ where: { id: newsId, schoolId } })
    if (!newsItem) throw new Error("ไม่พบข่าวนี้ในโรงเรียนของคุณ")

    await db.news.delete({
      where: { id: newsId },
    })

    revalidatePath("/dashboard/news")
    return { success: true }
  } catch (error: any) {
    console.error("Delete News Error:", error)
    return { success: false, error: error.message || "เกิดข้อผิดพลาดในการลบข่าว" }
  }
}

export async function togglePublishNews(newsId: string, currentStatus: boolean) {
  try {
    const { db, schoolId } = await requirePermission(PERMISSIONS.EDIT_NEWS)

    // Verify news belongs to school
    const newsItem = await db.news.findFirst({ where: { id: newsId, schoolId } })
    if (!newsItem) throw new Error("ไม่พบข่าวนี้ในโรงเรียนของคุณ")

    await db.news.update({
      where: { id: newsId },
      data: { isPublished: !currentStatus },
    })

    revalidatePath("/dashboard/news")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "เกิดข้อผิดพลาดในการแก้ไขข่าว" }
  }
}

export async function getNews() {
  try {
    // Only requires being logged in to the tenant to view news
    const { db, schoolId } = await requireTenantDb()

    const newsList = await db.news.findMany({
      where: { schoolId },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            displayName: true,
          }
        }
      }
    })

    return { success: true, data: newsList }
  } catch (error: any) {
    return { success: false, error: error.message || "ไม่สามารถดึงข้อมูลข่าวสารได้" }
  }
}
