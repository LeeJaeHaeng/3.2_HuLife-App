import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { surveyResponses } from '@/lib/db/schema';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/survey - Submit survey responses
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    // ✨ 수정 1: 모바일 앱은 { responses: { ... } } 가 아니라 { ... } 형태로 바로 보내므로, body.responses 대신 직접 사용합니다.
    const responses = await request.json(); 

    // Validate responses
    const requiredQuestions = ['1', '2', '3', '4', '5', '6', '7', '8'];
    for (const q of requiredQuestions) {
      // 답변 값이 문자열 '0'일 수도 있으므로 명시적으로 확인
      if (responses[q] === undefined || responses[q] === null || responses[q] === '') {
           return NextResponse.json({ error: `질문 ${q}에 답변해주세요.` }, { status: 400 });
      }
    }

    // ✨ 수정 2: 모바일에서 문자열로 온 값을 숫자로 변환해줍니다. (DB 스키마가 숫자를 기대할 경우 필수)
    const numericResponses: { [key: string]: number } = {};
    Object.entries(responses).forEach(([key, value]) => {
       const numValue = Number(value);
       if (!isNaN(numValue)) {
           numericResponses[key] = numValue;
       } else {
           console.warn(`Could not convert response for question ${key} to number: ${value}`);
           // 필요시 에러 처리
       }
    });


    // Delete existing survey response (기존 로직 유지)
    await db.delete(surveyResponses).where(eq(surveyResponses.userId, session.userId));

    // Save new survey response (숫자로 변환된 값 사용)
    await db.insert(surveyResponses).values({
      id: randomUUID(),
      userId: session.userId,
      responses: numericResponses, // or JSON.stringify(numericResponses) if DB schema expects string
    });

    return NextResponse.json({
      success: true,
      message: '설문이 완료되었습니다!'
    });
  } catch (error) {
    console.error('Survey submission error:', error);
    return NextResponse.json({ error: '설문 제출에 실패했습니다.' }, { status: 500 });
  }
}

// GET /api/survey - Get user's survey response (기존 코드 유지)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const surveyResponse = await db.query.surveyResponses.findFirst({
      where: eq(surveyResponses.userId, session.userId),
    });

    if (!surveyResponse) {
      return NextResponse.json({ surveyResponse: null });
    }

    return NextResponse.json({ surveyResponse });
  } catch (error) {
    console.error('Get survey error:', error);
    return NextResponse.json({ error: '설문 조회에 실패했습니다.' }, { status: 500 });
  }
}