import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { hobbies } from "@/lib/db/schema"
import { like, eq } from "drizzle-orm"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const query = searchParams.get("q")

    let result

    if (query) {
      // 검색 쿼리
      result = await db.select().from(hobbies).where(
        like(hobbies.name, `%${query}%`)
      )
    } else if (category) {
      // 카테고리 필터
      result = await db.select().from(hobbies).where(
        eq(hobbies.category, category)
      )
    } else {
      // 전체 조회
      result = await db.select().from(hobbies)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching hobbies:", error)
    return NextResponse.json(
      { error: "Failed to fetch hobbies" },
      { status: 500 }
    )
  }
}
