"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardHeader, CardFooter, Input, Button, Modal, ModalDialog, ModalHeader, ModalBody, ModalFooter, ModalBackdrop, ModalContainer, TextArea } from "@heroui/react"
import { Plus, Trash2, Edit, Calendar, User, Eye, EyeOff } from "lucide-react"
import { createNews, deleteNews, togglePublishNews } from "./actions"

type NewsItem = {
  id: string
  title: string
  content: string
  isPublished: boolean
  createdAt: Date
  author: { displayName: string }
}

export default function NewsClient({ 
  initialNews, 
  canCreate, 
  canManage 
}: { 
  initialNews: any[]
  canCreate: boolean
  canManage: boolean 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [news, setNews] = useState<NewsItem[]>(initialNews)

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    // Add default isPublished true
    formData.append("isPublished", "true")
    
    const result = await createNews(formData)
    if (result.success) {
      window.location.reload() // Simple refresh to get new data
    } else {
      alert(result.error)
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("คุณต้องการลบข่าวสารนี้ใช่หรือไม่?")) return
    
    const result = await deleteNews(id)
    if (result.success) {
      setNews(news.filter(n => n.id !== id))
    } else {
      alert(result.error)
    }
  }

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const result = await togglePublishNews(id, currentStatus)
    if (result.success) {
      setNews(news.map(n => n.id === id ? { ...n, isPublished: !currentStatus } : n))
    } else {
      alert(result.error)
    }
  }

  return (
    <>
      <div className="flex justify-end mb-6">
        {canCreate && (
          <Button 
            onPress={() => setIsOpen(true)} 
            endContent={<Plus className="w-5 h-5" />}
            className="shadow-lg shadow-primary/30 bg-primary text-white"
          >
            สร้างข่าวใหม่
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {news.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="col-span-full py-20 text-center text-default-400 border border-dashed border-default-200 rounded-2xl"
            >
              ไม่มีข่าวสารในขณะนี้
            </motion.div>
          ) : (
            news.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="h-full border border-white/5 bg-background/60 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 overflow-hidden">
                  <CardHeader className="flex flex-col items-start gap-2 px-6 pt-6">
                    <div className="flex justify-between w-full items-start">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${item.isPublished ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
                        {item.isPublished ? 'เผยแพร่แล้ว' : 'ซ่อน'}
                      </span>
                      {canManage && (
                        <div className="flex gap-2">
                          <Button isIconOnly size="sm" variant="ghost" onPress={() => handleToggle(item.id, item.isPublished)}>
                            {item.isPublished ? <EyeOff className="w-4 h-4 text-default-400" /> : <Eye className="w-4 h-4 text-default-400" />}
                          </Button>
                          <Button isIconOnly size="sm" variant="ghost" className="text-danger" onPress={() => handleDelete(item.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-bold line-clamp-2 mt-2">{item.title}</h3>
                  </CardHeader>
                  <div className="px-6 py-4 flex-grow">
                    <p className="text-default-500 text-sm line-clamp-3 leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                  <CardFooter className="px-6 pb-6 pt-0 flex justify-between text-xs text-default-400">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>{item.author.displayName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(item.createdAt).toLocaleDateString('th-TH')}</span>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <ModalBackdrop className="backdrop-blur-sm" />
        <ModalContainer>
          <ModalDialog className="bg-background/80 backdrop-blur-2xl border border-white/10">
            <form onSubmit={handleCreate}>
              <ModalHeader className="flex flex-col gap-1 border-b border-white/5">สร้างข่าวสารใหม่</ModalHeader>
              <ModalBody className="py-6">
                <Input
                  name="title"
                  placeholder="กรอกหัวข้อข่าวสาร..."
                  isRequired
                />
                <TextArea
                  name="content"
                  placeholder="รายละเอียดข่าวสาร..."
                  rows={5}
                  isRequired
                />
              </ModalBody>
              <ModalFooter className="border-t border-white/5">
                <Button className="text-danger" variant="ghost" onPress={() => setIsOpen(false)}>
                  ยกเลิก
                </Button>
                <Button className="bg-primary text-white" type="submit" isDisabled={loading}>
                  {loading ? "กำลังบันทึก..." : "โพสต์ข่าว"}
                </Button>
              </ModalFooter>
            </form>
          </ModalDialog>
        </ModalContainer>
      </Modal>
    </>
  )
}
