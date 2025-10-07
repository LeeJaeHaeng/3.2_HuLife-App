import { Facebook, Instagram, Youtube, Mail } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image src="/휴라이프_로고.png" alt="휴라이프 로고" width={40} height={40} className="h-10 w-10" />
              <span className="text-xl font-bold text-foreground">휴라이프</span>
            </div>
            <p className="text-base text-muted-foreground leading-relaxed">
              은퇴 후 더 풍요로운 삶을 위한
              <br />
              취미 추천 및 모임 플랫폼
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">서비스</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-base text-muted-foreground hover:text-primary transition-colors">
                  취미 찾기
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-muted-foreground hover:text-primary transition-colors">
                  모임 찾기
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-muted-foreground hover:text-primary transition-colors">
                  모임 만들기
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-muted-foreground hover:text-primary transition-colors">
                  이벤트
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">고객지원</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-base text-muted-foreground hover:text-primary transition-colors">
                  자주 묻는 질문
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-muted-foreground hover:text-primary transition-colors">
                  이용 가이드
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-muted-foreground hover:text-primary transition-colors">
                  문의하기
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-muted-foreground hover:text-primary transition-colors">
                  공지사항
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">회사</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-base text-muted-foreground hover:text-primary transition-colors">
                  회사 소개
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-muted-foreground hover:text-primary transition-colors">
                  채용
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-muted-foreground hover:text-primary transition-colors">
                  이용약관
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-muted-foreground hover:text-primary transition-colors">
                  개인정보처리방침
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-base text-muted-foreground text-center">© 2025 휴라이프. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
