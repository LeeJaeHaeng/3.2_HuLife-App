"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Star, Heart, Users, MapPin, DollarSign, Clock } from "lucide-react"
import Image from "next/image"
import type { Hobby, Review } from "@/lib/db/schema"
import { addHobbyToUser, removeHobbyFromUser, addReview, getUserHobbies } from "@/lib/actions/hobbies"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface HobbyDetailClientProps {
  hobby: Hobby
  reviews: Review[]
}

export function HobbyDetailClient({ hobby, reviews: initialReviews }: HobbyDetailClientProps) {
  const router = useRouter()
  const [reviews, setReviews] = useState(initialReviews)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const checkIfAdded = async () => {
      const userHobbies = await getUserHobbies()
      const added = userHobbies.some((uh) => uh.hobbyId === hobby.id)
      setIsAdded(added)
    }
    checkIfAdded()
  }, [hobby.id])

  const handleToggleHobby = async () => {
    setIsAnimating(true)

    const result = isAdded
      ? await removeHobbyFromUser(hobby.id)
      : await addHobbyToUser(hobby.id, "interested")

    if (result.error) {
      toast.error(result.error)
      setIsAnimating(false)
    } else {
      if (isAdded) {
        toast.success("관심 취미에서 제거되었습니다.")
        setIsAdded(false)
      } else {
        toast.success("관심 취미에 추가되었습니다!")
        setIsAdded(true)
      }

      setTimeout(() => {
        setIsAnimating(false)
      }, 300)

      router.refresh()
    }
  }

  const handleSubmitReview = async () => {
    if (!comment.trim()) {
      toast.error("후기를 입력해주세요.")
      return
    }

    setIsSubmitting(true)
    const result = await addReview(hobby.id, rating, comment)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("후기가 등록되었습니다!")
      setComment("")
      setRating(5)
      router.refresh()
    }
    setIsSubmitting(false)
  }

  const averageRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-96 w-full">
        <Image src={hobby.imageUrl || "/placeholder.svg"} alt={hobby.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <Badge className="mb-4 bg-primary">{hobby.category}</Badge>
            <h1 className="text-5xl font-bold text-white mb-4">{hobby.name}</h1>
            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{averageRating.toFixed(1)}</span>
                <span className="text-white/80">({reviews.length}개 후기)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">개요</TabsTrigger>
                <TabsTrigger value="curriculum">커리큘럼</TabsTrigger>
                <TabsTrigger value="reviews">후기</TabsTrigger>
                <TabsTrigger value="community">커뮤니티</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {hobby.videoUrl && (
                  <Card>
                    <CardHeader>
                      <CardTitle>소개 영상</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video w-full">
                        <iframe
                          className="w-full h-full rounded-lg"
                          src={(() => {
                            const url = hobby.videoUrl!;
                            if (url.includes("youtube.com/watch?v=")) {
                              const videoId = url.split("watch?v=")[1].split("&")[0];
                              return `https://www.youtube.com/embed/${videoId}`;
                            } else if (url.includes("youtu.be/")) {
                              const videoId = url.split("youtu.be/")[1].split("?")[0];
                              return `https://www.youtube.com/embed/${videoId}`;
                            } else if (url.includes("embed/")) {
                              return url;
                            }
                            return url;
                          })()}
                          title={`${hobby.name} 소개 영상`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>취미 소개</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{hobby.description}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>이런 점이 좋아요</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {hobby.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span className="text-muted-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>준비물</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {hobby.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span className="text-muted-foreground">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="curriculum" className="space-y-4">
                {hobby.curriculum && hobby.curriculum.length > 0 ? (
                  hobby.curriculum.map((week) => (
                    <Card key={week.week}>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {week.week}주차: {week.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{week.content}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      커리큘럼 정보가 준비 중입니다.
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>후기 작성</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">평점</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="transition-colors"
                          >
                            <Star
                              className={`h-8 w-8 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">후기</label>
                      <Textarea
                        placeholder="이 취미에 대한 경험을 공유해주세요..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <Button onClick={handleSubmitReview} disabled={isSubmitting} className="w-full">
                      {isSubmitting ? "등록 중..." : "후기 등록"}
                    </Button>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{review.userName}</p>
                            <div className="flex items-center gap-1 mt-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}

                  {reviews.length === 0 && (
                    <Card>
                      <CardContent className="py-8 text-center text-muted-foreground">
                        아직 작성된 후기가 없습니다. 첫 번째 후기를 작성해보세요!
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="community">
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    커뮤니티 기능은 곧 추가될 예정입니다.
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>취미 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">활동 형태</p>
                    <p className="font-medium">
                      {hobby.socialIndividual === "social"
                        ? "그룹 활동"
                        : hobby.socialIndividual === "individual"
                          ? "개인 활동"
                          : "그룹/개인"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">장소</p>
                    <p className="font-medium">
                      {hobby.indoorOutdoor === "indoor"
                        ? "실내"
                        : hobby.indoorOutdoor === "outdoor"
                          ? "야외"
                          : "실내/야외"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">예산</p>
                    <p className="font-medium">
                      {hobby.budget === "low" ? "저렴" : hobby.budget === "medium" ? "보통" : "높음"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">난이도</p>
                    <p className="font-medium">
                      {hobby.difficulty <= 2 ? "초급" : hobby.difficulty <= 3 ? "중급" : "고급"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleToggleHobby}
              size="lg"
              className={`w-full transition-all duration-300 ${
                isAdded
                  ? "bg-red-500 hover:bg-red-600 border-red-500"
                  : ""
              } ${isAnimating ? "scale-105" : "scale-100"}`}
            >
              <Heart
                className={`mr-2 h-5 w-5 transition-all duration-300 ${
                  isAdded ? "fill-white text-white" : ""
                } ${isAnimating ? "animate-pulse" : ""}`}
              />
              {isAdded ? "관심 추가됨" : "관심 추가"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
