import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { hobbies } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const result = await db.select().from(hobbies).where(eq(hobbies.id, id))

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Hobby not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching hobby:", error)
    return NextResponse.json(
      { error: "Failed to fetch hobby" },
      { status: 500 }
    )
  }
}
