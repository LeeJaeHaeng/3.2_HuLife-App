import { cookies, headers } from "next/headers"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { randomUUID } from "crypto"

export interface Session {
  userId: string
  email: string
  name: string
  recommendations?: any[]
}

const SESSION_COOKIE_NAME = "hoolife_session"

// Create JWT-like token for mobile apps (simple Base64 encoding)
export async function createSession(userId: string, email: string): Promise<string> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  })
  if (!user) throw new Error("User not found")

  const session: Session = {
    userId: user.id,
    email: user.email,
    name: user.name,
  }

  // For mobile apps: return a simple token (Base64 encoded session)
  const token = Buffer.from(JSON.stringify({
    ...session,
    exp: Date.now() + (60 * 60 * 24 * 7 * 1000) // 7 days
  })).toString('base64');

  // For web: set cookie
  try {
    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
  } catch (error) {
    // Cookies might not be available in API routes, that's ok for mobile
  }

  return token;
}

export async function updateSession(updatedData: Partial<Session>): Promise<void> {
  const currentSession = await getSession()
  if (!currentSession) return

  const newSession = { ...currentSession, ...updatedData }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(newSession), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function getSession(): Promise<Session | null> {
  // Try to get session from Authorization header (for mobile apps)
  try {
    const headersList = await headers();
    const authorization = headersList.get('authorization');

    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.substring(7);
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));

      // Check if token is expired
      if (decoded.exp && decoded.exp > Date.now()) {
        const { exp, ...session } = decoded;
        return session as Session;
      }
    }
  } catch (error) {
    // Token parsing failed, try cookie
  }

  // Try to get session from cookie (for web)
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)

    if (!sessionCookie) return null

    return JSON.parse(sessionCookie.value)
  } catch {
    return null
  }
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function verifyToken(token: string): Promise<Session | null> {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));

    // Check if token is expired
    if (decoded.exp && decoded.exp > Date.now()) {
      const { exp, ...session } = decoded;
      return session as Session;
    }

    return null;
  } catch (error) {
    return null;
  }
}
