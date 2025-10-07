import { NextResponse } from "next/server"
import { db } from "@/lib/db/store"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const hobbyId = searchParams.get("hobbyId")

  let communities

  if (hobbyId) {
    communities = db.getCommunitiesByHobby(hobbyId)
  } else {
    communities = db.getAllCommunities()
  }

  return NextResponse.json(communities)
}
