import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { surveyResponses, userActivities } from '@/lib/db/schema';
import { eq, count } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';
import { RecommendationEngine } from '@/lib/recommendation/engine';
import { KNNRecommendationEngine } from '@/lib/recommendation/knn-engine';

/**
 * Calculate dynamic weights based on user activity count
 * @param activityCount - Number of user activities
 * @returns [contentWeight, knnWeight]
 */
function calculateDynamicWeights(activityCount: number): [number, number] {
  if (activityCount < 10) {
    // New users: Rely more on content-based (less data for KNN)
    return [0.7, 0.3];
  } else if (activityCount < 50) {
    // Medium activity users: Balanced approach
    return [0.6, 0.4];
  } else {
    // Active users: Rely more on KNN (rich behavioral data)
    return [0.5, 0.5];
  }
}

// GET /api/recommendations - Get personalized hobby recommendations (Hybrid: Content-based + KNN)
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

    // Get all hobbies
    const allHobbies = await db.query.hobbies.findMany();

    // 1. Generate content-based recommendations
    const profile = RecommendationEngine.createUserProfile(surveyResponse.responses);
    const contentBasedRecs = RecommendationEngine.getRecommendations(profile, allHobbies, 10);

    // 2. Generate KNN collaborative filtering recommendations
    let knnRecs: Array<{ hobbyId: string; score: number; reason: string }> = [];
    try {
      knnRecs = await KNNRecommendationEngine.getKNNRecommendations(session.userId, 5, 10);
      console.log(`[Hybrid API] KNN returned ${knnRecs.length} recommendations`);
    } catch (error) {
      console.error('[Hybrid API] KNN recommendations failed, falling back to content-based only:', error);
    }

    // 3. Calculate dynamic weights based on user activity
    let activityCount = 0;
    try {
      const activityCountResult = await db
        .select({ count: count() })
        .from(userActivities)
        .where(eq(userActivities.userId, session.userId));
      activityCount = activityCountResult[0]?.count || 0;
    } catch (error) {
      console.warn('[Hybrid API] Could not fetch activity count (table may not exist yet), using default weights');
    }

    const [CONTENT_WEIGHT, KNN_WEIGHT] = calculateDynamicWeights(activityCount);

    console.log(`[Hybrid API] User activity count: ${activityCount}, Weights: Content ${CONTENT_WEIGHT * 100}%, KNN ${KNN_WEIGHT * 100}%`);

    // Create maps for quick lookup
    const knnScoreMap = new Map(knnRecs.map(r => [r.hobbyId, { score: r.score, reason: r.reason }]));
    const hobbyMap = new Map(allHobbies.map(h => [h.id, h]));

    // Combine scores
    const combinedScores = new Map<string, {
      hobby: any;
      contentScore: number;
      knnScore: number;
      hybridScore: number;
      reasons: string[];
    }>();

    // Process content-based recommendations
    contentBasedRecs.forEach(rec => {
      const knnData = knnScoreMap.get(rec.id);
      const knnScore = knnData ? knnData.score : 0;

      // Normalize content-based score (matchScore is 0-100)
      const contentScore = rec.matchScore / 100;

      // Calculate hybrid score
      const hybridScore = (contentScore * CONTENT_WEIGHT) + (knnScore * KNN_WEIGHT);

      const reasons = [...rec.reasons];
      if (knnData) {
        reasons.push(knnData.reason);
      }

      combinedScores.set(rec.id, {
        hobby: rec,
        contentScore,
        knnScore,
        hybridScore,
        reasons,
      });
    });

    // Process KNN recommendations that weren't in content-based
    knnRecs.forEach(rec => {
      if (!combinedScores.has(rec.hobbyId)) {
        const hobby = hobbyMap.get(rec.hobbyId);
        if (hobby) {
          const hybridScore = rec.score * KNN_WEIGHT; // No content score, so only KNN contribution

          combinedScores.set(rec.hobbyId, {
            hobby,
            contentScore: 0,
            knnScore: rec.score,
            hybridScore,
            reasons: [rec.reason, '유사한 사용자들이 관심있는 취미입니다'],
          });
        }
      }
    });

    // Sort by hybrid score and format results
    const recommendations = Array.from(combinedScores.values())
      .sort((a, b) => b.hybridScore - a.hybridScore)
      .slice(0, 6) // Top 6 recommendations
      .map(item => ({
        ...item.hobby,
        matchScore: Math.round(item.hybridScore * 100), // Convert back to 0-100 scale
        reasons: item.reasons.slice(0, 3), // Limit to 3 reasons
        _debug: {
          contentScore: Math.round(item.contentScore * 100),
          knnScore: Math.round(item.knnScore * 100),
          hybridScore: Math.round(item.hybridScore * 100),
        }
      }));

    console.log(`[Hybrid API] Returning ${recommendations.length} hybrid recommendations`);

    return NextResponse.json({
      recommendations,
      metadata: {
        contentBasedCount: contentBasedRecs.length,
        knnCount: knnRecs.length,
        hybridCount: recommendations.length,
        algorithm: 'hybrid-dynamic',
        userActivityCount: activityCount,
        weights: {
          contentBased: CONTENT_WEIGHT,
          collaborative: KNN_WEIGHT,
        },
        weightingStrategy: activityCount < 10
          ? 'new-user'
          : activityCount < 50
            ? 'medium-activity'
            : 'active-user'
      }
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    return NextResponse.json({ error: '추천 조회에 실패했습니다.' }, { status: 500 });
  }
}
