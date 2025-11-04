import { NextResponse } from 'next/server';
import { getSession } from "@/lib/auth/session";
import { db } from '@/lib/db';
import { schedules } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

// PUT - Update schedule
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ scheduleId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const { scheduleId } = await params;
    const body = await request.json();
    const { title, type, date, time, location, hobbyId } = body;

    // Validation
    if (!title || !type || !date || !time) {
      return NextResponse.json({ error: '필수 필드가 누락되었습니다.' }, { status: 400 });
    }

    // Check if schedule exists and belongs to user
    const [schedule] = await db
      .select()
      .from(schedules)
      .where(and(
        eq(schedules.id, scheduleId),
        eq(schedules.userId, session.userId)
      ))
      .limit(1);

    if (!schedule) {
      return NextResponse.json(
        { error: '일정을 찾을 수 없거나 수정 권한이 없습니다.' },
        { status: 404 }
      );
    }

    // Update schedule
    await db
      .update(schedules)
      .set({
        title,
        type: type as "class" | "practice" | "meeting" | "event",
        date: new Date(date),
        time,
        location,
        hobbyId,
      })
      .where(eq(schedules.id, scheduleId));

    // Get updated schedule
    const [updatedSchedule] = await db
      .select()
      .from(schedules)
      .where(eq(schedules.id, scheduleId))
      .limit(1);

    return NextResponse.json({
      success: true,
      message: '일정이 수정되었습니다.',
      schedule: updatedSchedule
    });

  } catch (error) {
    console.error('Update Schedule API error:', error);
    return NextResponse.json({ error: '일정 수정 중 오류 발생' }, { status: 500 });
  }
}

// DELETE - Delete schedule
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ scheduleId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const { scheduleId } = await params;

    // Check if schedule exists and belongs to user
    const [schedule] = await db
      .select()
      .from(schedules)
      .where(and(
        eq(schedules.id, scheduleId),
        eq(schedules.userId, session.userId)
      ))
      .limit(1);

    if (!schedule) {
      return NextResponse.json(
        { error: '일정을 찾을 수 없거나 삭제 권한이 없습니다.' },
        { status: 404 }
      );
    }

    // Delete schedule
    await db
      .delete(schedules)
      .where(eq(schedules.id, scheduleId));

    return NextResponse.json({
      success: true,
      message: '일정이 삭제되었습니다.'
    });

  } catch (error) {
    console.error('Delete Schedule API error:', error);
    return NextResponse.json({ error: '일정 삭제 중 오류 발생' }, { status: 500 });
  }
}
