import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { communities, communityMembers, joinRequests } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { getSession } from "@/lib/auth/session"
import { nanoid } from "nanoid"

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { error: "로그인이 필요합니다" },
        { status: 401 }
      )
    }

    const { communityId } = await request.json()

    if (!communityId) {
      return NextResponse.json(
        { error: "커뮤니티 ID가 필요합니다" },
        { status: 400 }
      )
    }

    // Check if community exists
    const community = await db
      .select()
      .from(communities)
      .where(eq(communities.id, communityId))
      .then(results => results[0])

    if (!community) {
      return NextResponse.json(
        { error: "커뮤니티를 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    // Check if user is already a member
    const existingMember = await db
      .select()
      .from(communityMembers)
      .where(
        and(
          eq(communityMembers.communityId, communityId),
          eq(communityMembers.userId, session.userId)
        )
      )
      .then(results => results[0])

    if (existingMember) {
      return NextResponse.json(
        { error: "이미 가입된 커뮤니티입니다" },
        { status: 400 }
      )
    }

    // Check if there's already a pending request
    const existingRequest = await db
      .select()
      .from(joinRequests)
      .where(
        and(
          eq(joinRequests.communityId, communityId),
          eq(joinRequests.userId, session.userId),
          eq(joinRequests.status, "pending")
        )
      )
      .then(results => results[0])

    if (existingRequest) {
      return NextResponse.json(
        { error: "이미 가입 신청이 진행 중입니다" },
        { status: 400 }
      )
    }

    // Create join request
    await db.insert(joinRequests).values({
      id: nanoid(),
      communityId,
      userId: session.userId,
      status: "pending",
      createdAt: new Date(),
    })

    return NextResponse.json({
      message: "가입 신청이 완료되었습니다"
    })
  } catch (error) {
    console.error("Error joining community:", error)
    return NextResponse.json(
      { error: "가입 신청 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}
