'use server'

import { db } from '@/lib/db';
import { chatRooms, chatMessages, communityMembers } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getSession } from "@/lib/auth/session";
import { randomUUID } from 'crypto';

// Get chat room for a community
export async function getChatRoomByCommunity(communityId: string) {
  const session = await getSession();
  if (!session) {
    return null;
  }

  // Check if user is a member of the community
  const membership = await db.query.communityMembers.findFirst({
    where: and(
      eq(communityMembers.communityId, communityId),
      eq(communityMembers.userId, session.userId)
    )
  });

  if (!membership) {
    return null;
  }

  const chatRoom = await db.query.chatRooms.findFirst({
    where: eq(chatRooms.communityId, communityId)
  });

  return chatRoom;
}

// Get chat messages for a chat room
export async function getChatMessages(chatRoomId: string, limit: number = 50) {
  const messages = await db.query.chatMessages.findMany({
    where: eq(chatMessages.chatRoomId, chatRoomId),
    orderBy: [desc(chatMessages.createdAt)],
    limit,
  });

  return messages.reverse(); // Return in chronological order
}

// Send a message to a chat room
export async function sendMessage(chatRoomId: string, message: string) {
  const session = await getSession();
  if (!session) {
    return { error: "로그인이 필요합니다." };
  }

  // Get chat room and verify user is a member
  const chatRoom = await db.query.chatRooms.findFirst({
    where: eq(chatRooms.id, chatRoomId),
  });

  if (!chatRoom) {
    return { error: "채팅방을 찾을 수 없습니다." };
  }

  const membership = await db.query.communityMembers.findFirst({
    where: and(
      eq(communityMembers.communityId, chatRoom.communityId),
      eq(communityMembers.userId, session.userId)
    ),
    with: {
      user: true,
    }
  });

  if (!membership) {
    return { error: "채팅방에 접근할 수 없습니다." };
  }

  const messageId = randomUUID();
  await db.insert(chatMessages).values({
    id: messageId,
    chatRoomId,
    userId: session.userId,
    userName: membership.user.name,
    userImage: membership.user.profileImage || null,
    message,
  });

  const newMessage = await db.query.chatMessages.findFirst({
    where: eq(chatMessages.id, messageId),
  });

  return { success: true, message: newMessage };
}
