import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userActivities } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// POST /api/activities - Log user activity
export async function POST(request: NextRequest) {
  try {
    // Get user ID from session/auth (you'll need to implement this based on your auth system)
    const userId = request.headers.get("x-user-id"); // Temporary - replace with actual auth

    if (!userId) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { activityType, targetId, metadata } = body;

    // Validate activity type
    const validActivityTypes = [
      "view_hobby",
      "view_community",
      "view_post",
      "search",
      "join_community",
      "add_hobby_interest",
      "remove_hobby_interest",
      "complete_survey",
      "create_post",
      "create_schedule"
    ];

    if (!activityType || !validActivityTypes.includes(activityType)) {
      return NextResponse.json(
        { error: "유효하지 않은 활동 타입입니다." },
        { status: 400 }
      );
    }

    // Insert activity log
    const activityId = uuidv4();
    await db.insert(userActivities).values({
      id: activityId,
      userId,
      activityType,
      targetId: targetId || null,
      metadata: metadata || null,
    });

    return NextResponse.json(
      {
        success: true,
        message: "활동이 기록되었습니다.",
        activityId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[활동 로그 API 에러]", error);
    return NextResponse.json(
      { error: "활동 기록에 실패했습니다." },
      { status: 500 }
    );
  }
}

// GET /api/activities - Get user activities (for analytics/debugging)
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const activityType = searchParams.get("type");

    // Build query
    let query = db
      .select()
      .from(userActivities)
      .where(eq(userActivities.userId, userId))
      .orderBy(desc(userActivities.createdAt))
      .limit(limit);

    // Filter by activity type if provided
    if (activityType) {
      query = query.where(eq(userActivities.activityType, activityType));
    }

    const activities = await query;

    return NextResponse.json({
      success: true,
      activities,
      count: activities.length,
    });
  } catch (error) {
    console.error("[활동 조회 API 에러]", error);
    return NextResponse.json(
      { error: "활동 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}
