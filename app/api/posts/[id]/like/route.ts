import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { postLikes, posts } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { getSession } from "@/lib/auth/session"
import { nanoid } from "nanoid"

// POST - Toggle like on a post
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { error: "로그인이 필요합니다" },
        { status: 401 }
      )
    }

    const { id: postId } = await params

    // Check if post exists
    const post = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .then(results => results[0])

    if (!post) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    // Check if user already liked this post
    const existingLike = await db
      .select()
      .from(postLikes)
      .where(and(
        eq(postLikes.postId, postId),
        eq(postLikes.userId, session.userId)
      ))
      .then(results => results[0])

    if (existingLike) {
      // Unlike: remove like and decrease count
      await db
        .delete(postLikes)
        .where(eq(postLikes.id, existingLike.id))

      await db
        .update(posts)
        .set({ likes: Math.max(0, post.likes - 1) })
        .where(eq(posts.id, postId))

      return NextResponse.json({
        message: "좋아요를 취소했습니다",
        liked: false,
        likesCount: Math.max(0, post.likes - 1)
      })
    } else {
      // Like: add like and increase count
      const likeId = nanoid()
      await db.insert(postLikes).values({
        id: likeId,
        postId,
        userId: session.userId,
        createdAt: new Date(),
      })

      await db
        .update(posts)
        .set({ likes: post.likes + 1 })
        .where(eq(posts.id, postId))

      return NextResponse.json({
        message: "좋아요를 눌렀습니다",
        liked: true,
        likesCount: post.likes + 1
      })
    }
  } catch (error) {
    console.error("Error toggling like:", error)
    return NextResponse.json(
      { error: "좋아요 처리 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}

// GET - Check if current user liked this post
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ liked: false })
    }

    const { id: postId } = await params

    const existingLike = await db
      .select()
      .from(postLikes)
      .where(and(
        eq(postLikes.postId, postId),
        eq(postLikes.userId, session.userId)
      ))
      .then(results => results[0])

    return NextResponse.json({ liked: !!existingLike })
  } catch (error) {
    console.error("Error checking like status:", error)
    return NextResponse.json({ liked: false })
  }
}
