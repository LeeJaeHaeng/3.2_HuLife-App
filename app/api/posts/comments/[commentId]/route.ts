import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { postComments, posts } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { getSession } from "@/lib/auth/session"

// PUT - Update comment
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { error: "로그인이 필요합니다" },
        { status: 401 }
      )
    }

    const { commentId } = await params
    const { content } = await request.json()

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "댓글 내용을 입력해주세요" },
        { status: 400 }
      )
    }

    // Check if comment exists and belongs to user
    const comment = await db
      .select()
      .from(postComments)
      .where(eq(postComments.id, commentId))
      .then(results => results[0])

    if (!comment) {
      return NextResponse.json(
        { error: "댓글을 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    if (comment.userId !== session.userId) {
      return NextResponse.json(
        { error: "본인의 댓글만 수정할 수 있습니다" },
        { status: 403 }
      )
    }

    // Update comment
    await db
      .update(postComments)
      .set({
        content: content.trim()
      })
      .where(eq(postComments.id, commentId))

    // Get updated comment
    const updatedComment = await db
      .select()
      .from(postComments)
      .where(eq(postComments.id, commentId))
      .then(results => results[0])

    return NextResponse.json({
      message: "댓글이 수정되었습니다",
      comment: updatedComment
    })
  } catch (error) {
    console.error("Error updating comment:", error)
    return NextResponse.json(
      { error: "댓글 수정 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}

// DELETE - Delete comment
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { error: "로그인이 필요합니다" },
        { status: 401 }
      )
    }

    const { commentId } = await params

    // Check if comment exists and belongs to user
    const comment = await db
      .select()
      .from(postComments)
      .where(eq(postComments.id, commentId))
      .then(results => results[0])

    if (!comment) {
      return NextResponse.json(
        { error: "댓글을 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    if (comment.userId !== session.userId) {
      return NextResponse.json(
        { error: "본인의 댓글만 삭제할 수 있습니다" },
        { status: 403 }
      )
    }

    // Delete comment
    await db
      .delete(postComments)
      .where(eq(postComments.id, commentId))

    // Decrease comment count on post
    const post = await db
      .select()
      .from(posts)
      .where(eq(posts.id, comment.postId))
      .then(results => results[0])

    if (post && post.comments > 0) {
      await db
        .update(posts)
        .set({ comments: post.comments - 1 })
        .where(eq(posts.id, comment.postId))
    }

    return NextResponse.json({
      message: "댓글이 삭제되었습니다"
    })
  } catch (error) {
    console.error("Error deleting comment:", error)
    return NextResponse.json(
      { error: "댓글 삭제 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}
