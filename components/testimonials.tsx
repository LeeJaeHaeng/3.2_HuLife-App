import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { generateAvatar } from "@/lib/utils/avatar"

const testimonials = [
  {
    name: "김영희",
    age: 67,
    hobby: "수채화",
    content: "은퇴 후 무료한 시간을 보내다가 휴라이프를 통해 수채화를 시작했어요. 이제는 매주 모임이 기다려집니다!",
  },
  {
    name: "박철수",
    age: 72,
    hobby: "등산",
    content:
      "혼자 등산하던 저에게 좋은 친구들을 만나게 해준 휴라이프. 이제는 매주 함께 산을 오르며 건강도 챙기고 있습니다.",
  },
  {
    name: "이순자",
    age: 65,
    hobby: "독서 모임",
    content:
      "책을 좋아했지만 혼자 읽기만 했는데, 이제는 같은 책을 읽고 이야기 나눌 친구들이 생겼어요. 인생이 더 풍요로워졌습니다.",
  },
]

export function Testimonials() {
  return (
    <section id="stories" className="py-20 md:py-32 bg-muted/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center gap-4 text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
            회원들의 이야기
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed text-pretty">
            휴라이프와 함께 새로운 인생을 시작한 분들의 진솔한 이야기를 들어보세요
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="h-full">
              <CardContent className="flex flex-col gap-6 p-8">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-lg text-foreground leading-relaxed italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <img
                    src={generateAvatar(testimonial.name)}
                    alt={testimonial.name}
                    className="h-16 w-16 rounded-full object-cover border-2 border-[#FF7A5C]/20"
                  />
                  <div>
                    <div className="font-bold text-foreground text-lg">{testimonial.name}</div>
                    <div className="text-base text-muted-foreground">
                      {testimonial.age}세 · {testimonial.hobby}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
