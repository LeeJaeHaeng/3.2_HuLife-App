// 웹 프로젝트: app/api/user/schedules/route.ts
import { NextResponse } from 'next/server';
import { getSession } from "@/lib/auth/session";
// ✨ schedule.ts에서 getUserSchedules, createSchedule 함수를 가져옵니다.
import { getUserSchedules as getUserSchedulesAction, createSchedule as createScheduleAction } from '@/lib/actions/schedule';

export async function GET() {
  try {
    const session = await getSession(); // 헤더 토큰으로 사용자 인증
    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    // 기존 서버 액션 함수를 호출하여 사용자 일정 목록을 가져옵니다.
    const schedules = await getUserSchedulesAction();

    return NextResponse.json(schedules); // 일정 배열 반환

  } catch (error) {
    console.error('User Schedules API error:', error);
    return NextResponse.json({ error: '사용자 일정 목록 조회 중 오류 발생' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession(); // 헤더 토큰으로 사용자 인증
    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const body = await request.json();
    const { title, type, date, time, location, hobbyId } = body;

    // 유효성 검증
    if (!title || !type || !date || !time) {
      return NextResponse.json({ error: '필수 필드가 누락되었습니다.' }, { status: 400 });
    }

    // 기존 서버 액션 함수를 호출하여 일정을 생성합니다.
    const result = await createScheduleAction({
      title,
      type: type as "class" | "practice" | "meeting" | "event",
      date: new Date(date),
      time,
      location,
      hobbyId,
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, schedule: result.schedule }, { status: 201 });

  } catch (error) {
    console.error('Create Schedule API error:', error);
    return NextResponse.json({ error: '일정 생성 중 오류 발생' }, { status: 500 });
  }
}