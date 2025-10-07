"use client"

import { useState } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"
import { createCommunity } from "@/lib/actions/community"
import { getAllHobbies } from "@/lib/actions/hobbies"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import type { Hobby } from "@/lib/db/schema"

export function CreateCommunityDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [hobbyId, setHobbyId] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [schedule, setSchedule] = useState("")
  const [maxMembers, setMaxMembers] = useState("10")
  const [hobbies, setHobbies] = useState<Hobby[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loadHobbies = async () => {
      const data = await getAllHobbies()
      setHobbies(data)
    }
    loadHobbies()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const result = await createCommunity({
      name,
      hobbyId,
      description,
      location,
      schedule,
      maxMembers: parseInt(maxMembers),
      imageUrl: hobbies.find(h => h.id === hobbyId)?.imageUrl || "/placeholder.svg",
    })

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("커뮤니티가 생성되었습니다!")
      setOpen(false)
      setName("")
      setHobbyId("")
      setDescription("")
      setLocation("")
      setSchedule("")
      setMaxMembers("10")
      router.refresh()
    }

    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-[#FF7A5C] hover:bg-[#FF6B4A]">
          <Plus className="h-5 w-5 mr-2" />
          모임 만들기
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>새 모임 만들기</DialogTitle>
            <DialogDescription>
              같은 취미를 가진 사람들과 모임을 만들어보세요.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">모임 이름</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="예: 주말 수채화 동호회"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="hobby">취미 선택</Label>
              <Select value={hobbyId} onValueChange={setHobbyId} required>
                <SelectTrigger>
                  <SelectValue placeholder="취미를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {hobbies.map((hobby) => (
                    <SelectItem key={hobby.id} value={hobby.id}>
                      {hobby.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">모임 설명</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="모임에 대해 소개해주세요"
                rows={4}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">활동 지역</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                placeholder="예: 서울 강남구"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="schedule">정기 모임 일정</Label>
              <Input
                id="schedule"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                required
                placeholder="예: 매주 토요일 오후 2시"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="maxMembers">최대 인원</Label>
              <Input
                id="maxMembers"
                type="number"
                value={maxMembers}
                onChange={(e) => setMaxMembers(e.target.value)}
                required
                min="2"
                max="100"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "생성 중..." : "모임 만들기"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
