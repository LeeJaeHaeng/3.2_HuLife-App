"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { submitSurvey } from "@/lib/actions/survey"
import { toast } from "sonner"
import { ChevronLeft, ChevronRight } from "lucide-react"

const questions = [
  {
    id: "1",
    question: "야외 활동을 얼마나 선호하시나요?",
    options: [
      { value: "1", label: "전혀 선호하지 않음" },
      { value: "2", label: "별로 선호하지 않음" },
      { value: "3", label: "보통" },
      { value: "4", label: "선호함" },
      { value: "5", label: "매우 선호함" },
    ],
  },
  {
    id: "2",
    question: "자연 속에서 시간을 보내는 것을 좋아하시나요?",
    options: [
      { value: "1", label: "전혀 좋아하지 않음" },
      { value: "2", label: "별로 좋아하지 않음" },
      { value: "3", label: "보통" },
      { value: "4", label: "좋아함" },
      { value: "5", label: "매우 좋아함" },
    ],
  },
  {
    id: "3",
    question: "다른 사람들과 함께하는 활동을 선호하시나요?",
    options: [
      { value: "1", label: "혼자 하는 것을 선호" },
      { value: "2", label: "대체로 혼자 선호" },
      { value: "3", label: "상관없음" },
      { value: "4", label: "함께 하는 것을 선호" },
      { value: "5", label: "반드시 함께 하고 싶음" },
    ],
  },
  {
    id: "4",
    question: "새로운 사람들을 만나는 것에 대해 어떻게 생각하시나요?",
    options: [
      { value: "1", label: "부담스러움" },
      { value: "2", label: "약간 부담스러움" },
      { value: "3", label: "보통" },
      { value: "4", label: "좋음" },
      { value: "5", label: "매우 좋음" },
    ],
  },
  {
    id: "5",
    question: "창의적인 활동(그림, 공예 등)에 관심이 있으신가요?",
    options: [
      { value: "1", label: "전혀 관심 없음" },
      { value: "2", label: "별로 관심 없음" },
      { value: "3", label: "보통" },
      { value: "4", label: "관심 있음" },
      { value: "5", label: "매우 관심 있음" },
    ],
  },
  {
    id: "6",
    question: "예술적 표현 활동을 해보고 싶으신가요?",
    options: [
      { value: "1", label: "전혀 원하지 않음" },
      { value: "2", label: "별로 원하지 않음" },
      { value: "3", label: "보통" },
      { value: "4", label: "원함" },
      { value: "5", label: "매우 원함" },
    ],
  },
  {
    id: "7",
    question: "신체 활동이 포함된 취미를 원하시나요?",
    options: [
      { value: "1", label: "전혀 원하지 않음" },
      { value: "2", label: "별로 원하지 않음" },
      { value: "3", label: "보통" },
      { value: "4", label: "원함" },
      { value: "5", label: "매우 원함" },
    ],
  },
  {
    id: "8",
    question: "취미 활동에 투자할 수 있는 예산은 어느 정도인가요?",
    options: [
      { value: "1", label: "최소한으로" },
      { value: "2", label: "적당히" },
      { value: "3", label: "보통" },
      { value: "4", label: "여유있게" },
      { value: "5", label: "제한 없이" },
    ],
  },
]

export function SurveyForm() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleAnswer = (questionId: string, value: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleNext = () => {
    if (!responses[questions[currentQuestion].id]) {
      toast.error("답변을 선택해주세요")
      return
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    if (!responses[questions[currentQuestion].id]) {
      toast.error("답변을 선택해주세요")
      return
    }

    setIsSubmitting(true)

    // Convert string responses to numbers
    const numericResponses: { [key: string]: number } = {}
    Object.entries(responses).forEach(([key, value]) => {
      numericResponses[key] = Number.parseInt(value)
    })

    try {
      await submitSurvey(numericResponses)
      // Redirect is handled by the server action.
      // We can show a toast here before the redirect happens.
      toast.success("설문이 완료되었습니다! 추천 페이지로 이동합니다.")
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
      setIsSubmitting(false)
    }
  }

  const currentQ = questions[currentQuestion]

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            질문 {currentQuestion + 1} / {questions.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{currentQ.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={responses[currentQ.id] || ""} onValueChange={(value) => handleAnswer(currentQ.id, value)}>
            <div className="space-y-3">
              {currentQ.options.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <RadioGroupItem value={option.value} id={`${currentQ.id}-${option.value}`} />
                  <Label htmlFor={`${currentQ.id}-${option.value}`} className="flex-1 cursor-pointer text-base">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="flex-1 bg-transparent"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          이전
        </Button>

        {currentQuestion < questions.length - 1 ? (
          <Button onClick={handleNext} className="flex-1">
            다음
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
            {isSubmitting ? "제출 중..." : "결과 보기"}
          </Button>
        )}
      </div>
    </div>
  )
}
