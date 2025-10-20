import { db } from "@/lib/db";
import { hobbies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const hobbyId = params.id; // 문자열 ID를 그대로 사용

    const hobbyResult = await db
      .select()
      .from(hobbies)
      .where(eq(hobbies.id, hobbyId));

    const hobby = hobbyResult[0];

    if (!hobby) {
      return NextResponse.json({ error: "Hobby not found" }, { status: 404 });
    }

    return NextResponse.json(hobby);

  } catch (error) {
    console.error("[HOBBY_ID_GET]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}