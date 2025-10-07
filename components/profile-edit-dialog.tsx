"use client"

import { useState, useEffect, useRef } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Upload } from "lucide-react"
import { updateUserProfile } from "@/lib/actions/user"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { locationData } from "@/lib/korea-administrative-district"
import Image from "next/image"

// Reformat the data for easier lookup
const processedLocationData: { [key: string]: string[] } = locationData.reduce((acc, item) => {
  const [key, value] = Object.entries(item)[0]
  acc[key] = value
  return acc
}, {} as { [key: string]: string[] })

const provinces = Object.keys(processedLocationData)

interface ProfileEditDialogProps {
  user: {
    name: string
    age: number
    location: string
    profileImage?: string | null
  }
}

export function ProfileEditDialog({ user }: ProfileEditDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(user.name)
  const [age, setAge] = useState(user.age.toString())
  const [selectedProvince, setSelectedProvince] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [cities, setCities] = useState<string[]>([])
  const [profileImage, setProfileImage] = useState(user.profileImage || "")
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Initialize location from user data
  useEffect(() => {
    if (user.location) {
      const parts = user.location.split(" ")
      if (parts.length >= 2) {
        const province = parts[0]
        const city = parts.slice(1).join(" ")
        setSelectedProvince(province)
        setSelectedCity(city)
        setCities(processedLocationData[province] || [])
      }
    }
  }, [user.location])

  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province)
    setCities(processedLocationData[province] || [])
    setSelectedCity("") // Reset city selection
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 파일 크기 확인 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("파일 크기는 5MB를 초과할 수 없습니다")
      return
    }

    // 파일 형식 확인
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      toast.error("지원하지 않는 파일 형식입니다")
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("업로드 실패")
      }

      const data = await response.json()
      setProfileImage(data.url)
      toast.success("사진이 업로드되었습니다")
    } catch (error) {
      toast.error("사진 업로드에 실패했습니다")
      console.error(error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const location = selectedProvince && selectedCity ? `${selectedProvince} ${selectedCity}` : ""

    const result = await updateUserProfile({
      name,
      age: parseInt(age),
      location,
      profileImage,
    })

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("프로필이 수정되었습니다!")
      setOpen(false)
      router.refresh()
    }

    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full bg-transparent">
          <Edit className="mr-2 h-4 w-4" />
          프로필 수정
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>프로필 수정</DialogTitle>
            <DialogDescription>
              회원 정보를 수정할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                {profileImage ? (
                  <AvatarImage src={profileImage} alt={name} />
                ) : (
                  <AvatarFallback className="text-2xl bg-[#FF7A5C] text-white">
                    {name[0]}
                  </AvatarFallback>
                )}
              </Avatar>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Upload className="mr-2 h-4 w-4" />
                {isUploading ? "업로드 중..." : "사진 변경"}
              </Button>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="age">나이</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                min="1"
                max="120"
              />
            </div>
            <div className="grid gap-2">
              <Label>거주 지역</Label>
              <div className="grid grid-cols-2 gap-2">
                <Select onValueChange={handleProvinceChange} value={selectedProvince}>
                  <SelectTrigger>
                    <SelectValue placeholder="시/도 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select onValueChange={setSelectedCity} value={selectedCity} disabled={!selectedProvince}>
                  <SelectTrigger>
                    <SelectValue placeholder="시/군/구 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "저장 중..." : "저장하기"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
