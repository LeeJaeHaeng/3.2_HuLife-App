import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userHobbies, hobbies } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyToken } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '인증 토큰이 필요합니다.' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Verify token
    const payload = await verifyToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json(
        { error: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      );
    }

    // Get user's hobbies with join
    const result = await db
      .select({
        hobby: hobbies,
        userHobby: userHobbies,
      })
      .from(userHobbies)
      .innerJoin(hobbies, eq(userHobbies.hobbyId, hobbies.id))
      .where(eq(userHobbies.userId, payload.userId));

    // Extract hobby data
    const userHobbyList = result.map(r => r.hobby);

    return NextResponse.json(userHobbyList);
  } catch (error) {
    console.error('Get user hobbies error:', error);
    return NextResponse.json(
      { error: '취미 목록을 불러올 수 없습니다.' },
      { status: 500 }
    );
  }
}
