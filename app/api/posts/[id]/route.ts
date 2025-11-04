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

// PUT - Update post
export async function PUT(
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

    const { id } = await params
    const { title, content, category, images } = await request.json()

    // Validate required fields
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: "제목, 내용, 카테고리를 모두 입력해주세요" },
        { status: 400 }
      )
    }

    // Check if post exists and belongs to user
    const post = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .then(results => results[0])

    if (!post) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    if (post.userId !== session.userId) {
      return NextResponse.json(
        { error: "본인의 게시글만 수정할 수 있습니다" },
        { status: 403 }
      )
    }

    // Update post
    await db
      .update(posts)
      .set({
        title,
        content,
        category,
        images: images && images.length > 0 ? JSON.stringify(images) : null
      })
      .where(eq(posts.id, id))

    // Get updated post
    const updatedPost = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .then(results => results[0])

    return NextResponse.json({
      message: "게시글이 수정되었습니다",
      post: {
        ...updatedPost,
        images: updatedPost.images ? JSON.parse(updatedPost.images) : []
      }
    })
  } catch (error) {
    console.error("Error updating post:", error)
    return NextResponse.json(
      { error: "게시글 수정 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}

// DELETE - Delete post
export async function DELETE(
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

    const { id } = await params

    // Check if post exists and belongs to user
    const post = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .then(results => results[0])

    if (!post) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    if (post.userId !== session.userId) {
      return NextResponse.json(
        { error: "본인의 게시글만 삭제할 수 있습니다" },
        { status: 403 }
      )
    }

    // Delete post (comments and likes will be cascade deleted if foreign key constraints are set)
    await db
      .delete(posts)
      .where(eq(posts.id, id))

    return NextResponse.json({
      message: "게시글이 삭제되었습니다"
    })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json(
      { error: "게시글 삭제 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}
