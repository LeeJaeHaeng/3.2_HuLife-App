"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, MapPin, Calendar, Clock, User, Crown, MessageCircle, UserPlus, CheckCircle, XCircle } from "lucide-react"
import Image from "next/image"
import type { Community, chatMessages, joinRequests } from "@/lib/db/schema"
import { requestJoinCommunity, leaveCommunity, getUserCommunities, getPendingJoinRequests, approveJoinRequest, rejectJoinRequest } from "@/lib/actions/community"
import { getChatRoomByCommunity, getChatMessages } from "@/lib/actions/chat"
import { CommunityChat } from "@/components/community-chat"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type Message = typeof chatMessages.$inferSelect
type JoinRequest = typeof joinRequests.$inferSelect & {
  user: {
    id: string
    name: string
    email: string
  }
}

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
  currentUserId: string
  isLeader: boolean
}

export function CommunityDetailClient({ community, currentUserId, isLeader }: CommunityDetailClientProps) {
  const router = useRouter()
  // Check if current user is a member
  const isMember = community.members.some(m => m.user.id === currentUserId)
  const [isLoading, setIsLoading] = useState(false)
  const [chatRoomId, setChatRoomId] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([])
  const [hasPendingRequest, setHasPendingRequest] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      // If member, load chat room and messages
      if (isMember) {
        console.log('Loading chat room for community:', community.id)
        const chatRoom = await getChatRoomByCommunity(community.id)
        console.log('Chat room:', chatRoom)
        if (chatRoom) {
          setChatRoomId(chatRoom.id)
          const messages = await getChatMessages(chatRoom.id)
          console.log('Chat messages:', messages)
          setChatMessages(messages)
        } else {
          console.log('No chat room found!')
        }
      }

      // If leader, load pending join requests
      if (isLeader) {
        const requests = await getPendingJoinRequests(community.id)
        setJoinRequests(requests as JoinRequest[])
      }
    }
    loadData()
  }, [community.id, isLeader, isMember])

  const handleRequestJoin = async () => {
    setIsLoading(true)
    const result = await requestJoinCommunity(community.id)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(result.message || "가입 신청이 완료되었습니다!")
      setHasPendingRequest(true)
      router.refresh()
    }
    setIsLoading(false)
  }

  const handleApproveRequest = async (requestId: string) => {
    const result = await approveJoinRequest(requestId)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(result.message || "가입 신청을 승인했습니다!")
      const requests = await getPendingJoinRequests(community.id)
      setJoinRequests(requests as JoinRequest[])
      router.refresh()
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    const result = await rejectJoinRequest(requestId)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(result.message || "가입 신청을 거절했습니다!")
      const requests = await getPendingJoinRequests(community.id)
      setJoinRequests(requests as JoinRequest[])
      router.refresh()
    }
  }

  const handleLeave = async () => {
    if (!confirm("정말 탈퇴하시겠습니까?")) return

    setIsLoading(true)
    const result = await leaveCommunity(community.id)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("커뮤니티에서 탈퇴했습니다.")
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
            <Tabs defaultValue="intro" className="w-full">
              <TabsList className={`grid w-full ${isMember && isLeader ? 'grid-cols-4' : isMember || isLeader ? 'grid-cols-3' : 'grid-cols-2'}`}>
                <TabsTrigger value="intro">모임 소개</TabsTrigger>
                <TabsTrigger value="members">멤버</TabsTrigger>
                {isMember && <TabsTrigger value="chat">채팅</TabsTrigger>}
                {isLeader && <TabsTrigger value="requests">가입 신청</TabsTrigger>}
              </TabsList>

              <TabsContent value="intro" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>모임 소개</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{community.description}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="members" className="mt-6">
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
              </TabsContent>

              {isMember && (
                <TabsContent value="chat" className="mt-6">
                  {!chatRoomId ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">채팅방을 불러오는 중...</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <CommunityChat
                      chatRoomId={chatRoomId}
                      initialMessages={chatMessages}
                      currentUserId={currentUserId}
                    />
                  )}
                </TabsContent>
              )}

              {isLeader && (
                <TabsContent value="requests" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>가입 신청 ({joinRequests.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {joinRequests.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          대기 중인 가입 신청이 없습니다.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {joinRequests.map((request) => (
                            <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarFallback className="bg-[#FF7A5C] text-white">
                                    {request.user.name[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{request.user.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(request.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleApproveRequest(request.id)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  승인
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRejectRequest(request.id)}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  거절
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
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
            ) : hasPendingRequest ? (
              <Button
                disabled
                className="w-full"
                size="lg"
                variant="outline"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                승인 대기 중
              </Button>
            ) : (
              <Button
                onClick={handleRequestJoin}
                disabled={isLoading || community.memberCount >= community.maxMembers}
                className="w-full bg-[#FF7A5C] hover:bg-[#FF6B4A]"
                size="lg"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                {isLoading
                  ? "처리 중..."
                  : community.memberCount >= community.maxMembers
                    ? "정원 마감"
                    : "가입 신청하기"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
