'use server'

import { redirect } from 'next/navigation'

const KAKAO_AUTH_URL = 'https://kauth.kakao.com/oauth/authorize'
const NAVER_AUTH_URL = 'https://nid.naver.com/oauth2.0/authorize'
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'

export async function loginWithKakao() {
  const params = new URLSearchParams({
    client_id: process.env.KAKAO_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/auth/kakao/callback`,
    response_type: 'code',
    scope: 'profile_nickname',
  })

  redirect(`${KAKAO_AUTH_URL}?${params.toString()}`)
}

export async function loginWithNaver() {
  const state = Math.random().toString(36).substring(7)
  const params = new URLSearchParams({
    client_id: process.env.NAVER_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/auth/naver/callback`,
    response_type: 'code',
    state,
  })

  redirect(`${NAVER_AUTH_URL}?${params.toString()}`)
}

export async function loginWithGoogle() {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/auth/google/callback`,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
  })

  redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`)
}
