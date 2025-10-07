import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Calendar, Award, Users } from "lucide-react"
import { getCurrentUser } from "@/lib/actions/user"
import { getUserHobbies } from "@/lib/actions/hobbies"
import { getUserCommunities } from "@/lib/actions/community"
import { getUserSchedules } from "@/lib/actions/schedule"
import { ScheduleCalendar } from "@/components/schedule-calendar"
import { ProfileEditDialog } from "@/components/profile-edit-dialog"
import { redirect } from "next/navigation"

export default async function MyPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const userHobbies = await getUserHobbies()
  const userCommunities = await getUserCommunities()
  const schedules = await getUserSchedules()

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF7A5C]">
              <span className="text-2xl font-bold text-white">H</span>
            </div>
            <span className="text-2xl font-bold">휴라이프</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="lg" asChild>
              <Link href="/dashboard">대시보드</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[300px_1fr] gap-8">
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarFallback className="text-2xl bg-[#FF7A5C] text-white">{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
                  <p className="text-muted-foreground mb-4">
                    {user.age}세 • {user.location}
                  </p>
                  <ProfileEditDialog user={{ name: user.name, age: user.age, location: user.location }} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">활동 통계</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Heart className="h-4 w-4" />
                      <span>관심 취미</span>
                    </div>
                    <span className="font-bold text-lg">{userHobbies.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>참여 모임</span>
                    </div>
                    <span className="font-bold text-lg">{userCommunities.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>예정된 일정</span>
                    </div>
                    <span className="font-bold text-lg">{schedules.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Award className="h-4 w-4" />
                      <span>완료한 취미</span>
                    </div>
                    <span className="font-bold text-lg">
                      {userHobbies.filter((h) => h.status === "completed").length}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Tabs defaultValue="hobbies" className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-12 mb-6">
                  <TabsTrigger value="hobbies" className="text-base">
                    관심 취미
                  </TabsTrigger>
                  <TabsTrigger value="groups" className="text-base">
                    참여 모임
                  </TabsTrigger>
                  <TabsTrigger value="schedule" className="text-base">
                    일정
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="hobbies">
                  {userHobbies.length > 0 ? (
                    <div className="space-y-4">
                      {userHobbies.map((item) => (
                        <Card key={item.id}>
                          <CardContent className="p-6">
                            <h3 className="text-xl font-bold mb-2">{item.hobby?.name || "취미"}</h3>
                            <p className="text-sm text-muted-foreground mb-4">진행도: {item.progress}%</p>
                            <Button className="w-full bg-[#FF7A5C] hover:bg-[#FF6B4A]" asChild>
                              <Link href={`/hobbies/${item.hobbyId}`}>계속하기</Link>
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="py-12 text-center text-muted-foreground">
                        아직 관심 취미가 없습니다. 취미를 추가해보세요!
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="groups">
                  {userCommunities.length > 0 ? (
                    <div className="space-y-4">
                      {userCommunities.map((community) => (
                        <Card key={community.id}>
                          <CardContent className="p-6">
                            <h3 className="text-xl font-bold mb-2">{community.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{community.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {community.location} • {community.schedule}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="py-12 text-center text-muted-foreground">
                        아직 참여한 모임이 없습니다. 모임에 가입해보세요!
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="schedule">
                  <ScheduleCalendar schedules={schedules} />
                </TabsContent>
              </Tabs>
            </div>
            {/* </CHANGE> */}
          </div>
        </div>
      </main>
    </div>
  )
}
