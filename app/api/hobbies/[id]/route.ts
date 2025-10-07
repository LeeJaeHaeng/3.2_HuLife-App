import { NextResponse } from "next/server"
import { db } from "@/lib/db/store"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const hobby = db.getHobby(id)

  if (!hobby) {
    return NextResponse.json({ error: "Hobby not found" }, { status: 404 })
  }

  return NextResponse.json(hobby)
}
