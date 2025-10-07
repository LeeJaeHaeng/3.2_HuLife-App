import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-12 md:p-20">
          <div className="relative z-10 flex flex-col items-center gap-8 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-primary-foreground md:text-5xl lg:text-6xl text-balance">
              새로운 인생 2막,
              <br />
              지금 시작하세요
            </h2>
            <p className="text-xl text-primary-foreground/90 max-w-2xl leading-relaxed text-pretty">
              12,000명의 회원들이 이미 휴라이프와 함께 즐거운 취미 생활을 하고 있습니다
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" className="text-lg font-semibold h-14 px-8">
                무료로 시작하기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg font-semibold h-14 px-8 bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10"
              >
                더 알아보기
              </Button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  )
}
