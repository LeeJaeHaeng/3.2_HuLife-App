import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getAllHobbies } from "@/lib/actions/hobbies"
import { HobbiesClient } from "@/components/hobbies-client"

export default async function HobbiesPage() {
  const hobbies = await getAllHobbies()

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF7A5C]">
              <span className="text-2xl font-bold text-white">H</span>
            </div>
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
          <h1 className="text-4xl font-bold mb-4 text-balance">모든 취미 둘러보기</h1>
          <p className="text-xl text-muted-foreground text-pretty">
            다양한 취미 활동 중에서 당신에게 맞는 것을 찾아보세요
          </p>
        </div>

        <HobbiesClient hobbies={hobbies} />
      </main>
    </div>
  )
}
