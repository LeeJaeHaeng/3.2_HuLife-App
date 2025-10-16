import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { surveyResponses } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';
import { randomUUID } from 'crypto';

// POST /api/survey - Submit survey responses
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const body = await request.json();
    const { responses } = body;

    // Validate responses
    const requiredQuestions = ['1', '2', '3', '4', '5', '6', '7', '8'];
    for (const q of requiredQuestions) {
      if (!responses[q]) {
        return NextResponse.json({ error: '모든 질문에 답변해주세요.' }, { status: 400 });
      }
    }

    // Delete existing survey response
    await db.delete(surveyResponses).where(eq(surveyResponses.userId, session.userId));

    // Save new survey response
    await db.insert(surveyResponses).values({
      id: randomUUID(),
      userId: session.userId,
      responses,
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

// GET /api/survey - Get user's survey response
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
