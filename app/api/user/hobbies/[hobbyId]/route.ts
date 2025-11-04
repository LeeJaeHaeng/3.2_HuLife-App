import { NextResponse } from 'next/server';
import { getSession } from "@/lib/auth/session";
import { db } from '@/lib/db';
import { userHobbies } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

// PUT - Update user hobby progress and status
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ hobbyId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const { hobbyId } = await params;
    const body = await request.json();
    const { progress, status } = body;

    // Validation
    if (progress !== undefined && (progress < 0 || progress > 100)) {
      return NextResponse.json({ error: '진행도는 0~100 사이여야 합니다.' }, { status: 400 });
    }

    if (status && !['interested', 'learning', 'completed'].includes(status)) {
      return NextResponse.json(
        { error: '상태는 interested, learning, completed 중 하나여야 합니다.' },
        { status: 400 }
      );
    }

    // Check if user hobby exists
    const [userHobby] = await db
      .select()
      .from(userHobbies)
      .where(and(
        eq(userHobbies.userId, session.userId),
        eq(userHobbies.hobbyId, hobbyId)
      ))
      .limit(1);

    if (!userHobby) {
      return NextResponse.json(
        { error: '해당 취미를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};

    if (progress !== undefined) {
      updateData.progress = progress;

      // Auto-update status based on progress
      if (progress === 0 && userHobby.status !== 'interested') {
        updateData.status = 'interested';
      } else if (progress > 0 && progress < 100 && userHobby.status === 'interested') {
        updateData.status = 'learning';
      } else if (progress === 100 && userHobby.status !== 'completed') {
        updateData.status = 'completed';
        updateData.completedAt = new Date();
      }
    }

    if (status) {
      updateData.status = status;

      // Set completedAt when manually marking as completed
      if (status === 'completed' && !userHobby.completedAt) {
        updateData.completedAt = new Date();
      }

      // Clear completedAt if changing from completed to other status
      if (status !== 'completed' && userHobby.completedAt) {
        updateData.completedAt = null;
      }
    }

    // Update user hobby
    await db
      .update(userHobbies)
      .set(updateData)
      .where(and(
        eq(userHobbies.userId, session.userId),
        eq(userHobbies.hobbyId, hobbyId)
      ));

    // Get updated user hobby
    const [updatedUserHobby] = await db
      .select()
      .from(userHobbies)
      .where(and(
        eq(userHobbies.userId, session.userId),
        eq(userHobbies.hobbyId, hobbyId)
      ))
      .limit(1);

    return NextResponse.json({
      success: true,
      message: '학습 진행도가 업데이트되었습니다.',
      userHobby: updatedUserHobby
    });

  } catch (error) {
    console.error('Update User Hobby API error:', error);
    return NextResponse.json({ error: '학습 진행도 업데이트 중 오류 발생' }, { status: 500 });
  }
}

// DELETE - Remove user hobby (already exists in parent route, but adding here for consistency)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ hobbyId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const { hobbyId } = await params;

    // Check if user hobby exists
    const [userHobby] = await db
      .select()
      .from(userHobbies)
      .where(and(
        eq(userHobbies.userId, session.userId),
        eq(userHobbies.hobbyId, hobbyId)
      ))
      .limit(1);

    if (!userHobby) {
      return NextResponse.json(
        { error: '해당 취미를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // Delete user hobby
    await db
      .delete(userHobbies)
      .where(and(
        eq(userHobbies.userId, session.userId),
        eq(userHobbies.hobbyId, hobbyId)
      ));

    return NextResponse.json({
      success: true,
      message: '관심 취미에서 제거되었습니다.'
    });

  } catch (error) {
    console.error('Delete User Hobby API error:', error);
    return NextResponse.json({ error: '관심 취미 제거 중 오류 발생' }, { status: 500 });
  }
}
