"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { logout } from "@/lib/actions/auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    toast.success("로그아웃되었습니다.")
    router.push("/")
    router.refresh()
  }

  return (
    <Button
      variant="ghost"
      size="lg"
      className="hidden md:flex text-base"
      onClick={handleLogout}
    >
      <LogOut className="mr-2 h-5 w-5" />
      로그아웃
    </Button>
  )
}
