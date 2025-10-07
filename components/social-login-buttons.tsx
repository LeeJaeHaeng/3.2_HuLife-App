"use client"

import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function SocialLoginButtons() {
  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} 로그인 기능은 준비 중입니다.`, {
      description: "관리자에게 문의해주세요."
    })
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">또는</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialLogin("카카오")}
          className="h-12 bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#000000] border-0"
        >
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.568 1.684 4.816 4.221 6.163-.171.633-.641 2.367-.733 2.755-.113.485.177.478.372.347.154-.103 2.495-1.671 3.44-2.303.558.088 1.134.138 1.7.138 5.523 0 10-3.477 10-7.5S17.523 3 12 3z"/>
          </svg>
          카카오
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialLogin("네이버")}
          className="h-12 bg-[#03C75A] hover:bg-[#03C75A]/90 text-white border-0"
        >
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z"/>
          </svg>
          네이버
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialLogin("구글")}
          className="h-12"
        >
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          구글
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialLogin("페이스북")}
          className="h-12 bg-[#1877F2] hover:bg-[#1877F2]/90 text-white border-0"
        >
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          페이스북
        </Button>
      </div>
    </div>
  )
}
