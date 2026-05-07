import { getNews } from "./actions"
import { checkPermission } from "@/lib/tenant"
import { PERMISSIONS } from "@/lib/rbac"
import NewsClient from "./news-client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar } from "@fortawesome/free-solid-svg-icons"

export default async function NewsPage() {
  const [newsResult, canCreateNews, canManageNews] = await Promise.all([
    getNews(),
    checkPermission(PERMISSIONS.CREATE_NEWS),
    checkPermission(PERMISSIONS.DELETE_NEWS), // Using DELETE_NEWS as proxy for full manage rights
  ])

  const newsList = newsResult.success && newsResult.data ? newsResult.data : []

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500/10 text-amber-500">
                <FontAwesomeIcon icon={faStar} className="text-lg" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">ข่าวสารและกิจกรรม</h1>
        </div>
        <p className="text-sm text-[var(--text-muted)] ml-[52px]">อัปเดตข้อมูลข่าวสารล่าสุดของโรงเรียน</p>
      </div>
      
      <NewsClient 
        initialNews={newsList} 
        canCreate={canCreateNews} 
        canManage={canManageNews} 
      />
    </div>
  )
}
