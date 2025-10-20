import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { communities, chatMessages } from "@/lib/db/schema"
import { desc, sql } from "drizzle-orm"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "10")

    // 활동이 활발한 모임 정렬 기준:
    // 1. 멤버 수가 많을수록
    // 2. 최근에 활동이 있을수록 (createdAt)
    const result = await db
      .select()
      .from(communities)
      .orderBy(desc(communities.memberCount), desc(communities.createdAt))
      .limit(limit)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching active communities:", error)
    return NextResponse.json(
      { error: "Failed to fetch active communities" },
      { status: 500 }
    )
  }
}
