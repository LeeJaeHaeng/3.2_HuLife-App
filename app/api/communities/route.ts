import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { communities } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

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
