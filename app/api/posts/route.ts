import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { posts, users } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { getSession } from "@/lib/auth/session"
import { nanoid } from "nanoid"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    let result

    if (category && category !== "전체") {
      result = await db.select().from(posts).where(eq(posts.category, category)).orderBy(desc(posts.createdAt))
    } else {
      result = await db.select().from(posts).orderBy(desc(posts.createdAt))
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { error: "로그인이 필요합니다" },
        { status: 401 }
      )
    }

    const { title, content, category } = await request.json()

    // Validate required fields
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: "제목, 내용, 카테고리를 모두 입력해주세요" },
        { status: 400 }
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

    // Create post
    const postId = nanoid()
    await db.insert(posts).values({
      id: postId,
      userId: session.userId,
      userName: user.name,
      userImage: user.profileImage || null,
      title,
      content,
      category,
      likes: 0,
      comments: 0,
      views: 0,
      createdAt: new Date(),
    })

    return NextResponse.json({
      message: "게시글이 작성되었습니다",
      post: {
        id: postId,
        title,
        content,
        category,
        userName: user.name,
      }
    })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json(
      { error: "게시글 작성 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}
