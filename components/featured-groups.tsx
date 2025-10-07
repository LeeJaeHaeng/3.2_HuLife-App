import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Calendar } from "lucide-react"

const groups = [
  {
    name: "서울 수채화 동호회",
    category: "미술·공예",
    location: "서울 강남구",
    members: 24,
    nextMeeting: "이번 주 토요일",
    image: "/수채화.png",
  },
  {
    name: "실버 등산 클럽",
    category: "운동·건강",
    location: "서울 종로구",
    members: 45,
    nextMeeting: "내일",
    image: "/등산.png",
  },
  {
    name: "책 읽는 목요일",
    category: "독서·글쓰기",
    location: "부산 해운대구",
    members: 18,
    nextMeeting: "다음 주 목요일",
    image: "/독서토론.png",
  },
  {
    name: "사진으로 담는 일상",
    category: "사진·영상",
    location: "대구 중구",
    members: 32,
    nextMeeting: "이번 주 일요일",
    image: "/사진촬영.png",
  },
]

export function FeaturedGroups() {
  return (
    <section id="groups" className="py-20 md:py-32 bg-muted/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center gap-4 text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
            활발한 모임을 만나보세요
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed text-pretty">
            전국 각지에서 활동 중인 다양한 모임에 참여하고 새로운 친구를 만나세요
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {groups.map((group) => (
            <Card key={group.name} className="overflow-hidden group cursor-pointer transition-all hover:shadow-xl">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden">
                  <img
                    src={group.image || "/placeholder.svg"}
                    alt={group.name}
                    className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <Badge className="absolute top-4 right-4 bg-card text-card-foreground border-0 text-sm font-semibold">
                    {group.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">{group.name}</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-base text-muted-foreground">
                    <MapPin className="h-5 w-5 text-primary" />
                    {group.location}
                  </div>
                  <div className="flex items-center gap-2 text-base text-muted-foreground">
                    <Users className="h-5 w-5 text-primary" />
                    {group.members}명 활동 중
                  </div>
                  <div className="flex items-center gap-2 text-base text-muted-foreground">
                    <Calendar className="h-5 w-5 text-primary" />
                    다음 모임: {group.nextMeeting}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button className="w-full text-base font-semibold h-12">자세히 보기</Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Button size="lg" className="text-lg font-semibold h-14 px-8">
            모든 모임 둘러보기
          </Button>
        </div>
      </div>
    </section>
  )
}
