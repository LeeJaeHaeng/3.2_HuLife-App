import { Button } from "@/components/ui/button"
import { Menu, User } from "lucide-react"
import Link from "next/link"
import { getSession } from "@/lib/auth/session"
import { LogoutButton } from "./logout-button"

export async function Header() {
  const session = await getSession()
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF7A5C]">
            <span className="text-2xl font-bold text-white">H</span>
          </div>
          <span className="text-2xl font-bold text-foreground">휴라이프</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/hobbies" className="text-lg font-medium text-foreground hover:text-[#FF7A5C] transition-colors">
            취미 찾기
          </Link>
          <Link
            href="/community"
            className="text-lg font-medium text-foreground hover:text-[#FF7A5C] transition-colors"
          >
            커뮤니티
          </Link>
          <Link href="/survey" className="text-lg font-medium text-foreground hover:text-[#FF7A5C] transition-colors">
            취미 추천받기
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {session ? (
            <>
              <span className="hidden md:inline text-sm text-muted-foreground">
                {session.name}님
              </span>
              <Button variant="ghost" size="lg" className="hidden md:flex text-base" asChild>
                <Link href="/my-page">
                  <User className="mr-2 h-5 w-5" />
                  마이페이지
                </Link>
              </Button>
              <LogoutButton />
            </>
          ) : (
            <>
              <Button variant="ghost" size="lg" className="hidden md:flex text-base" asChild>
                <Link href="/login">
                  <User className="mr-2 h-5 w-5" />
                  로그인
                </Link>
              </Button>
              <Button size="lg" className="hidden md:flex text-base font-semibold bg-[#FF7A5C] hover:bg-[#FF6B4A]" asChild>
                <Link href="/signup">시작하기</Link>
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" className="md:hidden h-12 w-12">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  )
}
