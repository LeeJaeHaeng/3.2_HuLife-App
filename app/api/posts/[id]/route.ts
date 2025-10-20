import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { posts } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const post = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .then(results => results[0])

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      )
    }

    // Increment view count
    await db
      .update(posts)
      .set({ views: post.views + 1 })
      .where(eq(posts.id, id))

    return NextResponse.json({ ...post, views: post.views + 1 })
  } catch (error) {
    console.error("Error fetching post details:", error)
    return NextResponse.json(
      { error: "Failed to fetch post details" },
      { status: 500 }
    )
  }
}
