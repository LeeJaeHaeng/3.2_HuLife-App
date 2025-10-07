'use server'

import { db } from '@/lib/db';
import { hobbies, reviews, userHobbies, users } from '@/lib/db/schema';
import { eq, ilike, and, or, desc } from 'drizzle-orm';
import { getSession } from "@/lib/auth/session";
import { randomUUID } from 'crypto';

export async function getAllHobbies() {
  return db.query.hobbies.findMany();
}

export async function getHobbyById(id: string) {
  const hobby = await db.query.hobbies.findFirst({
    where: eq(hobbies.id, id),
  });
  return hobby ?? null;
}

export async function searchHobbies(query: string) {
  if (!query.trim()) {
    return db.query.hobbies.findMany();
  }
  const lowerQuery = `%${query.toLowerCase()}%`;
  return db.query.hobbies.findMany({
    where: or(
      ilike(hobbies.name, lowerQuery),
      ilike(hobbies.description, lowerQuery),
      ilike(hobbies.category, lowerQuery)
    )
  });
}

export async function getHobbiesByCategory(category: string) {
  return db.query.hobbies.findMany({
    where: eq(hobbies.category, category)
  });
}

export async function addHobbyToUser(hobbyId: string, status: "interested" | "learning" = "interested") {
  const session = await getSession();
  if (!session) {
    return { error: "로그인이 필요합니다." };
  }

  const hobby = await db.query.hobbies.findFirst({ where: eq(hobbies.id, hobbyId) });
  if (!hobby) {
    return { error: "취미를 찾을 수 없습니다." };
  }

  const existing = await db.query.userHobbies.findFirst({
    where: and(
      eq(userHobbies.userId, session.userId),
      eq(userHobbies.hobbyId, hobbyId)
    )
  });

  if (existing) {
    return { error: "이미 추가된 취미입니다." };
  }

  const userHobbyId = randomUUID();
  await db.insert(userHobbies).values({
    id: userHobbyId,
    userId: session.userId,
    hobbyId,
    status,
    progress: 0,
  });

  const newUserHobby = await db.query.userHobbies.findFirst({
    where: eq(userHobbies.id, userHobbyId),
  });

  return { success: true, userHobby: newUserHobby };
}

export async function removeHobbyFromUser(hobbyId: string) {
  const session = await getSession();
  if (!session) {
    return { error: "로그인이 필요합니다." };
  }

  const existing = await db.query.userHobbies.findFirst({
    where: and(
      eq(userHobbies.userId, session.userId),
      eq(userHobbies.hobbyId, hobbyId)
    )
  });

  if (!existing) {
    return { error: "관심 취미를 찾을 수 없습니다." };
  }

  await db.delete(userHobbies).where(eq(userHobbies.id, existing.id));

  return { success: true };
}

export async function updateHobbyProgress(userHobbyId: string, progress: number) {
  const session = await getSession();
  if (!session) {
    return { error: "로그인이 필요합니다." };
  }

  const existing = await db.query.userHobbies.findFirst({
      where: and(
          eq(userHobbies.id, userHobbyId),
          eq(userHobbies.userId, session.userId)
      )
  });

  if (!existing) {
      return { error: "수정할 취미 활동을 찾을 수 없습니다." };
  }

  await db.update(userHobbies).set({
    progress,
    ...(progress >= 100 ? { status: "completed", completedAt: new Date() } : {}),
  }).where(eq(userHobbies.id, userHobbyId));

  const updated = await db.query.userHobbies.findFirst({
    where: eq(userHobbies.id, userHobbyId),
  });

  if (!updated) {
    return { error: "취미 진행 상태를 업데이트하지 못했습니다." };
  }

  return { success: true, userHobby: updated };
}

export async function getUserHobbies() {
  const session = await getSession();
  if (!session) {
    return [];
  }

  return db.query.userHobbies.findMany({
    where: eq(userHobbies.userId, session.userId),
    with: {
      hobby: true
    }
  });
}

export async function addReview(hobbyId: string, rating: number, comment: string) {
  const session = await getSession();
  if (!session) {
    return { error: "로그인이 필요합니다." };
  }

  const user = await db.query.users.findFirst({ where: eq(users.id, session.userId) });
  if (!user) {
    return { error: "사용자를 찾을 수 없습니다." };
  }

  const reviewId = randomUUID();
  await db.insert(reviews).values({
    id: reviewId,
    userId: session.userId,
    userName: user.name,
    hobbyId,
    rating,
    comment,
  });

  const newReview = await db.query.reviews.findFirst({
    where: eq(reviews.id, reviewId),
  });

  return { success: true, review: newReview };
}

export async function getHobbyReviews(hobbyId: string) {
  return db.query.reviews.findMany({
    where: eq(reviews.hobbyId, hobbyId),
    orderBy: [desc(reviews.createdAt)],
  });
}