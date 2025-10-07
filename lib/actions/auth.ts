'use server'

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { createSession, deleteSession, hashPassword, verifyPassword } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { randomUUID } from 'crypto';
import { generateAvatar } from '@/lib/utils/avatar';

export async function signup(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirm-password") as string;
  const name = formData.get("name") as string;
  const age = Number.parseInt(formData.get("age") as string);
  const location = formData.get("location") as string;
  const phone = formData.get("phone") as string;

  // Validate input
  if (!email || !password || !confirmPassword || !name || !age || !location) {
    return { error: "모든 필수 항목을 입력해주세요." };
  }

  if (password !== confirmPassword) {
    return { error: "비밀번호가 일치하지 않습니다." };
  }

  // Check if user already exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    return { error: "이미 가입된 이메일입니다." };
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const userId = randomUUID();
  const avatarUrl = generateAvatar(name, userId);

  await db.insert(users).values({
    id: userId,
    email,
    password: hashedPassword,
    name,
    age,
    location,
    phone: phone || undefined,
    avatar: avatarUrl,
  });

  // Create session
  await createSession(userId);

  redirect("/survey");
}

export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "이메일과 비밀번호를 입력해주세요." };
  }

  // Find user
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    return { error: "이메일 또는 비밀번호가 올바르지 않습니다." };
  }

  // Verify password
  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return { error: "이메일 또는 비밀번호가 올바르지 않습니다." };
  }

  // Create session
  await createSession(user.id);

  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}