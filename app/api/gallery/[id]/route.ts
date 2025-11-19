import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { galleryItems, galleryLikes } from '@/lib/db/schema';
import { getSession } from '@/lib/auth/session';
import { eq, and } from 'drizzle-orm';

// GET /api/gallery/[id] - 갤러리 작품 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const item = await db.select().from(galleryItems).where(eq(galleryItems.id, id)).limit(1);

    if (item.length === 0) {
      return NextResponse.json(
        { error: '작품을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 조회수 증가
    await db
      .update(galleryItems)
      .set({ views: item[0].views + 1 })
      .where(eq(galleryItems.id, id));

    return NextResponse.json({ galleryItem: { ...item[0], views: item[0].views + 1 } });
  } catch (error) {
    console.error('[Gallery API] 상세 조회 오류:', error);
    return NextResponse.json(
      { error: '작품을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// PUT /api/gallery/[id] - 갤러리 작품 수정
export async function PUT(
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
    const body = await request.json();
    const { title, description, image } = body;

    // 기존 작품 조회
    const existingItem = await db.select().from(galleryItems).where(eq(galleryItems.id, id)).limit(1);

    if (existingItem.length === 0) {
      return NextResponse.json(
        { error: '작품을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 작성자 확인
    if (existingItem[0].userId !== session.userId) {
      return NextResponse.json(
        { error: '본인의 작품만 수정할 수 있습니다.' },
        { status: 403 }
      );
    }

    // 제목 길이 검증
    if (title && (title.length < 2 || title.length > 100)) {
      return NextResponse.json(
        { error: '제목은 2-100자 이내로 입력해주세요.' },
        { status: 400 }
      );
    }

    // 이미지 검증 (변경되는 경우)
    if (image && !image.startsWith('data:image/')) {
      return NextResponse.json(
        { error: '올바른 이미지 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    // 업데이트할 필드 구성
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image;

    await db
      .update(galleryItems)
      .set(updateData)
      .where(eq(galleryItems.id, id));

    // 업데이트된 작품 조회
    const updatedItem = await db.select().from(galleryItems).where(eq(galleryItems.id, id)).limit(1);

    return NextResponse.json({
      success: true,
      message: '작품이 성공적으로 수정되었습니다.',
      galleryItem: updatedItem[0],
    });
  } catch (error) {
    console.error('[Gallery API] 수정 오류:', error);
    return NextResponse.json(
      { error: '작품 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE /api/gallery/[id] - 갤러리 작품 삭제
export async function DELETE(
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

    // 기존 작품 조회
    const existingItem = await db.select().from(galleryItems).where(eq(galleryItems.id, id)).limit(1);

    if (existingItem.length === 0) {
      return NextResponse.json(
        { error: '작품을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 작성자 확인
    if (existingItem[0].userId !== session.userId) {
      return NextResponse.json(
        { error: '본인의 작품만 삭제할 수 있습니다.' },
        { status: 403 }
      );
    }

    // 좋아요 먼저 삭제 (FK 제약조건)
    await db.delete(galleryLikes).where(eq(galleryLikes.galleryItemId, id));

    // 작품 삭제
    await db.delete(galleryItems).where(eq(galleryItems.id, id));

    return NextResponse.json({
      success: true,
      message: '작품이 성공적으로 삭제되었습니다.',
    });
  } catch (error) {
    console.error('[Gallery API] 삭제 오류:', error);
    return NextResponse.json(
      { error: '작품 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}
