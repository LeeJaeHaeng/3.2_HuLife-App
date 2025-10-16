import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { surveyResponses } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';
import { RecommendationEngine } from '@/lib/recommendation/engine';

// GET /api/recommendations - Get personalized hobby recommendations
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    // Get user's survey response
    const surveyResponse = await db.query.surveyResponses.findFirst({
      where: eq(surveyResponses.userId, session.userId),
    });

    if (!surveyResponse) {
      return NextResponse.json({
        recommendations: [],
        message: '설문을 먼저 완료해주세요.'
      });
    }

    // Generate recommendations
    const profile = RecommendationEngine.createUserProfile(surveyResponse.responses);
    const allHobbies = await db.query.hobbies.findMany();
    const recommendations = RecommendationEngine.getRecommendations(profile, allHobbies, 6);

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Get recommendations error:', error);
    return NextResponse.json({ error: '추천 조회에 실패했습니다.' }, { status: 500 });
  }
}
