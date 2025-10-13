import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "휴라이프는 어떤 서비스인가요?",
    answer: "휴라이프는 은퇴 후 새로운 취미를 찾고 싶은 분들을 위한 플랫폼입니다. AI 기반 취미 추천, 지역 기반 모임 매칭, 커뮤니티 기능을 제공하여 즐거운 노후 생활을 지원합니다."
  },
  {
    question: "회원가입은 어떻게 하나요?",
    answer: "웹사이트 우측 상단의 '시작하기' 버튼을 클릭하거나, Google, Naver, Kakao 계정으로 간편하게 가입하실 수 있습니다."
  },
  {
    question: "취미 추천은 어떻게 받나요?",
    answer: "로그인 후 '취미 추천받기' 메뉴에서 간단한 설문조사를 완료하시면, AI가 분석하여 회원님께 맞는 취미를 추천해드립니다."
  },
  {
    question: "모임은 어떻게 찾나요?",
    answer: "'커뮤니티' 메뉴에서 관심 있는 취미나 지역을 선택하여 모임을 찾으실 수 있습니다. 각 모임의 상세 정보를 확인하고 가입 신청을 하실 수 있습니다."
  },
  {
    question: "모임을 직접 만들 수 있나요?",
    answer: "네, 가능합니다. 커뮤니티 페이지에서 '모임 만들기' 버튼을 클릭하여 새로운 모임을 생성하실 수 있습니다."
  },
  {
    question: "서비스 이용료가 있나요?",
    answer: "기본적인 서비스는 모두 무료로 제공됩니다. 취미 추천, 모임 가입, 커뮤니티 이용 등 대부분의 기능을 무료로 사용하실 수 있습니다."
  },
  {
    question: "개인정보는 안전하게 보호되나요?",
    answer: "네, 회원님의 개인정보는 철저하게 보호됩니다. 개인정보처리방침에 따라 안전하게 관리되며, 회원님의 동의 없이 제3자에게 제공되지 않습니다."
  },
  {
    question: "모임 활동은 어떻게 진행되나요?",
    answer: "각 모임마다 정기적인 활동 일정이 있으며, 모임 페이지의 게시판과 채팅을 통해 회원들과 소통하실 수 있습니다. 오프라인 모임 일정도 확인하실 수 있습니다."
  },
  {
    question: "문의사항이 있을 때는 어떻게 하나요?",
    answer: "하단의 '문의하기'를 통해 문의하시거나, contact@hulife.com으로 이메일을 보내주시면 빠르게 답변드리겠습니다."
  }
]

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">자주 묻는 질문</h1>
            <p className="text-xl text-muted-foreground">
              휴라이프 이용에 대해 궁금하신 점을 확인해보세요
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-semibold text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 p-6 bg-muted rounded-lg text-center space-y-4">
            <p className="text-lg font-semibold text-foreground">
              원하시는 답변을 찾지 못하셨나요?
            </p>
            <p className="text-muted-foreground">
              contact@hulife.com으로 문의해주시면 친절하게 답변드리겠습니다.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
