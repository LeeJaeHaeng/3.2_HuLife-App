'use client'

import Link from "next/link"
import Image from "next/image"
import { useFormState, useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { signup } from "@/lib/actions/auth"
import { LocationSelect } from "@/components/location-select"
import { SocialLoginButtons } from "@/components/social-login-buttons"

const initialState = {
  error: "",
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full h-12 text-base bg-[#FF7A5C] hover:bg-[#FF6B4A] text-white" aria-disabled={pending}>
      {pending ? "가입하는 중..." : "회원가입"}
    </Button>
  )
}

export default function SignupPage() {
  const [state, formAction] = useFormState(signup, initialState)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF5F0] to-[#E8F5E9] p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <Image src="/휴라이프_로고.png" alt="휴라이프 로고" width={64} height={64} />
          </div>
          <CardTitle className="text-3xl font-bold text-balance">휴라이프 시작하기</CardTitle>
          <CardDescription className="text-lg">새로운 인생 2막을 함께 준비해요</CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-6">
            {state?.error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">오류:</strong>
                    <span className="block sm:inline"> {state.error}</span>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base">
                  이름
                </Label>
                <Input id="name" name="name" placeholder="홍길동" className="h-12 text-base" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age" className="text-base">
                  나이
                </Label>
                <Input id="age" name="age" type="number" placeholder="65" className="h-12 text-base" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">
                이메일
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@email.com"
                className="h-12 text-base"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-base">
                  비밀번호
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 text-base"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-base">
                  비밀번호 확인
                </Label>
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 text-base"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-base">거주 지역</Label>
              <LocationSelect />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-base">
                전화번호 (선택)
              </Label>
              <Input id="phone" name="phone" type="tel" placeholder="010-1234-5678" className="h-12 text-base" />
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 mt-0.5 rounded border-gray-300" required />
                <span className="text-sm leading-relaxed">
                  <span className="font-semibold">(필수)</span> 만 14세 이상이며, 이용약관 및 개인정보 처리방침에
                  동의합니다
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 mt-0.5 rounded border-gray-300" />
                <span className="text-sm leading-relaxed">
                  <span className="font-semibold">(선택)</span> 마케팅 정보 수신에 동의합니다
                </span>
              </label>
            </div>

            <SubmitButton />

            <SocialLoginButtons />
          </CardContent>
        </form>
        <CardFooter className="flex justify-center">
          <p className="text-center text-sm text-muted-foreground">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="text-[#FF7A5C] font-semibold hover:underline">
              로그인
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}