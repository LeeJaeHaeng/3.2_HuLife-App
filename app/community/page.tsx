import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllCommunities } from "@/lib/actions/community"
import { getAllPosts } from "@/lib/actions/posts"
import { CommunityList } from "@/components/community-list"
import { PostList } from "@/components/post-list"
import { CreatePostDialog } from "@/components/create-post-dialog"
import { CreateCommunityDialog } from "@/components/create-community-dialog"

export default async function CommunityPage() {
  const communities = await getAllCommunities()
  const posts = await getAllPosts()
  // </CHANGE>

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
              <Link href="/dashboard">대시보드</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-balance">커뮤니티</h1>
              <p className="text-xl text-muted-foreground text-pretty">
                같은 취미를 가진 사람들과 함께 이야기하고 모임에 참여하세요
              </p>
            </div>
            <CreateCommunityDialog />
          </div>

          <Tabs defaultValue="groups" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-12 mb-8">
              <TabsTrigger value="groups" className="text-base">
                모임 찾기
              </TabsTrigger>
              <TabsTrigger value="posts" className="text-base">
                게시판
              </TabsTrigger>
            </TabsList>

            <TabsContent value="groups">
              <CommunityList communities={communities} />
              {/* </CHANGE> */}
            </TabsContent>

            <TabsContent value="posts">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">커뮤니티 게시판</h2>
                <CreatePostDialog />
                {/* </CHANGE> */}
              </div>
              <PostList posts={posts} />
              {/* </CHANGE> */}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
