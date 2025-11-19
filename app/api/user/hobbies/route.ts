import { db } from '@/lib/db';
import { userHobbies, hobbies } from '@/lib/db/schema'; // hobbies 추가
import { getSession } from "@/lib/auth/session";
import { NextRequest, NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

// GET /api/user/hobbies - 사용자의 관심 취미 목록 조회 (비정규화된 데이터 반환)
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    // 비정규화된 필드를 직접 반환 (JOIN 불필요)
    const userHobbyList = await db.query.userHobbies.findMany({
      where: eq(userHobbies.userId, session.userId),
    });

    // 기존 형식 호환성을 위해 hobby 객체 형태로 변환
    const formattedData = userHobbyList.map(item => ({
      id: item.id,
      userId: item.userId,
      hobbyId: item.hobbyId,
      status: item.status,
      progress: item.progress,
      startedAt: item.startedAt,
      completedAt: item.completedAt,
      hobby: {
        id: item.hobbyId,
        name: item.hobbyName,
        category: item.hobbyCategory,
        description: item.hobbyDescription,
        imageUrl: item.hobbyImage,
      }
    }));

    return NextResponse.json(formattedData);

  } catch (error) {
    console.error('Get User Hobbies API error:', error);
    return NextResponse.json({ error: '관심 취미 목록 조회 중 오류 발생' }, { status: 500 });
  }
}

// POST /api/user/hobbies - 관심 취미 추가 (비정규화된 취미 정보 함께 저장)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const { hobbyId, status } = await request.json();
    if (!hobbyId || !status) {
      return NextResponse.json({ error: '취미 ID와 상태를 입력해주세요.' }, { status: 400 });
    }

    const existing = await db.query.userHobbies.findFirst({
        where: and(eq(userHobbies.userId, session.userId), eq(userHobbies.hobbyId, hobbyId))
    });
    if (existing) {
        return NextResponse.json({ message: '이미 추가된 취미입니다.' });
    }

    // 취미 정보 조회 (비정규화를 위해)
    const hobby = await db.query.hobbies.findFirst({
      where: eq(hobbies.id, hobbyId)
    });

    if (!hobby) {
      return NextResponse.json({ error: '존재하지 않는 취미입니다.' }, { status: 404 });
    }

    // 비정규화: 취미 정보를 userHobbies에 직접 저장
    await db.insert(userHobbies).values({
      id: randomUUID(),
      userId: session.userId,
      hobbyId: hobbyId,
      hobbyName: hobby.name,
      hobbyCategory: hobby.category,
      hobbyDescription: hobby.description,
      hobbyImage: hobby.imageUrl,
      status: status,
      progress: 0,
    });

    return NextResponse.json({ success: true, message: '관심 취미에 추가되었습니다.' });

  } catch (error) {
    console.error('Add User Hobby API error:', error);
    return NextResponse.json({ error: '관심 취미 추가 중 오류 발생' }, { status: 500 });
  }
}

// DELETE /api/user/hobbies - 관심 취미 제거 (변경 없음)
export async function DELETE(request: NextRequest) {
     try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const hobbyId = searchParams.get('hobbyId');

        if (!hobbyId) {
            return NextResponse.json({ error: '삭제할 취미 ID를 입력해주세요.' }, { status: 400 });
        }

        await db.delete(userHobbies).where(
            and(eq(userHobbies.userId, session.userId), eq(userHobbies.hobbyId, hobbyId))
        );

        return NextResponse.json({ success: true, message: '관심 취미에서 제거되었습니다.' });

    } catch (error) {
        console.error('Remove User Hobby API error:', error);
        return NextResponse.json({ error: '관심 취미 제거 중 오류 발생' }, { status: 500 });
    }
}