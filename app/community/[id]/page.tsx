import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { getCommunityById } from "@/lib/actions/community"
import { CommunityDetailClient } from "@/components/community-detail-client"
import { getSession } from "@/lib/auth/session"
import { notFound, redirect } from "next/navigation"

export default async function CommunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) {
    redirect("/login")
  }

  const { id } = await params
  const community = await getCommunityById(id)

  if (!community) {
    notFound()
  }

  const isLeader = community.leaderId === session.userId

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/휴라이프_로고.png"
              alt="휴라이프"
              width={48}
              height={48}
              className="h-12 w-12"
            />
            <span className="text-2xl font-bold">휴라이프</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="lg" asChild>
              <Link href="/community">목록으로</Link>
            </Button>
          </div>
        </div>
      </header>

      <CommunityDetailClient
        community={community}
        currentUserId={session.userId}
        isLeader={isLeader}
      />
    </div>
  )
}
