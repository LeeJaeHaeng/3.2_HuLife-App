import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Heart, MessageSquare, Share2, ArrowLeft } from "lucide-react"
import { db } from "@/lib/db"
import { posts } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

interface PostDetailPageProps {
  params: Promise<{
    id: string
  }>
}

async function getPost(id: string) {
  const post = await db
    .select()
    .from(posts)
    .where(eq(posts.id, id))
    .then(results => results[0])

  if (!post) {
    return null
  }

  // Parse images JSON string to array
  return {
    ...post,
    images: post.images ? JSON.parse(post.images) : []
  }
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params
  const post = await getPost(id)

  if (!post) {
    notFound()
  }

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
              <Link href="/dashboard">대시보드</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/community">
              <ArrowLeft className="mr-2 h-4 w-4" />
              게시판으로 돌아가기
            </Link>
          </Button>

          <Card>
            <CardHeader>
              {/* Category */}
              <div className="mb-4">
                <Badge variant="outline">{post.category}</Badge>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold mb-6">{post.title}</h1>

              {/* Author & Meta Info */}
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    {post.userImage ? (
                      <img
                        src={post.userImage}
                        alt={post.userName}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-bold text-primary">
                        {post.userName[0]}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{post.userName}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(post.createdAt).toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{post.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.comments}</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              {/* Content */}
              <div className="prose prose-lg max-w-none mb-8">
                <p className="whitespace-pre-wrap text-foreground leading-relaxed">
                  {post.content}
                </p>
              </div>

              {/* Images */}
              {post.images && post.images.length > 0 && (
                <div className="mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {post.images.map((imageBase64: string, index: number) => (
                      <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                        <img
                          src={imageBase64}
                          alt={`게시글 이미지 ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    {post.images.length}개의 이미지
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-6 border-t">
                <Button variant="outline" size="lg" className="flex-1">
                  <Heart className="mr-2 h-5 w-5" />
                  좋아요 {post.likes}
                </Button>
                <Button variant="outline" size="lg" className="flex-1">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  댓글 {post.comments}
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section (TODO: Implement later) */}
          <Card className="mt-8">
            <CardHeader>
              <h2 className="text-2xl font-bold">댓글 {post.comments}개</h2>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                댓글 기능은 곧 추가될 예정입니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
