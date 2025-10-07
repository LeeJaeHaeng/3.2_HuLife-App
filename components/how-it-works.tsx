import { Card, CardContent } from "@/components/ui/card"
import { Search, Heart, Users, Smile } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "취미 찾기",
    description: "간단한 질문에 답하면 AI가 당신에게 맞는 취미를 추천해드립니다",
    step: "1",
  },
  {
    icon: Heart,
    title: "관심사 선택",
    description: "마음에 드는 취미와 활동을 선택하고 저장하세요",
    step: "2",
  },
  {
    icon: Users,
    title: "모임 가입",
    description: "근처에서 활동하는 모임을 찾아 참여 신청을 하세요",
    step: "3",
  },
  {
    icon: Smile,
    title: "즐거운 시작",
    description: "새로운 친구들과 함께 즐거운 취미 생활을 시작하세요",
    step: "4",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center gap-4 text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
            시작하는 방법은 간단합니다
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed text-pretty">
            4단계만 거치면 새로운 취미 생활을 시작할 수 있습니다
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              <Card className="h-full">
                <CardContent className="flex flex-col items-center gap-6 p-8 text-center">
                  <div className="relative">
                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/10">
                      <step.icon className="h-12 w-12 text-primary" />
                    </div>
                    <div className="absolute -top-3 -right-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                      {step.step}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">{step.title}</h3>
                    <p className="text-base text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </CardContent>
              </Card>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
