import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { galleryItems } from '@/lib/db/schema';
import { getSession } from '@/lib/auth/session';
import { eq, desc, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

// GET /api/gallery - 갤러리 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hobbyId = searchParams.get('hobbyId'); // 특정 취미 필터

    let query = db.select().from(galleryItems);

    // 취미 ID로 필터링
    if (hobbyId) {
      query = query.where(eq(galleryItems.hobbyId, hobbyId)) as any;
    }

    const items = await query.orderBy(desc(galleryItems.createdAt));

    return NextResponse.json({ galleryItems: items });
  } catch (error) {
    console.error('[Gallery API] 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '갤러리 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// POST /api/gallery - 갤러리 작품 업로드 (이미지 또는 동영상)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { hobbyId, hobbyName, title, description, image, videoUrl, videoThumbnail } = body;

    // 필수 필드 검증
    if (!hobbyId || !hobbyName || !title) {
      return NextResponse.json(
        { error: '필수 정보를 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    // 이미지 또는 동영상 중 하나는 필수
    if (!image && !videoUrl) {
      return NextResponse.json(
        { error: '이미지 또는 동영상을 업로드해주세요.' },
        { status: 400 }
      );
    }

    // 제목 길이 검증
    if (title.length < 2 || title.length > 100) {
      return NextResponse.json(
        { error: '제목은 2-100자 이내로 입력해주세요.' },
        { status: 400 }
      );
    }

    // 이미지 검증 (있는 경우)
    if (image && !image.startsWith('data:image/')) {
      return NextResponse.json(
        { error: '올바른 이미지 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    // 새 갤러리 아이템 생성
    const newItem = {
      id: uuidv4(),
      userId: session.userId,
      userName: session.userName || '익명',
      userImage: session.userImage || null,
      hobbyId,
      hobbyName,
      title,
      description: description || null,
      image: image || null,
      videoUrl: videoUrl || null,
      videoThumbnail: videoThumbnail || null,
      likes: 0,
      views: 0,
      createdAt: new Date(),
    };

    await db.insert(galleryItems).values(newItem);

    console.log(`[Gallery API] ✅ 작품 업로드 성공 (타입: ${videoUrl ? '동영상' : '이미지'}):`, title);

    return NextResponse.json({
      success: true,
      message: '작품이 성공적으로 업로드되었습니다.',
      galleryItem: newItem,
    });
  } catch (error) {
    console.error('[Gallery API] 업로드 오류:', error);
    return NextResponse.json(
      { error: '작품 업로드에 실패했습니다.' },
      { status: 500 }
    );
  }
}
