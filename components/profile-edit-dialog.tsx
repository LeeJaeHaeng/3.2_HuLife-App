"use client"

import { useState, useEffect } from "react"
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
import { Edit } from "lucide-react"
import { updateUserProfile } from "@/lib/actions/user"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { locationData } from "@/lib/korea-administrative-district"

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
  }
}

export function ProfileEditDialog({ user }: ProfileEditDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(user.name)
  const [age, setAge] = useState(user.age.toString())
  const [selectedProvince, setSelectedProvince] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [cities, setCities] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const location = selectedProvince && selectedCity ? `${selectedProvince} ${selectedCity}` : ""

    const result = await updateUserProfile({
      name,
      age: parseInt(age),
      location,
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
