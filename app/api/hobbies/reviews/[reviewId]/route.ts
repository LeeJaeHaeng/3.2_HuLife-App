import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { reviews } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

// PUT - Update review
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { reviewId } = await params;
    const body = await request.json();
    const { rating, comment } = body;

    // Validation
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: '평점은 1~5 사이여야 합니다.' },
        { status: 400 }
      );
    }

    if (comment && comment.trim().length < 10) {
      return NextResponse.json(
        { error: '후기는 최소 10자 이상 작성해주세요.' },
        { status: 400 }
      );
    }

    // Check if review exists and belongs to user
    const [review] = await db
      .select()
      .from(reviews)
      .where(and(
        eq(reviews.id, reviewId),
        eq(reviews.userId, session.userId)
      ))
      .limit(1);

    if (!review) {
      return NextResponse.json(
        { error: '리뷰를 찾을 수 없거나 수정 권한이 없습니다.' },
        { status: 404 }
      );
    }

    // Update review
    await db
      .update(reviews)
      .set({
        rating: rating ?? review.rating,
        comment: comment?.trim() ?? review.comment
      })
      .where(eq(reviews.id, reviewId));

    // Get updated review
    const [updatedReview] = await db
      .select()
      .from(reviews)
      .where(eq(reviews.id, reviewId))
      .limit(1);

    return NextResponse.json({
      success: true,
      message: '리뷰가 수정되었습니다.',
      review: updatedReview,
    });

  } catch (error) {
    console.error('[리뷰 수정 에러]', error);
    return NextResponse.json(
      { error: '리뷰 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE - Delete review
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { reviewId } = await params;

    // Check if review exists and belongs to user
    const [review] = await db
      .select()
      .from(reviews)
      .where(and(
        eq(reviews.id, reviewId),
        eq(reviews.userId, session.userId)
      ))
      .limit(1);

    if (!review) {
      return NextResponse.json(
        { error: '리뷰를 찾을 수 없거나 삭제 권한이 없습니다.' },
        { status: 404 }
      );
    }

    // Delete review
    await db
      .delete(reviews)
      .where(eq(reviews.id, reviewId));

    return NextResponse.json({
      success: true,
      message: '리뷰가 삭제되었습니다.',
    });

  } catch (error) {
    console.error('[리뷰 삭제 에러]', error);
    return NextResponse.json(
      { error: '리뷰 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
