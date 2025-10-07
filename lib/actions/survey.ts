'use server'

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from '@/lib/db';
import { surveyResponses, hobbies } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession, updateSession } from "@/lib/auth/session";
import { RecommendationEngine } from "@/lib/recommendation/engine";
import { randomUUID } from 'crypto';

export async function submitSurvey(responses: { [key: string]: number | string }) {
  const session = await getSession();
  if (!session) {
    return { error: "로그인이 필요합니다." };
  }

  // Validate responses
  const requiredQuestions = ["1", "2", "3", "4", "5", "6", "7", "8"];
  for (const q of requiredQuestions) {
    if (!responses[q]) {
      return { error: "모든 질문에 답변해주세요." };
    }
  }

  // Save survey response to the DB
  await db.insert(surveyResponses).values({
    id: randomUUID(),
    userId: session.userId,
    responses,
  });

  revalidatePath("/recommendations");
  redirect("/recommendations");
}

export async function getSurveyResponse() {
  const session = await getSession();
  if (!session) {
    return null;
  }

  return db.query.surveyResponses.findFirst({
      where: eq(surveyResponses.userId, session.userId)
  });
}

export async function getRecommendations() {
  const session = await getSession();
  if (!session) {
    return [];
  }

  // Generate recommendations from the stored survey response
  const surveyResponse = await db.query.surveyResponses.findFirst({
      where: eq(surveyResponses.userId, session.userId)
  });

  if (!surveyResponse) {
    return [];
  }

  const profile = RecommendationEngine.createUserProfile(surveyResponse.responses);
  const allHobbies = await db.query.hobbies.findMany();
  return RecommendationEngine.getRecommendations(profile, allHobbies, 6);
}