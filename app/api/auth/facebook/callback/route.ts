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
    const tokenResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const tokenUrl = new URL('https://graph.facebook.com/v18.0/oauth/access_token')
    tokenUrl.searchParams.set('client_id', process.env.FACEBOOK_CLIENT_ID!)
    tokenUrl.searchParams.set('client_secret', process.env.FACEBOOK_CLIENT_SECRET!)
    tokenUrl.searchParams.set('redirect_uri', `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/auth/facebook/callback`)
    tokenUrl.searchParams.set('code', code)

    const tokenRes = await fetch(tokenUrl.toString())
    const tokenData = await tokenRes.json()

    if (!tokenData.access_token) {
      return NextResponse.redirect(new URL('/login?error=token_failed', request.url))
    }

    // Get user info
    const userUrl = new URL('https://graph.facebook.com/me')
    userUrl.searchParams.set('access_token', tokenData.access_token)
    userUrl.searchParams.set('fields', 'id,name,email,picture')

    const userResponse = await fetch(userUrl.toString())
    const userData = await userResponse.json()

    // Check if user exists
    let user = await db.query.users.findFirst({
      where: eq(users.email, userData.email || `facebook_${userData.id}@facebook.com`),
    })

    if (!user) {
      // Create new user
      const userId = randomUUID()
      await db.insert(users).values({
        id: userId,
        email: userData.email || `facebook_${userData.id}@facebook.com`,
        password: '',
        name: userData.name || '페이스북 사용자',
        age: 0,
        location: '미설정',
        avatar: userData.picture?.data?.url || null,
      })

      user = await db.query.users.findFirst({
        where: eq(users.id, userId),
      })
    }

    if (user) {
      await createSession(user.id)
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.redirect(new URL('/login?error=user_creation_failed', request.url))
  } catch (error) {
    console.error('Facebook OAuth error:', error)
    return NextResponse.redirect(new URL('/login?error=oauth_failed', request.url))
  }
}
