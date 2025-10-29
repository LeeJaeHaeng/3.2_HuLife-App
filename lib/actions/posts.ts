'use server'

import { db } from '@/lib/db';
import { posts, users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getSession } from "@/lib/auth/session";
import { randomUUID } from 'crypto';

export async function getAllPosts() {
  const allPosts = await db.query.posts.findMany({
    orderBy: [desc(posts.createdAt)],
  });

  // Parse images JSON string to array
  return allPosts.map(post => ({
    ...post,
    images: post.images ? JSON.parse(post.images) : []
  }));
}

export async function getPostById(id: string) {
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, id),
  });

  if (!post) return null;

  // Parse images JSON string to array
  return {
    ...post,
    images: post.images ? JSON.parse(post.images) : []
  };
}

export async function createPost(data: { title: string; content: string; category: string; images?: string[] }) {
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
    images: data.images && data.images.length > 0 ? JSON.stringify(data.images) : null, // Base64 이미지 배열을 JSON 문자열로 저장
  });

  const newPost = await db.query.posts.findFirst({
    where: eq(posts.id, postId),
  });

  if (!newPost) {
    return { error: "게시글 작성에 실패했습니다." };
  }

  return {
    success: true,
    post: {
      ...newPost,
      images: newPost.images ? JSON.parse(newPost.images) : []
    }
  };
}