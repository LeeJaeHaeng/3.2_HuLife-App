import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { getHobbyById, getHobbyReviews } from "@/lib/actions/hobbies"
import { getCommunitiesByHobby } from "@/lib/actions/community"
import { HobbyDetailClient } from "@/components/hobby-detail-client"
import { notFound } from "next/navigation"

export default async function HobbyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const hobby = await getHobbyById(id)

  if (!hobby) {
    notFound()
  }

  const reviews = await getHobbyReviews(id)
  const communities = await getCommunitiesByHobby(id)
  // </CHANGE>

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
              <Link href="/hobbies">목록으로</Link>
            </Button>
          </div>
        </div>
      </header>

      <HobbyDetailClient hobby={hobby} reviews={reviews} communities={communities} />
      {/* </CHANGE> */}
    </div>
  )
}
