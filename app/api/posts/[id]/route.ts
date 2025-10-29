import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { posts, users, postLikes } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { getSession } from "@/lib/auth/session"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getSession()

    // Get post with user info (for latest profile image)
    const result = await db
      .select({
        post: posts,
        user: { profileImage: users.profileImage, name: users.name }
      })
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .where(eq(posts.id, id))
      .then(results => results[0])

    if (!result || !result.post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      )
    }

    const post = result.post
    const user = result.user

    // Increment view count
    await db
      .update(posts)
      .set({ views: post.views + 1 })
      .where(eq(posts.id, id))

    // Check if user liked this post
    let isLiked = false
    if (session) {
      const like = await db
        .select()
        .from(postLikes)
        .where(and(
          eq(postLikes.postId, id),
          eq(postLikes.userId, session.userId)
        ))
        .then(results => results[0])

      isLiked = !!like
    }

    // Parse images JSON string to array
    const parsedPost = {
      ...post,
      views: post.views + 1,
      userImage: user?.profileImage || post.userImage, // 최신 프로필 이미지
      userName: user?.name || post.userName, // 최신 이름
      images: post.images ? JSON.parse(post.images) : [],
      isLiked // 좋아요 상태 추가
    }

    return NextResponse.json(parsedPost)
  } catch (error) {
    console.error("Error fetching post details:", error)
    return NextResponse.json(
      { error: "Failed to fetch post details" },
      { status: 500 }
    )
  }
}
