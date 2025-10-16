import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { posts } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

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
