// 웹 프로젝트: app/api/user/communities/route.ts
import { NextResponse } from 'next/server';
import { getSession } from "@/lib/auth/session";
// ✨ community.ts에서 getUserCommunities 함수를 가져옵니다. (이름 충돌 방지 위해 as 사용)
import { getUserCommunities as getUserCommunitiesAction } from '@/lib/actions/community'; 

export async function GET() {
  try {
    const session = await getSession(); // 헤더 토큰으로 사용자 인증
    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    // 기존 서버 액션 함수를 호출하여 참여 중인 커뮤니티 목록을 가져옵니다.
    const communities = await getUserCommunitiesAction();

    return NextResponse.json(communities); // 커뮤니티 배열 반환

  } catch (error) {
    console.error('User Communities API error:', error);
    return NextResponse.json({ error: '참여 중인 모임 목록 조회 중 오류 발생' }, { status: 500 });
  }
}