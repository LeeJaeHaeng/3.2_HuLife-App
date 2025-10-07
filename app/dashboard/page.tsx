import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, TrendingUp, Users, Calendar, Award, BookOpen } from "lucide-react"
import { getCurrentUser } from "@/lib/actions/user"
import { getUserHobbies } from "@/lib/actions/hobbies"
import { getUserCommunities } from "@/lib/actions/community"
import { getUserSchedules } from "@/lib/actions/schedule"
import { getRecommendations } from "@/lib/actions/survey"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const userHobbies = await getUserHobbies()
  const userCommunities = await getUserCommunities()
  const schedules = await getUserSchedules()
  const recommendations = await getRecommendations()
  // </CHANGE>

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/휴라이프_로고.png"
              alt="휴라이프"
              width={48}
              height={48}
              className="h-12 w-12"
            />
            <span className="text-2xl font-bold">휴라이프</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="lg" asChild>
              <Link href="/my-page">마이페이지</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 text-balance">안녕하세요, {user.name}님!</h1>
          <p className="text-xl text-muted-foreground text-pretty">오늘도 즐거운 취미 생활 되세요</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Link href="/my-page?tab=hobbies">
            <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Heart className="h-8 w-8 text-[#FF7A5C]" />
                  <TrendingUp className="h-5 w-5 text-[#7FB069]" />
                </div>
                <div className="text-3xl font-bold mb-1">{userHobbies.length}</div>
                <div className="text-sm text-muted-foreground">관심 취미</div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/my-page?tab=communities">
            <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Users className="h-8 w-8 text-[#FF7A5C]" />
                  <TrendingUp className="h-5 w-5 text-[#7FB069]" />
                </div>
                <div className="text-3xl font-bold mb-1">{userCommunities.length}</div>
                <div className="text-sm text-muted-foreground">참여 중인 모임</div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/my-page?tab=schedules">
            <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Calendar className="h-8 w-8 text-[#FF7A5C]" />
                </div>
                <div className="text-3xl font-bold mb-1">{schedules.length}</div>
                <div className="text-sm text-muted-foreground">예정된 일정</div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/my-page?tab=hobbies&filter=completed">
            <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Award className="h-8 w-8 text-[#FF7A5C]" />
                </div>
                <div className="text-3xl font-bold mb-1">
                  {userHobbies.filter((h) => h.status === "completed").length}
                </div>
                <div className="text-sm text-muted-foreground">완료한 취미</div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl">추천 취미</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.slice(0, 3).map((hobby) => (
                <div key={hobby.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{hobby.name}</h3>
                      <Badge variant="secondary">{hobby.category}</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={hobby.matchScore} className="flex-1 h-2" />
                      <span className="text-sm font-medium text-[#FF7A5C]">{hobby.matchScore}% 매칭</span>
                    </div>
                  </div>
                  <Button className="ml-4 bg-[#FF7A5C] hover:bg-[#FF6B4A]" asChild>
                    <Link href={`/hobbies/${hobby.id}`}>보기</Link>
                  </Button>
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/recommendations">더 많은 추천 보기</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">다가오는 일정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {schedules.slice(0, 3).map((event) => (
                <div key={event.id} className="p-4 rounded-lg bg-muted">
                  <h3 className="font-semibold mb-1">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    {new Date(event.date).toLocaleDateString()} {event.time}
                  </p>
                  {event.location && <p className="text-sm text-muted-foreground">{event.location}</p>}
                </div>
              ))}
              {schedules.length === 0 && (
                <p className="text-center text-muted-foreground py-4">예정된 일정이 없습니다</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">학습 진행도</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {userHobbies.slice(0, 3).map((userHobby) => (
                <div key={userHobby.id}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-[#FF7A5C]" />
                      <span className="font-semibold">{userHobby.hobbyId}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{userHobby.progress}% 완료</span>
                  </div>
                  <Progress value={userHobby.progress} className="h-2" />
                </div>
              ))}
              {userHobbies.length === 0 && (
                <p className="text-center text-muted-foreground py-4">아직 시작한 취미가 없습니다</p>
              )}
            </div>
          </CardContent>
        </Card>
        {/* </CHANGE> */}
      </main>
    </div>
  )
}
