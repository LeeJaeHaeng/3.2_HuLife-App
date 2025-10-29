import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { posts, users, postLikes } from "@/lib/db/schema"
import { eq, desc, and } from "drizzle-orm"
import { getSession } from "@/lib/auth/session"
import { nanoid } from "nanoid"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const session = await getSession()

    let result

    if (category && category !== "전체") {
      result = await db
        .select({
          post: posts,
          user: { profileImage: users.profileImage, name: users.name }
        })
        .from(posts)
        .leftJoin(users, eq(posts.userId, users.id))
        .where(eq(posts.category, category))
        .orderBy(desc(posts.createdAt))
    } else {
      result = await db
        .select({
          post: posts,
          user: { profileImage: users.profileImage, name: users.name }
        })
        .from(posts)
        .leftJoin(users, eq(posts.userId, users.id))
        .orderBy(desc(posts.createdAt))
    }

    // Get user's liked posts if logged in
    let likedPostIds = new Set<string>()
    if (session) {
      const userLikes = await db
        .select({ postId: postLikes.postId })
        .from(postLikes)
        .where(eq(postLikes.userId, session.userId))

      likedPostIds = new Set(userLikes.map(like => like.postId))
    }

    // Parse images JSON string to array and use latest profile image from user table
    const parsedResult = result.map(({ post, user }) => ({
      ...post,
      userImage: user?.profileImage || post.userImage, // 최신 프로필 이미지 사용
      userName: user?.name || post.userName, // 최신 이름 사용
      images: post.images ? JSON.parse(post.images) : [],
      isLiked: likedPostIds.has(post.id) // 좋아요 상태 추가
    }))

    return NextResponse.json(parsedResult)
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

    const { title, content, category, images } = await request.json()

    // Validate required fields
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: "제목, 내용, 카테고리를 모두 입력해주세요" },
        { status: 400 }
      )
    }

    // Validate images if provided (optional)
    if (images && (!Array.isArray(images) || images.length > 5)) {
      return NextResponse.json(
        { error: "이미지는 최대 5개까지만 업로드할 수 있습니다" },
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
      images: images && images.length > 0 ? JSON.stringify(images) : null, // Base64 이미지 배열을 JSON 문자열로 저장
      likes: 0,
      comments: 0,
      views: 0,
      createdAt: new Date(),
    })

    console.log(`[게시글 생성] ID: ${postId}, 제목: ${title}, 이미지: ${images?.length || 0}개`)

    return NextResponse.json({
      message: "게시글이 작성되었습니다",
      post: {
        id: postId,
        title,
        content,
        category,
        userName: user.name,
        images: images || [],
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
