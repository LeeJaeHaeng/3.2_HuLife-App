import { NextResponse } from "next/server"
import { db } from "@/lib/db/store"

export async function GET() {
  const posts = db.getAllPosts()
  return NextResponse.json(posts)
}
