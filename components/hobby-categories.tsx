import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Palette, Music, Book, Dumbbell, Camera, Utensils, Plane, Heart } from "lucide-react"

const categories = [
  { icon: Palette, name: "미술·공예", count: 45, color: "text-primary" },
  { icon: Music, name: "음악·악기", count: 38, color: "text-secondary" },
  { icon: Book, name: "독서·글쓰기", count: 52, color: "text-primary" },
  { icon: Dumbbell, name: "운동·건강", count: 67, color: "text-secondary" },
  { icon: Camera, name: "사진·영상", count: 29, color: "text-primary" },
  { icon: Utensils, name: "요리·베이킹", count: 41, color: "text-secondary" },
  { icon: Plane, name: "여행·문화", count: 56, color: "text-primary" },
  { icon: Heart, name: "봉사·나눔", count: 33, color: "text-secondary" },
]

export function HobbyCategories() {
  return (
    <section id="hobbies" className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center gap-4 text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
            어떤 취미를 시작하고 싶으세요?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed text-pretty">
            50가지 이상의 다양한 취미 카테고리에서 당신에게 맞는 활동을 찾아보세요
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Card
              key={category.name}
              className="group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <CardContent className="flex flex-col items-center gap-4 p-8">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted group-hover:bg-primary/10 transition-colors">
                  <category.icon className={`h-10 w-10 ${category.color}`} />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-foreground mb-1">{category.name}</h3>
                  <p className="text-base text-muted-foreground">{category.count}개 활동</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Button size="lg" variant="outline" className="text-lg font-semibold h-14 px-8 bg-transparent">
            모든 카테고리 보기
          </Button>
        </div>
      </div>
    </section>
  )
}
