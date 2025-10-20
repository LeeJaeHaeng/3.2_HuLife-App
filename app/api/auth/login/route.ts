import { createSession, verifyPassword } from "@/lib/auth/session";
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "이메일과 비밀번호를 입력해주세요." }, { status: 400 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return NextResponse.json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
    }

    // 로그인 성공! createSession을 호출하여 모바일용 토큰을 받습니다.
    const token = await createSession(user.id, user.email); 

    // 받은 토큰을 JSON 응답으로 모바일 앱에 보내줍니다.
    return NextResponse.json({ token: token });

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: '로그인 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}