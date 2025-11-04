import { NextResponse } from 'next/server';
import { getSession } from "@/lib/auth/session";
import { db } from '@/lib/db';
import { userHobbies, hobbies } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

// POST - Mark curriculum week as completed and update progress
export async function POST(
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
    const { week, action } = body; // action: 'complete' or 'uncomplete'

    if (!week || typeof week !== 'number') {
      return NextResponse.json({ error: '주차 번호를 입력해주세요.' }, { status: 400 });
    }

    // Get hobby to check curriculum
    const [hobby] = await db
      .select()
      .from(hobbies)
      .where(eq(hobbies.id, hobbyId))
      .limit(1);

    if (!hobby || !hobby.curriculum || hobby.curriculum.length === 0) {
      return NextResponse.json(
        { error: '해당 취미의 커리큘럼을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // Check if week exists in curriculum
    const weekExists = hobby.curriculum.some((c: any) => c.week === week);
    if (!weekExists) {
      return NextResponse.json(
        { error: '해당 주차가 커리큘럼에 존재하지 않습니다.' },
        { status: 400 }
      );
    }

    // Get user hobby
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
        { error: '해당 취미를 관심 목록에 추가해주세요.' },
        { status: 404 }
      );
    }

    // Parse completed weeks (stored in a hypothetical JSON field, or we can use a separate table)
    // For now, we'll calculate progress based on curriculum completion
    // Since we don't have a field to store completed weeks, we'll use progress directly

    // Calculate new progress based on curriculum length
    const totalWeeks = hobby.curriculum.length;
    const progressPerWeek = Math.floor(100 / totalWeeks);

    let newProgress = userHobby.progress;

    if (action === 'complete') {
      // Increment progress by one week
      newProgress = Math.min(100, userHobby.progress + progressPerWeek);
    } else if (action === 'uncomplete') {
      // Decrement progress by one week
      newProgress = Math.max(0, userHobby.progress - progressPerWeek);
    }

    // Update progress and status
    const updateData: any = {
      progress: newProgress
    };

    // Auto-update status based on progress
    if (newProgress === 0) {
      updateData.status = 'interested';
    } else if (newProgress > 0 && newProgress < 100) {
      updateData.status = 'learning';
    } else if (newProgress === 100) {
      updateData.status = 'completed';
      updateData.completedAt = new Date();
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
      message: action === 'complete' ? '주차 학습이 완료되었습니다.' : '주차 학습 완료가 취소되었습니다.',
      userHobby: updatedUserHobby,
      totalWeeks,
      completedWeeks: Math.floor(newProgress / progressPerWeek)
    });

  } catch (error) {
    console.error('Update Curriculum Progress API error:', error);
    return NextResponse.json({ error: '커리큘럼 진행도 업데이트 중 오류 발생' }, { status: 500 });
  }
}

// GET - Get curriculum progress
export async function GET(
  request: Request,
  { params }: { params: Promise<{ hobbyId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const { hobbyId } = await params;

    // Get hobby curriculum
    const [hobby] = await db
      .select()
      .from(hobbies)
      .where(eq(hobbies.id, hobbyId))
      .limit(1);

    if (!hobby) {
      return NextResponse.json(
        { error: '해당 취미를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // Get user hobby progress
    const [userHobby] = await db
      .select()
      .from(userHobbies)
      .where(and(
        eq(userHobbies.userId, session.userId),
        eq(userHobbies.hobbyId, hobbyId)
      ))
      .limit(1);

    const curriculum = hobby.curriculum || [];
    const totalWeeks = curriculum.length;
    const progress = userHobby?.progress || 0;
    const progressPerWeek = totalWeeks > 0 ? Math.floor(100 / totalWeeks) : 0;
    const completedWeeks = progressPerWeek > 0 ? Math.floor(progress / progressPerWeek) : 0;

    return NextResponse.json({
      curriculum,
      totalWeeks,
      completedWeeks,
      progress,
      status: userHobby?.status || 'interested'
    });

  } catch (error) {
    console.error('Get Curriculum Progress API error:', error);
    return NextResponse.json({ error: '커리큘럼 진행도 조회 중 오류 발생' }, { status: 500 });
  }
}
