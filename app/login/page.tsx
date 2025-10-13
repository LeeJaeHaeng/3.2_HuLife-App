'use client'

import Link from "next/link"
import Image from "next/image"
import { useFormState, useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { login } from "@/lib/actions/auth"
import { SocialLoginButtons } from "@/components/social-login-buttons"

const initialState = {
  error: "",
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full h-12 text-base bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white" aria-disabled={pending}>
      {pending ? "로그인 중..." : "로그인"}
    </Button>
  )
}

export default function LoginPage() {
  const [state, formAction] = useFormState(login, initialState)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-green-50 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <Image src="/휴라이프_로고.png" alt="휴라이프 로고" width={64} height={64} />
          </div>
          <CardTitle className="text-3xl font-bold text-balance">휴라이프에 오신 것을 환영합니다</CardTitle>
          <CardDescription className="text-lg">새로운 취미와 친구를 만나보세요</CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-6">
            {state?.error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">오류:</strong>
                    <span className="block sm:inline"> {state.error}</span>
                </div>
            )}
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
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                <span>로그인 상태 유지</span>
              </label>
              <Link href="#" className="text-orange-600 dark:text-orange-400 hover:underline">
                비밀번호 찾기
              </Link>
            </div>
            <SubmitButton />

            <SocialLoginButtons />
          </CardContent>
        </form>
        <CardFooter className="flex flex-col gap-4">
          <p className="text-center text-sm text-muted-foreground">
            아직 계정이 없으신가요?{" "}
            <Link href="/signup" className="text-orange-600 dark:text-orange-400 font-semibold hover:underline">
              회원가입
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
