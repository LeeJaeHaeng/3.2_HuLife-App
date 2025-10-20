import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { communities, communityMembers, chatRooms } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { getSession } from "@/lib/auth/session"
import { nanoid } from "nanoid"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const hobbyId = searchParams.get("hobbyId")

    let result

    if (hobbyId) {
      result = await db.select().from(communities).where(eq(communities.hobbyId, hobbyId))
    } else {
      result = await db.select().from(communities)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching communities:", error)
    return NextResponse.json(
      { error: "Failed to fetch communities" },
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

    const { name, hobbyId, description, location, schedule, maxMembers, imageUrl } = await request.json()

    // Validate required fields
    if (!name || !hobbyId || !description || !location || !schedule || !maxMembers) {
      return NextResponse.json(
        { error: "모든 필수 항목을 입력해주세요" },
        { status: 400 }
      )
    }

    // Create community
    const communityId = nanoid()
    const [newCommunity] = await db.insert(communities).values({
      id: communityId,
      name,
      hobbyId,
      description,
      location,
      schedule,
      maxMembers,
      imageUrl: imageUrl || "/placeholder.svg",
      leaderId: session.userId,
      memberCount: 1,
      createdAt: new Date(),
    })

    // Add creator as leader in community members
    await db.insert(communityMembers).values({
      id: nanoid(),
      communityId,
      userId: session.userId,
      role: "leader",
      joinedAt: new Date(),
    })

    // Create chat room for the community
    await db.insert(chatRooms).values({
      id: nanoid(),
      communityId,
      createdAt: new Date(),
    })

    return NextResponse.json({
      message: "커뮤니티가 생성되었습니다",
      community: {
        id: communityId,
        name,
        hobbyId,
        description,
        location,
        schedule,
        maxMembers,
        imageUrl,
        leaderId: session.userId,
        memberCount: 1,
      }
    })
  } catch (error) {
    console.error("Error creating community:", error)
    return NextResponse.json(
      { error: "커뮤니티 생성 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}
