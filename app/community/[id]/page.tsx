import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getCommunityById } from "@/lib/actions/community"
import { CommunityDetailClient } from "@/components/community-detail-client"
import { notFound } from "next/navigation"

export default async function CommunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const community = await getCommunityById(id)

  if (!community) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF7A5C]">
              <span className="text-2xl font-bold text-white">H</span>
            </div>
            <span className="text-2xl font-bold">휴라이프</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="lg" asChild>
              <Link href="/community">목록으로</Link>
            </Button>
          </div>
        </div>
      </header>

      <CommunityDetailClient community={community} />
    </div>
  )
}
