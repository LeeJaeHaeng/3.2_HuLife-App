import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/user/profile - Get current user profile
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // Get user from database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // Return user profile (exclude password)
    const { password, ...userProfile } = user;
    return NextResponse.json(userProfile);

  } catch (error) {
    console.error('[프로필 조회 에러]', error);
    return NextResponse.json(
      { error: '프로필 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PUT /api/user/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, age, location, phone, profileImage } = body;

    console.log('[프로필 업데이트] 받은 데이터:', { name, age, location, phone, hasImage: !!profileImage });

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: '이름을 입력해주세요.' },
        { status: 400 }
      );
    }

    if (!age || age < 1 || age > 150) {
      return NextResponse.json(
        { error: '올바른 나이를 입력해주세요.' },
        { status: 400 }
      );
    }

    // Get current user
    const [currentUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    if (!currentUser) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {
      name: name.trim(),
      age,
      location: location || currentUser.location,
    };

    // Optional fields
    if (phone !== undefined) {
      updateData.phone = phone || null;
    }

    if (profileImage !== undefined) {
      updateData.profileImage = profileImage || null;
    }

    // Update user in database
    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, currentUser.id));

    // Get updated user
    const [updatedUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, currentUser.id))
      .limit(1);

    // Return updated profile (exclude password)
    const { password, ...userProfile } = updatedUser;
    return NextResponse.json({
      success: true,
      message: '프로필이 업데이트되었습니다.',
      user: userProfile,
    });

  } catch (error: any) {
    console.error('[프로필 업데이트 에러]', error);
    console.error('[프로필 업데이트 에러 메시지]', error.message);
    console.error('[프로필 업데이트 에러 스택]', error.stack);
    return NextResponse.json(
      { error: `프로필 업데이트 중 오류가 발생했습니다: ${error.message}` },
      { status: 500 }
    );
  }
}
