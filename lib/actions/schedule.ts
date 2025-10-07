'use server'

import { db } from '@/lib/db';
import { schedules } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getSession } from "@/lib/auth/session";
import { randomUUID } from 'crypto';

export async function getUserSchedules() {
  const session = await getSession();
  if (!session) {
    return [];
  }

  return db.query.schedules.findMany({
    where: eq(schedules.userId, session.userId),
    orderBy: [desc(schedules.date)],
  });
}

export async function createSchedule(data: {
  title: string
  hobbyId?: string
  date: Date
  time: string
  location?: string
  type: "class" | "practice" | "meeting" | "event"
}) {
  const session = await getSession();
  if (!session) {
    return { error: "로그인이 필요합니다." };
  }

  const scheduleId = randomUUID();
  await db.insert(schedules).values({
    id: scheduleId,
    userId: session.userId,
    ...data,
  });

  const newSchedule = await db.query.schedules.findFirst({
    where: eq(schedules.id, scheduleId),
  });

  return { success: true, schedule: newSchedule };
}