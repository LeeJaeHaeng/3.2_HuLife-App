import Link from "next/link"
import { SurveyForm } from "@/components/survey-form"

export default function SurveyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F0] to-[#E8F5E9]">
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF7A5C]">
              <span className="text-2xl font-bold text-white">H</span>
            </div>
            <span className="text-2xl font-bold">휴라이프</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-balance mb-2">취미 추천 설문</h1>
            <p className="text-lg text-muted-foreground">당신에게 맞는 취미를 찾기 위한 간단한 질문입니다</p>
          </div>
          <SurveyForm />
          {/* </CHANGE> */}
        </div>
      </main>
    </div>
  )
}
