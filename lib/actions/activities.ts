"use server";

import { db } from "@/lib/db";
import { userActivities } from "@/lib/db/schema";
import { eq, desc, and, gte, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { getUserSession } from "./auth";

export type ActivityType =
  | "view_hobby"
  | "view_community"
  | "view_post"
  | "search"
  | "join_community"
  | "add_hobby_interest"
  | "remove_hobby_interest"
  | "complete_survey"
  | "create_post"
  | "create_schedule";

export interface ActivityMetadata {
  searchQuery?: string;
  duration?: number;
  scrollDepth?: number;
  [key: string]: any;
}

/**
 * Log a user activity for recommendation and analytics purposes
 */
export async function logActivity(
  activityType: ActivityType,
  targetId?: string,
  metadata?: ActivityMetadata
) {
  try {
    const session = await getUserSession();
    if (!session?.user?.id) {
      console.warn("[Activity Log] No user session found, skipping log");
      return { success: false, error: "No session" };
    }

    const activityId = uuidv4();
    await db.insert(userActivities).values({
      id: activityId,
      userId: session.user.id,
      activityType,
      targetId: targetId || null,
      metadata: metadata || null,
    });

    console.log(`[Activity Log] ${activityType} logged for user ${session.user.id}`);
    return { success: true, activityId };
  } catch (error) {
    console.error("[Activity Log Error]", error);
    return { success: false, error: "Failed to log activity" };
  }
}

/**
 * Get user activities (for analytics)
 */
export async function getUserActivities(limit = 50, activityType?: ActivityType) {
  try {
    const session = await getUserSession();
    if (!session?.user?.id) {
      throw new Error("인증이 필요합니다.");
    }

    const conditions = [eq(userActivities.userId, session.user.id)];
    if (activityType) {
      conditions.push(eq(userActivities.activityType, activityType));
    }

    const activities = await db
      .select()
      .from(userActivities)
      .where(and(...conditions))
      .orderBy(desc(userActivities.createdAt))
      .limit(limit);

    return activities;
  } catch (error) {
    console.error("[Get Activities Error]", error);
    throw error;
  }
}

/**
 * Get activity statistics for a user
 */
export async function getActivityStats() {
  try {
    const session = await getUserSession();
    if (!session?.user?.id) {
      throw new Error("인증이 필요합니다.");
    }

    // Get activity counts by type
    const stats = await db
      .select({
        activityType: userActivities.activityType,
        count: sql<number>`count(*)`,
      })
      .from(userActivities)
      .where(eq(userActivities.userId, session.user.id))
      .groupBy(userActivities.activityType);

    // Get recent activities (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentCount = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(userActivities)
      .where(
        and(
          eq(userActivities.userId, session.user.id),
          gte(userActivities.createdAt, sevenDaysAgo)
        )
      );

    return {
      byType: stats,
      recentCount: recentCount[0]?.count || 0,
    };
  } catch (error) {
    console.error("[Get Activity Stats Error]", error);
    throw error;
  }
}

/**
 * Get most viewed hobbies based on activity logs
 */
export async function getMostViewedHobbies(limit = 10) {
  try {
    const session = await getUserSession();
    if (!session?.user?.id) {
      throw new Error("인증이 필요합니다.");
    }

    const mostViewed = await db
      .select({
        hobbyId: userActivities.targetId,
        viewCount: sql<number>`count(*)`,
      })
      .from(userActivities)
      .where(
        and(
          eq(userActivities.userId, session.user.id),
          eq(userActivities.activityType, "view_hobby")
        )
      )
      .groupBy(userActivities.targetId)
      .orderBy(desc(sql`count(*)`))
      .limit(limit);

    return mostViewed;
  } catch (error) {
    console.error("[Get Most Viewed Hobbies Error]", error);
    throw error;
  }
}
