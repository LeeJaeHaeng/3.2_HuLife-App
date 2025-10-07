import { NextResponse } from "next/server"
import { db } from "@/lib/db/store"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const query = searchParams.get("q")

  let hobbies

  if (query) {
    hobbies = db.searchHobbies(query)
  } else if (category) {
    hobbies = db.getHobbiesByCategory(category)
  } else {
    hobbies = db.getAllHobbies()
  }

  return NextResponse.json(hobbies)
}
