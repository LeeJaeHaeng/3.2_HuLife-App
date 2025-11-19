import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { galleryComments, galleryItems, users } from "@/lib/db/schema"
import { eq, desc, inArray } from "drizzle-orm"
import { getSession } from "@/lib/auth/session"
import { nanoid } from "nanoid"

// GET /api/gallery/[id]/comments - 댓글 목록 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: galleryItemId } = await params

    // Get all comments for the gallery item
    const commentsData = await db
      .select()
      .from(galleryComments)
      .where(eq(galleryComments.galleryItemId, galleryItemId))
      .orderBy(desc(galleryComments.createdAt))

    // If no comments, return empty array
    if (commentsData.length === 0) {
      return NextResponse.json([])
    }

    // Get unique user IDs
    const userIds = [...new Set(commentsData.map(c => c.userId))]

    // Get latest user info for all comment authors
    const usersData = await db
      .select({
        id: users.id,
        name: users.name,
        profileImage: users.profileImage
      })
      .from(users)
      .where(inArray(users.id, userIds))

    // Create user map for quick lookup
    const userMap = new Map(usersData.map(u => [u.id, u]))

    // Merge comment data with latest user info
    const comments = commentsData.map(comment => {
      const latestUser = userMap.get(comment.userId)
      return {
        ...comment,
        userName: latestUser?.name || comment.userName,
        userImage: latestUser?.profileImage || comment.userImage
      }
    })

    console.log(`[갤러리 댓글] 작품 ${galleryItemId}의 댓글 ${comments.length}개 조회`)

    return NextResponse.json(comments)
  } catch (error) {
    console.error("[갤러리 댓글 조회 실패]", error)
    return NextResponse.json(
      { error: "댓글을 불러오는데 실패했습니다" },
      { status: 500 }
    )
  }
}

// POST /api/gallery/[id]/comments - 댓글 작성
export async function POST(
  request: NextRequest,
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

    const { id: galleryItemId } = await params
    const { content } = await request.json()

    // 유효성 검증
    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "댓글 내용을 입력해주세요" },
        { status: 400 }
      )
    }

    if (content.length > 500) {
      return NextResponse.json(
        { error: "댓글은 500자 이하로 작성해주세요" },
        { status: 400 }
      )
    }

    // 작품 존재 확인
    const item = await db
      .select()
      .from(galleryItems)
      .where(eq(galleryItems.id, galleryItemId))
      .then(results => results[0])

    if (!item) {
      return NextResponse.json(
        { error: "작품을 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    // 사용자 정보 조회
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

    // 댓글 생성
    const commentId = nanoid()
    await db.insert(galleryComments).values({
      id: commentId,
      galleryItemId,
      userId: session.userId,
      userName: user.name,
      userImage: user.profileImage || null,
      content: content.trim(),
      // createdAt은 schema의 defaultNow()가 자동 처리
    })

    // Get the created comment with actual createdAt from DB
    const createdComment = await db
      .select()
      .from(galleryComments)
      .where(eq(galleryComments.id, commentId))
      .then(results => results[0])

    console.log(`[갤러리 댓글] 작품 ${galleryItemId}에 댓글 작성: ${session.userId}`)

    return NextResponse.json({
      message: "댓글이 작성되었습니다",
      comment: createdComment
    })
  } catch (error) {
    console.error("[갤러리 댓글 작성 실패]", error)
    return NextResponse.json(
      { error: "댓글 작성 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}
