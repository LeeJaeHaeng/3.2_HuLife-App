"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, MapPin, Calendar, Clock, User, Crown } from "lucide-react"
import Image from "next/image"
import type { Community } from "@/lib/db/schema"
import { joinCommunity, leaveCommunity, getUserCommunities } from "@/lib/actions/community"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface CommunityDetailClientProps {
  community: Community & {
    members: Array<{
      id: string
      role: string
      user: {
        id: string
        name: string
        avatar?: string | null
      }
    }>
  }
}

export function CommunityDetailClient({ community }: CommunityDetailClientProps) {
  const router = useRouter()
  const [isMember, setIsMember] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkMembership = async () => {
      const userCommunities = await getUserCommunities()
      const member = userCommunities.some((c) => c.id === community.id)
      setIsMember(member)
    }
    checkMembership()
  }, [community.id])

  const handleJoin = async () => {
    setIsLoading(true)
    const result = await joinCommunity(community.id)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("커뮤니티에 가입되었습니다!")
      setIsMember(true)
      router.refresh()
    }
    setIsLoading(false)
  }

  const handleLeave = async () => {
    if (!confirm("정말 탈퇴하시겠습니까?")) return

    setIsLoading(true)
    const result = await leaveCommunity(community.id)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("커뮤니티에서 탈퇴했습니다.")
      setIsMember(false)
      router.refresh()
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-96 w-full">
        <Image src={community.imageUrl || "/placeholder.svg"} alt={community.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <Badge className="mb-4 bg-primary">
              {community.memberCount}/{community.maxMembers}명
            </Badge>
            <h1 className="text-5xl font-bold text-white mb-4">{community.name}</h1>
            <p className="text-xl text-white/90">{community.description}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>모임 소개</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{community.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>멤버 ({community.members.length}명)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {community.members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg border">
                      <Avatar>
                        <AvatarFallback className="bg-[#FF7A5C] text-white">
                          {member.user.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{member.user.name}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          {member.role === "leader" ? (
                            <>
                              <Crown className="h-3 w-3 text-yellow-500" />
                              <span>리더</span>
                            </>
                          ) : (
                            <>
                              <User className="h-3 w-3" />
                              <span>멤버</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>모임 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">장소</p>
                    <p className="font-medium">{community.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">일정</p>
                    <p className="font-medium">{community.schedule}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">정원</p>
                    <p className="font-medium">
                      {community.memberCount} / {community.maxMembers}명
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">생성일</p>
                    <p className="font-medium">{new Date(community.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {isMember ? (
              <Button
                onClick={handleLeave}
                disabled={isLoading}
                variant="outline"
                className="w-full"
                size="lg"
              >
                {isLoading ? "처리 중..." : "모임 탈퇴"}
              </Button>
            ) : (
              <Button
                onClick={handleJoin}
                disabled={isLoading || community.memberCount >= community.maxMembers}
                className="w-full bg-[#FF7A5C] hover:bg-[#FF6B4A]"
                size="lg"
              >
                {isLoading
                  ? "처리 중..."
                  : community.memberCount >= community.maxMembers
                    ? "정원 마감"
                    : "모임 가입하기"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
