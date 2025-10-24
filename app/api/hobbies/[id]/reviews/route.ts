import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { reviews, users, hobbies } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { randomUUID } from 'crypto';

// GET /api/hobbies/[id]/reviews - Get reviews for a hobby
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: hobbyId } = params;

    // Check if hobby exists
    const [hobby] = await db
      .select()
      .from(hobbies)
      .where(eq(hobbies.id, hobbyId))
      .limit(1);

    if (!hobby) {
      return NextResponse.json(
        { error: '취미를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // Get reviews for this hobby with user info
    const hobbyReviews = await db
      .select({
        id: reviews.id,
        userId: reviews.userId,
        userName: reviews.userName,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        userProfileImage: users.profileImage,
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.hobbyId, hobbyId))
      .orderBy(desc(reviews.createdAt));

    return NextResponse.json(hobbyReviews);

  } catch (error) {
    console.error('[리뷰 조회 에러]', error);
    return NextResponse.json(
      { error: '리뷰 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST /api/hobbies/[id]/reviews - Create a review
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { id: hobbyId } = params;
    const body = await request.json();
    const { rating, comment } = body;

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: '평점은 1~5 사이여야 합니다.' },
        { status: 400 }
      );
    }

    if (!comment || !comment.trim()) {
      return NextResponse.json(
        { error: '후기 내용을 입력해주세요.' },
        { status: 400 }
      );
    }

    if (comment.trim().length < 10) {
      return NextResponse.json(
        { error: '후기는 최소 10자 이상 작성해주세요.' },
        { status: 400 }
      );
    }

    // Check if hobby exists
    const [hobby] = await db
      .select()
      .from(hobbies)
      .where(eq(hobbies.id, hobbyId))
      .limit(1);

    if (!hobby) {
      return NextResponse.json(
        { error: '취미를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // Get user info
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

    // Check if user already reviewed this hobby
    const [existingReview] = await db
      .select()
      .from(reviews)
      .where(eq(reviews.userId, user.id))
      .where(eq(reviews.hobbyId, hobbyId))
      .limit(1);

    if (existingReview) {
      return NextResponse.json(
        { error: '이미 이 취미에 대한 리뷰를 작성하셨습니다.' },
        { status: 400 }
      );
    }

    // Create review
    const reviewId = randomUUID();
    await db
      .insert(reviews)
      .values({
        id: reviewId,
        userId: user.id,
        userName: user.name,
        hobbyId,
        rating,
        comment: comment.trim(),
      });

    const [newReview] = await db
      .select()
      .from(reviews)
      .where(eq(reviews.id, reviewId))
      .limit(1);

    return NextResponse.json({
      success: true,
      message: '리뷰가 등록되었습니다.',
      review: newReview,
    });

  } catch (error) {
    console.error('[리뷰 작성 에러]', error);
    return NextResponse.json(
      { error: '리뷰 작성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
