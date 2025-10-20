import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { postComments, posts, users } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { getSession } from "@/lib/auth/session"
import { nanoid } from "nanoid"

// GET all comments for a post
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const comments = await db
      .select({
        id: postComments.id,
        postId: postComments.postId,
        userId: postComments.userId,
        userName: postComments.userName,
        userImage: postComments.userImage,
        content: postComments.content,
        createdAt: postComments.createdAt,
      })
      .from(postComments)
      .where(eq(postComments.postId, id))
      .orderBy(desc(postComments.createdAt))

    return NextResponse.json(comments)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    )
  }
}

// POST a new comment
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
    const { content } = await request.json()

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "댓글 내용을 입력해주세요" },
        { status: 400 }
      )
    }

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

    // Get user info
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))
      .then(results => results[0])

    if (!user) {
      return NextResponse.json(
        { error: "사용자 정보를 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    // Create comment
    const commentId = nanoid()
    await db.insert(postComments).values({
      id: commentId,
      postId,
      userId: session.userId,
      userName: user.name,
      userImage: user.profileImage || null,
      content: content.trim(),
      createdAt: new Date(),
    })

    // Update comment count
    await db
      .update(posts)
      .set({ comments: post.comments + 1 })
      .where(eq(posts.id, postId))

    return NextResponse.json({
      message: "댓글이 작성되었습니다",
      comment: {
        id: commentId,
        postId,
        userId: session.userId,
        userName: user.name,
        userImage: user.profileImage,
        content: content.trim(),
        createdAt: new Date(),
      }
    })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json(
      { error: "댓글 작성 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}
