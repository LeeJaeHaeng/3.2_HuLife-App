import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">문의하기</h1>
            <p className="text-xl text-muted-foreground">
              궁금하신 점이 있으시면 언제든 문의해주세요
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <Mail className="h-12 w-12 mx-auto text-primary" />
                <h3 className="text-lg font-bold text-foreground">이메일</h3>
                <p className="text-muted-foreground">contact@hulife.com</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <Phone className="h-12 w-12 mx-auto text-primary" />
                <h3 className="text-lg font-bold text-foreground">전화</h3>
                <p className="text-muted-foreground">02-1234-5678</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <MapPin className="h-12 w-12 mx-auto text-primary" />
                <h3 className="text-lg font-bold text-foreground">주소</h3>
                <p className="text-muted-foreground">서울 강남구 테헤란로 123</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>문의 메시지 보내기</CardTitle>
              <CardDescription>
                아래 양식을 작성해주시면 빠른 시일 내에 답변드리겠습니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <Input id="name" placeholder="홍길동" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input id="email" type="email" placeholder="example@email.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">제목</Label>
                  <Input id="subject" placeholder="문의 제목을 입력해주세요" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">메시지</Label>
                  <Textarea
                    id="message"
                    placeholder="문의 내용을 상세히 작성해주세요"
                    rows={8}
                  />
                </div>
                <Button type="submit" className="w-full" size="lg">
                  문의 보내기
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
