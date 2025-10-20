import { db } from '@/lib/db';
import { userHobbies, hobbies } from '@/lib/db/schema'; // hobbies 추가
import { getSession } from "@/lib/auth/session";
import { NextRequest, NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

// GET /api/user/hobbies - 사용자의 관심 취미 목록과 상세 정보 조회
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    // ✨ with: { hobby: true } 를 추가하여 hobbies 테이블 정보도 함께 가져옵니다.
    const userHobbyRelations = await db.query.userHobbies.findMany({
      where: eq(userHobbies.userId, session.userId),
      with: {
        hobby: true, // Hobbies 테이블과 JOIN
      }
    });

    return NextResponse.json(userHobbyRelations); // JOIN된 결과 반환

  } catch (error) {
    console.error('Get User Hobbies API error:', error);
    return NextResponse.json({ error: '관심 취미 목록 조회 중 오류 발생' }, { status: 500 });
  }
}

// POST /api/user/hobbies - 관심 취미 추가 (변경 없음)
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

    await db.insert(userHobbies).values({
      id: randomUUID(),
      userId: session.userId,
      hobbyId: hobbyId,
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