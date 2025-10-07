import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F0] to-[#E8F5E9] py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="flex flex-col gap-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FF7A5C]/10 px-4 py-2 text-sm font-medium text-[#FF7A5C] w-fit border border-[#FF7A5C]/20">
              <Sparkles className="h-4 w-4" />
              은퇴 후 새로운 인생을 시작하세요
            </div>

            <h1 className="text-5xl font-bold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl text-balance">
              당신만을 위한
              <br />
              <span className="text-[#FF7A5C]">맞춤 취미</span>를
              <br />
              찾아드립니다
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed md:text-2xl text-pretty">
              AI 기반 취미 추천부터 지역 모임 가입까지, 휴라이프가 당신의 행복한 노후를 함께합니다.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="text-lg font-semibold h-14 px-8 bg-[#FF7A5C] hover:bg-[#FF6B4A]" asChild>
                <Link href="/survey">
                  취미 추천받기
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg font-semibold h-14 px-8 bg-transparent" asChild>
                <Link href="/hobbies">둘러보기</Link>
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-foreground">12,000+</div>
                <div className="text-base text-muted-foreground">활동 회원</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <div className="text-3xl font-bold text-foreground">500+</div>
                <div className="text-base text-muted-foreground">활동 모임</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <div className="text-3xl font-bold text-foreground">50+</div>
                <div className="text-base text-muted-foreground">취미 카테고리</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/수채화.png"
                alt="그림 그리기 취미"
                className="rounded-2xl object-cover h-[400px] w-full"
              />
              <img
                src="/원예.png"
                alt="정원 가꾸기 모임"
                className="rounded-2xl object-cover h-[400px] w-full mt-8"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 rounded-2xl bg-card p-6 shadow-xl border border-border">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  <div className="h-12 w-12 rounded-full bg-primary border-2 border-card" />
                  <div className="h-12 w-12 rounded-full bg-secondary border-2 border-card" />
                  <div className="h-12 w-12 rounded-full bg-accent border-2 border-card" />
                </div>
                <div>
                  <div className="text-lg font-bold text-foreground">새로운 친구들</div>
                  <div className="text-sm text-muted-foreground">이번 주 +234명</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
