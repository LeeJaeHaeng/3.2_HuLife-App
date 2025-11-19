import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { galleryItems, galleryLikes } from '@/lib/db/schema';
import { getSession } from '@/lib/auth/session';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

// POST /api/gallery/[id]/like - 좋아요 토글
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { id } = params;

    // 작품 존재 확인
    const item = await db.select().from(galleryItems).where(eq(galleryItems.id, id)).limit(1);

    if (item.length === 0) {
      return NextResponse.json(
        { error: '작품을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 기존 좋아요 확인
    const existingLike = await db
      .select()
      .from(galleryLikes)
      .where(
        and(
          eq(galleryLikes.galleryItemId, id),
          eq(galleryLikes.userId, session.userId)
        )
      )
      .limit(1);

    let isLiked = false;
    let newLikesCount = item[0].likes;

    if (existingLike.length > 0) {
      // 좋아요 취소
      await db
        .delete(galleryLikes)
        .where(
          and(
            eq(galleryLikes.galleryItemId, id),
            eq(galleryLikes.userId, session.userId)
          )
        );

      newLikesCount = Math.max(0, item[0].likes - 1);
      await db
        .update(galleryItems)
        .set({ likes: newLikesCount })
        .where(eq(galleryItems.id, id));

      isLiked = false;
    } else {
      // 좋아요 추가
      await db.insert(galleryLikes).values({
        id: uuidv4(),
        galleryItemId: id,
        userId: session.userId,
        createdAt: new Date(),
      });

      newLikesCount = item[0].likes + 1;
      await db
        .update(galleryItems)
        .set({ likes: newLikesCount })
        .where(eq(galleryItems.id, id));

      isLiked = true;
    }

    return NextResponse.json({
      success: true,
      isLiked,
      likes: newLikesCount,
      message: isLiked ? '좋아요를 눌렀습니다.' : '좋아요를 취소했습니다.',
    });
  } catch (error) {
    console.error('[Gallery API] 좋아요 오류:', error);
    return NextResponse.json(
      { error: '좋아요 처리에 실패했습니다.' },
      { status: 500 }
    );
  }
}
