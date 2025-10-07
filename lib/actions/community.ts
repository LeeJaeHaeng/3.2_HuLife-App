'use server'

import { db } from '@/lib/db';
import { communities, communityMembers } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from "@/lib/auth/session";
import { randomUUID } from 'crypto';

export async function getAllCommunities() {
  return db.query.communities.findMany();
}

export async function getCommunityById(id: string) {
  const community = await db.query.communities.findFirst({
    where: eq(communities.id, id),
    with: {
      members: {
        with: {
          user: true,
        }
      }
    }
  });
  return community ?? null;
}

export async function getCommunitiesByHobby(hobbyId: string) {
  return db.query.communities.findMany({
    where: eq(communities.hobbyId, hobbyId)
  });
}

export async function createCommunity(data: {
  name: string
  hobbyId: string
  description: string
  location: string
  schedule: string
  maxMembers: number
  imageUrl: string
}) {
  const session = await getSession();
  if (!session) {
    return { error: "로그인이 필요합니다." };
  }

  const communityId = randomUUID();

  await db.insert(communities).values({
    id: communityId,
    ...data,
    leaderId: session.userId,
  });

  // Automatically join as leader
  await db.insert(communityMembers).values({
    id: randomUUID(),
    communityId: communityId,
    userId: session.userId,
    role: 'leader',
  });

  const newCommunity = await db.query.communities.findFirst({
    where: eq(communities.id, communityId),
  });

  return { success: true, community: newCommunity };
}

export async function joinCommunity(communityId: string) {
  const session = await getSession();
  if (!session) {
    return { error: "로그인이 필요합니다." };
  }

  const community = await db.query.communities.findFirst({
    where: eq(communities.id, communityId),
    with: {
      members: true,
    }
  });

  if (!community) {
    return { error: "커뮤니티를 찾을 수 없습니다." };
  }

  if (community.members.length >= community.maxMembers) {
    return { error: "정원이 가득 찼습니다." };
  }

  const existingMember = community.members.find(m => m.userId === session.userId);
  if (existingMember) {
    return { error: "이미 가입한 커뮤니티입니다." };
  }

  const memberId = randomUUID();
  await db.insert(communityMembers).values({
    id: memberId,
    communityId,
    userId: session.userId,
    role: 'member',
  });

  await db.update(communities).set({ memberCount: community.members.length + 1 }).where(eq(communities.id, communityId));

  const newMember = await db.query.communityMembers.findFirst({
    where: eq(communityMembers.id, memberId),
  });

  return { success: true, member: newMember };
}

export async function leaveCommunity(communityId: string) {
  const session = await getSession();
  if (!session) {
    return { error: "로그인이 필요합니다." };
  }

  const community = await db.query.communities.findFirst({
    where: eq(communities.id, communityId),
    with: {
      members: true,
    }
  });

  if (!community) {
    return { error: "커뮤니티를 찾을 수 없습니다." };
  }

  const member = community.members.find(m => m.userId === session.userId);
  if (!member) {
    return { error: "가입하지 않은 커뮤니티입니다." };
  }

  if (member.role === 'leader') {
    return { error: "리더는 탈퇴할 수 없습니다. 리더를 위임한 후 탈퇴해주세요." };
  }

  await db.delete(communityMembers).where(eq(communityMembers.id, member.id));

  await db.update(communities).set({ memberCount: community.members.length - 1 }).where(eq(communities.id, communityId));

  return { success: true };
}

export async function getUserCommunities() {
  const session = await getSession();
  if (!session) {
    return [];
  }

  const userCommunityRelations = await db.query.communityMembers.findMany({
      where: eq(communityMembers.userId, session.userId),
      with: {
          community: true,
      }
  });

  return userCommunityRelations.map(relation => relation.community);
}