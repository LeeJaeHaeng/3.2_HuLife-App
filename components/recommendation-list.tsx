"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Hobby } from "@/lib/db/schema"
import { addHobbyToUser, removeHobbyFromUser, getUserHobbies } from "@/lib/actions/hobbies"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState, useEffect } from "react"

interface RecommendationListProps {
  recommendations: Array<Hobby & { matchScore: number; reasons: string[] }>
}

export function RecommendationList({ recommendations }: RecommendationListProps) {
  const router = useRouter()
  const [addedHobbies, setAddedHobbies] = useState<Set<string>>(new Set())
  const [animatingHobbies, setAnimatingHobbies] = useState<Set<string>>(new Set())

  useEffect(() => {
    const loadUserHobbies = async () => {
      const userHobbies = await getUserHobbies()
      const hobbyIds = new Set(userHobbies.map((uh) => uh.hobbyId))
      setAddedHobbies(hobbyIds)
    }
    loadUserHobbies()
  }, [])

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

  return (
    <div className="space-y-6">
      {recommendations.map((hobby, index) => (
        <Card key={hobby.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="relative h-64 md:h-auto">
              <Image src={hobby.imageUrl || "/placeholder.svg"} alt={hobby.name} fill className="object-cover" />
              {index === 0 && (
                <Badge className="absolute top-4 left-4 bg-yellow-500 text-white">
                  <Sparkles className="h-3 w-3 mr-1" />
                  최고 추천
                </Badge>
              )}
            </div>

            <div className="md:col-span-2 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-foreground">{hobby.name}</h3>
                    <Badge variant="outline">{hobby.category}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-sm font-semibold text-primary">매칭도 {hobby.matchScore}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground mb-4">{hobby.description}</p>

              <div className="space-y-2 mb-6">
                <p className="text-sm font-semibold text-foreground">추천 이유:</p>
                <ul className="space-y-1">
                  {hobby.reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-1">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                <Button asChild className="flex-1">
                  <Link href={`/hobbies/${hobby.id}`}>자세히 보기</Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleToggleHobby(hobby.id)}
                  className={`transition-all duration-300 ${
                    addedHobbies.has(hobby.id)
                      ? "bg-red-50 border-red-500 text-red-600 hover:bg-red-100 hover:text-red-600"
                      : ""
                  } ${animatingHobbies.has(hobby.id) ? "scale-110" : "scale-100"}`}
                >
                  <Heart
                    className={`h-4 w-4 mr-2 transition-all duration-300 ${
                      addedHobbies.has(hobby.id) ? "fill-red-500 text-red-500" : ""
                    } ${animatingHobbies.has(hobby.id) ? "animate-pulse" : ""}`}
                  />
                  {addedHobbies.has(hobby.id) ? "추가됨" : "관심 추가"}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
