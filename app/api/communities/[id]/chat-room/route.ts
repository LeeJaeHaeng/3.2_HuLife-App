import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chatRooms, communityMembers } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';
import { v4 as uuidv4 } from 'uuid';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const communityId = params.id;

    // Check if user is a member
    const membership = await db.query.communityMembers.findFirst({
      where: and(
        eq(communityMembers.communityId, communityId),
        eq(communityMembers.userId, session.userId)
      ),
    });

    if (!membership) {
      return NextResponse.json(
        { error: '커뮤니티 멤버만 채팅방에 접근할 수 있습니다.' },
        { status: 403 }
      );
    }

    // Find existing chat room
    let chatRoom = await db.query.chatRooms.findFirst({
      where: eq(chatRooms.communityId, communityId),
    });

    // Create chat room if it doesn't exist
    if (!chatRoom) {
      const newChatRoom = {
        id: uuidv4(),
        communityId,
        createdAt: new Date(),
      };

      await db.insert(chatRooms).values(newChatRoom);
      chatRoom = newChatRoom;

      console.log(`[API] Created new chat room for community ${communityId}`);
    }

    return NextResponse.json(chatRoom);
  } catch (error) {
    console.error('[API] Get/Create chat room error:', error);
    return NextResponse.json(
      { error: '채팅방 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}
