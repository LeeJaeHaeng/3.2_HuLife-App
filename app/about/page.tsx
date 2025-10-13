import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Heart, Target, Award } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">회사 소개</h1>
            <p className="text-xl text-muted-foreground">
              은퇴 후 더 풍요로운 삶을 위한 휴라이프입니다
            </p>
          </div>

          <Card>
            <CardContent className="p-8 space-y-6">
              <h2 className="text-2xl font-bold text-foreground">우리의 미션</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                휴라이프는 은퇴 후 새로운 인생을 시작하는 분들이 자신에게 맞는 취미를 찾고,
                비슷한 관심사를 가진 사람들과 교류하며 즐거운 노후 생활을 누릴 수 있도록 돕습니다.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                AI 기반 취미 추천 시스템과 지역 기반 커뮤니티 매칭을 통해
                12,000명 이상의 회원들이 새로운 취미 생활을 즐기고 있습니다.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <Users className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold text-foreground">12,000+</h3>
                <p className="text-muted-foreground">활동 회원</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 space-y-4">
                <Heart className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold text-foreground">500+</h3>
                <p className="text-muted-foreground">활동 모임</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 space-y-4">
                <Target className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold text-foreground">123+</h3>
                <p className="text-muted-foreground">취미 카테고리</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 space-y-4">
                <Award className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold text-foreground">95%</h3>
                <p className="text-muted-foreground">회원 만족도</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-8 space-y-6">
              <h2 className="text-2xl font-bold text-foreground">연락처</h2>
              <div className="space-y-3 text-muted-foreground">
                <p><strong className="text-foreground">이메일:</strong> contact@hulife.com</p>
                <p><strong className="text-foreground">주소:</strong> 서울특별시 강남구 테헤란로 123</p>
                <p><strong className="text-foreground">전화:</strong> 02-1234-5678</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
