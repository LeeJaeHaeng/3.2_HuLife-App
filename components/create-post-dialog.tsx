"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Image as ImageIcon, X } from "lucide-react"
import { createPost } from "@/lib/actions/posts"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Image from "next/image"

export function CreatePostDialog() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  })
  const [images, setImages] = useState<string[]>([]) // Base64 이미지 배열

  // 이미지 선택 핸들러
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (images.length + files.length > 5) {
      toast.error("이미지는 최대 5개까지만 업로드할 수 있습니다")
      return
    }

    const newImages: string[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const reader = new FileReader()

      await new Promise<void>((resolve) => {
        reader.onloadend = () => {
          if (reader.result) {
            newImages.push(reader.result as string)
          }
          resolve()
        }
        reader.readAsDataURL(file)
      })
    }

    setImages([...images, ...newImages])
  }

  // 이미지 제거 핸들러
  const handleImageRemove = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.content || !formData.category) {
      toast.error("모든 항목을 입력해주세요")
      return
    }

    setIsSubmitting(true)
    const result = await createPost({ ...formData, images })

    if (result.error) {
      toast.error(result.error)
      setIsSubmitting(false)
    } else {
      toast.success("게시글이 작성되었습니다!")
      setOpen(false)
      setFormData({ title: "", content: "", category: "" })
      setImages([])
      setIsSubmitting(false)
      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          글쓰기
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>새 게시글 작성</DialogTitle>
            <DialogDescription>커뮤니티에 경험과 생각을 공유해보세요.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category">카테고리</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="미술">미술</SelectItem>
                  <SelectItem value="스포츠">스포츠</SelectItem>
                  <SelectItem value="문화">문화</SelectItem>
                  <SelectItem value="건강">건강</SelectItem>
                  <SelectItem value="예술">예술</SelectItem>
                  <SelectItem value="자연">자연</SelectItem>
                  <SelectItem value="기타">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="제목을 입력하세요"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">내용</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="내용을 입력하세요"
                rows={8}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>이미지 ({images.length}/5)</Label>
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={images.length >= 5}
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  이미지 추가 ({images.length}/5)
                </Button>

                {/* Image Previews */}
                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {images.map((image, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={image}
                          alt={`이미지 ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleImageRemove(index)}
                          className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "작성 중..." : "작성하기"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
