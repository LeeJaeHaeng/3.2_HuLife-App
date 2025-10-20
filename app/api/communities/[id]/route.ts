import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { communities, communityMembers, users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

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

    const result = {
      ...community,
      members
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
