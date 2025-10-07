'use server'

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from "@/lib/auth/session";

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) {
    return null;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
  });

  return user ?? null;
}

export async function updateUserProfile(data: {
  name?: string
  age?: number
  location?: string
  phone?: string
  profileImage?: string
}) {
  const session = await getSession();
  if (!session) {
    return { error: "로그인이 필요합니다." };
  }

  await db.update(users).set(data).where(eq(users.id, session.userId));

  const updatedUser = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
  });

  if (!updatedUser) {
    return { error: "사용자를 찾을 수 없습니다." };
  }

  return { success: true, user: updatedUser };
}