import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { createSession } from '@/lib/auth/session'
import { randomUUID } from 'crypto'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', request.url))
  }

  try {
    // Get access token
    const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_CLIENT_ID!,
        client_secret: process.env.KAKAO_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/auth/kakao/callback`,
        code,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenData.access_token) {
      return NextResponse.redirect(new URL('/login?error=token_failed', request.url))
    }

    // Get user info
    const userResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    const userData = await userResponse.json()

    // Check if user exists
    let user = await db.query.users.findFirst({
      where: eq(users.email, `kakao_${userData.id}@kakao.com`),
    })

    let isNewUser = false
    if (!user) {
      isNewUser = true
      const userId = randomUUID()
      
      await db.insert(users).values({
        id: userId,
        email: `kakao_${userData.id}@kakao.com`,
        password: null,
        name: userData.properties?.nickname || '카카오 사용자',
        age: 0,
        location: '미설정',
        profileImage: userData.properties?.profile_image || null,
      })

      user = await db.query.users.findFirst({
        where: eq(users.id, userId),
      })
    }

    if (user) {
      await createSession(user.id)
      if (isNewUser) {
        return NextResponse.redirect(new URL('/survey', request.url))
      }
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.redirect(new URL('/login?error=user_creation_failed', request.url))
  } catch (error) {
    console.error('Kakao OAuth error:', error)
    return NextResponse.redirect(new URL('/login?error=oauth_failed', request.url))
  }
}
