import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { getRecommendations } from "@/lib/actions/survey"
import { RecommendationList } from "@/components/recommendation-list"
import { redirect } from "next/navigation"

export default async function RecommendationsPage() {
  const recommendations = await getRecommendations()

  if (recommendations.length === 0) {
    redirect("/survey")
  }
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
              <Link href="/dashboard">대시보드</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-balance">당신을 위한 맞춤 취미</h1>
            <p className="text-xl text-muted-foreground text-pretty">
              설문 결과를 바탕으로 가장 적합한 취미를 추천해드립니다
            </p>
          </div>

          <RecommendationList recommendations={recommendations} />
          {/* </CHANGE> */}

          <div className="mt-12 text-center space-y-4">
            <p className="text-muted-foreground">마음에 드는 취미를 찾지 못하셨나요?</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" size="lg" className="bg-transparent" asChild>
                <Link href="/survey">설문 다시하기</Link>
              </Button>
              <Button variant="outline" size="lg" className="bg-transparent" asChild>
                <Link href="/hobbies">모든 취미 둘러보기</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
