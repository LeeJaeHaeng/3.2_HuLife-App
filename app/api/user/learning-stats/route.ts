import { NextResponse } from 'next/server';
import { getSession } from "@/lib/auth/session";
import { db } from '@/lib/db';
import { userHobbies, hobbies, schedules } from '@/lib/db/schema';
import { eq, and, gte, sql } from 'drizzle-orm';

// GET - Get user learning statistics
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    // Get all user hobbies with hobby details
    const userHobbyRelations = await db.query.userHobbies.findMany({
      where: eq(userHobbies.userId, session.userId),
      with: {
        hobby: true
      }
    });

    // Calculate statistics
    const totalHobbies = userHobbyRelations.length;
    const interestedCount = userHobbyRelations.filter(h => h.status === 'interested').length;
    const learningCount = userHobbyRelations.filter(h => h.status === 'learning').length;
    const completedCount = userHobbyRelations.filter(h => h.status === 'completed').length;

    // Calculate average progress
    const totalProgress = userHobbyRelations.reduce((sum, h) => sum + (h.progress || 0), 0);
    const averageProgress = totalHobbies > 0 ? Math.round(totalProgress / totalHobbies) : 0;

    // Calculate learning streaks and goals
    const activeHobbies = userHobbyRelations.filter(h => h.status === 'learning');
    const completedThisMonth = userHobbyRelations.filter(h => {
      if (!h.completedAt) return false;
      const completedDate = new Date(h.completedAt);
      const now = new Date();
      return completedDate.getMonth() === now.getMonth() &&
             completedDate.getFullYear() === now.getFullYear();
    }).length;

    const completedThisWeek = userHobbyRelations.filter(h => {
      if (!h.completedAt) return false;
      const completedDate = new Date(h.completedAt);
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return completedDate >= weekAgo;
    }).length;

    // Get upcoming schedules related to learning hobbies
    const learningHobbyIds = activeHobbies.map(h => h.hobbyId);
    const upcomingSchedules = learningHobbyIds.length > 0 ? await db
      .select()
      .from(schedules)
      .where(and(
        eq(schedules.userId, session.userId),
        gte(schedules.date, new Date())
      ))
      .limit(5) : [];

    // Calculate curriculum completion stats
    const curriculumStats = await Promise.all(
      learningCount > 0 ? activeHobbies.slice(0, 5).map(async (userHobby) => {
        const curriculum = userHobby.hobby?.curriculum || [];
        const totalWeeks = curriculum.length;
        const progress = userHobby.progress || 0;
        const progressPerWeek = totalWeeks > 0 ? Math.floor(100 / totalWeeks) : 0;
        const completedWeeks = progressPerWeek > 0 ? Math.floor(progress / progressPerWeek) : 0;

        return {
          hobbyId: userHobby.hobbyId,
          hobbyName: userHobby.hobby?.name || '취미',
          totalWeeks,
          completedWeeks,
          progress,
          remainingWeeks: Math.max(0, totalWeeks - completedWeeks)
        };
      }) : []
    );

    // Learning insights and recommendations
    const insights = [];

    if (activeHobbies.length === 0 && interestedCount > 0) {
      insights.push({
        type: 'suggestion',
        message: '관심 있는 취미가 있어요! 학습을 시작해보세요.',
        action: 'start-learning'
      });
    }

    if (activeHobbies.length > 0) {
      const avgProgressOfActive = activeHobbies.reduce((sum, h) => sum + (h.progress || 0), 0) / activeHobbies.length;
      if (avgProgressOfActive < 30) {
        insights.push({
          type: 'encouragement',
          message: '좋은 시작이에요! 꾸준히 학습하면 더 빠르게 성장할 수 있어요.',
          action: 'view-schedule'
        });
      } else if (avgProgressOfActive >= 80) {
        insights.push({
          type: 'achievement',
          message: '대단해요! 거의 다 완료했어요. 조금만 더 힘내세요!',
          action: 'view-progress'
        });
      }
    }

    if (completedThisWeek > 0) {
      insights.push({
        type: 'celebration',
        message: `이번 주에 ${completedThisWeek}개의 취미를 완료했어요! 축하합니다! 🎉`,
        action: 'view-achievements'
      });
    }

    return NextResponse.json({
      summary: {
        totalHobbies,
        interestedCount,
        learningCount,
        completedCount,
        averageProgress,
        completedThisMonth,
        completedThisWeek
      },
      activeHobbies: activeHobbies.map(h => ({
        id: h.id,
        hobbyId: h.hobbyId,
        name: h.hobby?.name || '취미',
        progress: h.progress || 0,
        status: h.status,
        startedAt: h.startedAt
      })),
      curriculumStats,
      upcomingSchedules,
      insights,
      goals: {
        weeklyTarget: 1, // 주당 1개 완료 목표
        monthlyTarget: 4, // 월 4개 완료 목표
        weeklyProgress: completedThisWeek,
        monthlyProgress: completedThisMonth
      }
    });

  } catch (error) {
    console.error('Get Learning Stats API error:', error);
    return NextResponse.json({ error: '학습 통계 조회 중 오류 발생' }, { status: 500 });
  }
}
