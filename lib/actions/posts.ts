'use server'

import { db } from '@/lib/db';
import { posts, users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getSession } from "@/lib/auth/session";
import { randomUUID } from 'crypto';

export async function getAllPosts() {
  return db.query.posts.findMany({
    orderBy: [desc(posts.createdAt)],
  });
}

export async function getPostById(id: string) {
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, id),
  });
  return post ?? null;
}

export async function createPost(data: { title: string; content: string; category: string }) {
  const session = await getSession();
  if (!session) {
    return { error: "로그인이 필요합니다." };
  }

  const user = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
      columns: {
          name: true,
          profileImage: true,
      }
  });

  if (!user) {
    return { error: "사용자를 찾을 수 없습니다." };
  }

  const postId = randomUUID();
  await db.insert(posts).values({
    id: postId,
    userId: session.userId,
    userName: user.name,
    userImage: user.profileImage,
    title: data.title,
    content: data.content,
    category: data.category,
  });

  const newPost = await db.query.posts.findFirst({
    where: eq(posts.id, postId),
  });

  return { success: true, post: newPost };
}