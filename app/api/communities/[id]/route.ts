import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { communities, communityMembers, users, joinRequests } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { getSession } from "@/lib/auth/session"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get community with members
    const community = await db
      .select()
      .from(communities)
      .where(eq(communities.id, id))
      .then(results => results[0])

    if (!community) {
      return NextResponse.json(
        { error: "Community not found" },
        { status: 404 }
      )
    }

    // Get community members with user information
    const members = await db
      .select({
        id: communityMembers.id,
        userId: communityMembers.userId,
        role: communityMembers.role,
        joinedAt: communityMembers.joinedAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        }
      })
      .from(communityMembers)
      .innerJoin(users, eq(communityMembers.userId, users.id))
      .where(eq(communityMembers.communityId, id))

    // Check if current user has a pending join request
    const session = await getSession()
    let hasPendingRequest = false
    if (session) {
      const existingRequest = await db
        .select()
        .from(joinRequests)
        .where(
          and(
            eq(joinRequests.communityId, id),
            eq(joinRequests.userId, session.userId),
            eq(joinRequests.status, "pending")
          )
        )
        .then(results => results[0])

      hasPendingRequest = !!existingRequest
    }

    const result = {
      ...community,
      members,
      hasPendingRequest
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching community details:", error)
    return NextResponse.json(
      { error: "Failed to fetch community details" },
      { status: 500 }
    )
  }
}

// PUT - Update community (leader only)
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
    const { name, description, location, schedule, maxMembers, imageUrl } = await request.json()

    // Check if community exists and user is leader
    const community = await db
      .select()
      .from(communities)
      .where(eq(communities.id, id))
      .then(results => results[0])

    if (!community) {
      return NextResponse.json(
        { error: "커뮤니티를 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    if (community.leaderId !== session.userId) {
      return NextResponse.json(
        { error: "리더만 커뮤니티를 수정할 수 있습니다" },
        { status: 403 }
      )
    }

    // Update community
    await db
      .update(communities)
      .set({
        name: name ?? community.name,
        description: description ?? community.description,
        location: location ?? community.location,
        schedule: schedule ?? community.schedule,
        maxMembers: maxMembers ?? community.maxMembers,
        imageUrl: imageUrl ?? community.imageUrl,
      })
      .where(eq(communities.id, id))

    // Get updated community
    const updatedCommunity = await db
      .select()
      .from(communities)
      .where(eq(communities.id, id))
      .then(results => results[0])

    return NextResponse.json({
      message: "커뮤니티가 수정되었습니다",
      community: updatedCommunity
    })
  } catch (error) {
    console.error("Error updating community:", error)
    return NextResponse.json(
      { error: "커뮤니티 수정 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}

// DELETE - Delete community (leader only)
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

    // Check if community exists and user is leader
    const community = await db
      .select()
      .from(communities)
      .where(eq(communities.id, id))
      .then(results => results[0])

    if (!community) {
      return NextResponse.json(
        { error: "커뮤니티를 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    if (community.leaderId !== session.userId) {
      return NextResponse.json(
        { error: "리더만 커뮤니티를 삭제할 수 있습니다" },
        { status: 403 }
      )
    }

    // Delete community (members and chat will be cascade deleted if foreign key constraints are set)
    await db
      .delete(communities)
      .where(eq(communities.id, id))

    return NextResponse.json({
      message: "커뮤니티가 삭제되었습니다"
    })
  } catch (error) {
    console.error("Error deleting community:", error)
    return NextResponse.json(
      { error: "커뮤니티 삭제 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}
