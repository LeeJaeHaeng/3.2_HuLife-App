"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, DollarSign } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Hobby } from "@/lib/db/schema"
import { addHobbyToUser, removeHobbyFromUser, getUserHobbies } from "@/lib/actions/hobbies"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface HobbyListProps {
  initialHobbies: Hobby[]
  searchQuery?: string
  category?: string
}

export function HobbyList({ initialHobbies, searchQuery = "", category = "all" }: HobbyListProps) {
  const [hobbies] = useState(initialHobbies)
  const [addedHobbies, setAddedHobbies] = useState<Set<string>>(new Set())
  const [animatingHobbies, setAnimatingHobbies] = useState<Set<string>>(new Set())
  const router = useRouter()

  useEffect(() => {
    const loadUserHobbies = async () => {
      const userHobbies = await getUserHobbies()
      const hobbyIds = new Set(userHobbies.map((uh) => uh.hobbyId))
      setAddedHobbies(hobbyIds)
    }
    loadUserHobbies()
  }, [])

  const filteredHobbies = useMemo(() => {
    return hobbies.filter((hobby) => {
      const matchesSearch = searchQuery
        ? hobby.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hobby.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true

      const matchesCategory = category !== "all" ? hobby.category === category : true

      return matchesSearch && matchesCategory
    })
  }, [hobbies, searchQuery, category])

  const handleToggleHobby = async (hobbyId: string) => {
    setAnimatingHobbies((prev) => new Set(prev).add(hobbyId))

    const isCurrentlyAdded = addedHobbies.has(hobbyId)
    const result = isCurrentlyAdded
      ? await removeHobbyFromUser(hobbyId)
      : await addHobbyToUser(hobbyId, "interested")

    if (result.error) {
      toast.error(result.error)
      setAnimatingHobbies((prev) => {
        const next = new Set(prev)
        next.delete(hobbyId)
        return next
      })
    } else {
      if (isCurrentlyAdded) {
        toast.success("관심 취미에서 제거되었습니다.")
        setAddedHobbies((prev) => {
          const next = new Set(prev)
          next.delete(hobbyId)
          return next
        })
      } else {
        toast.success("관심 취미에 추가되었습니다!")
        setAddedHobbies((prev) => new Set(prev).add(hobbyId))
      }

      setTimeout(() => {
        setAnimatingHobbies((prev) => {
          const next = new Set(prev)
          next.delete(hobbyId)
          return next
        })
      }, 300)

      router.refresh()
    }
  }

  const getBudgetLabel = (budget: string) => {
    switch (budget) {
      case "low":
        return "저렴"
      case "medium":
        return "보통"
      case "high":
        return "높음"
      default:
        return budget
    }
  }

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty <= 2) return "초급"
    if (difficulty <= 3) return "중급"
    return "고급"
  }

  return (
    <>
      {filteredHobbies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">검색 결과가 없습니다.</p>
          <p className="text-muted-foreground mt-2">다른 검색어나 카테고리를 시도해보세요.</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHobbies.map((hobby) => (
        <Card key={hobby.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative h-48 w-full">
            <Image src={hobby.imageUrl || "/placeholder.svg"} alt={hobby.name} fill className="object-cover" />
            <Badge className="absolute top-4 right-4 bg-primary">{hobby.category}</Badge>
          </div>

          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-1">{hobby.name}</h3>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">{getDifficultyLabel(hobby.difficulty)}</Badge>
                  <Badge variant="outline">
                    {hobby.indoorOutdoor === "indoor"
                      ? "실내"
                      : hobby.indoorOutdoor === "outdoor"
                        ? "야외"
                        : "실내/야외"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-muted-foreground line-clamp-2 mb-4">{hobby.description}</p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>
                  {hobby.socialIndividual === "social"
                    ? "그룹 활동"
                    : hobby.socialIndividual === "individual"
                      ? "개인 활동"
                      : "그룹/개인"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>예산: {getBudgetLabel(hobby.budget)}</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex gap-2">
            <Button asChild className="flex-1">
              <Link href={`/hobbies/${hobby.id}`}>자세히 보기</Link>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleToggleHobby(hobby.id)}
              className={`transition-all duration-300 ${
                addedHobbies.has(hobby.id)
                  ? "bg-red-50 border-red-500 hover:bg-red-100"
                  : ""
              } ${animatingHobbies.has(hobby.id) ? "scale-110" : "scale-100"}`}
            >
              <Heart
                className={`h-4 w-4 transition-all duration-300 ${
                  addedHobbies.has(hobby.id) ? "fill-red-500 text-red-500" : ""
                } ${animatingHobbies.has(hobby.id) ? "animate-pulse" : ""}`}
              />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
    </>
  )
}
