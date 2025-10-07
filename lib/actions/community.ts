'use server'

import { db } from '@/lib/db';
import { communities, communityMembers, users, chatRooms, joinRequests, chatMessages } from '@/lib/db/schema';
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
  const session = await getSession();

  // Get all communities for this hobby
  const allCommunities = await db.query.communities.findMany({
    where: eq(communities.hobbyId, hobbyId)
  });

  // If user is logged in, sort by matching location first and return with user location
  if (session) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.userId)
    });

    if (user) {
      // Sort communities: user's location first, then others
      const sorted = allCommunities.sort((a, b) => {
        const aMatches = a.location === user.location;
        const bMatches = b.location === user.location;

        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;
        return 0;
      });

      // Add user location info to each community
      return sorted.map(community => ({
        ...community,
        isUserLocation: community.location === user.location
      }));
    }
  }

  return allCommunities.map(community => ({
    ...community,
    isUserLocation: false
  }));
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
  const chatRoomId = randomUUID();

  // Create community
  await db.insert(communities).values({
    id: communityId,
    ...data,
    leaderId: session.userId,
  });

  // Create chat room for the community
  await db.insert(chatRooms).values({
    id: chatRoomId,
    communityId: communityId,
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

// Request to join community (requires leader approval)
export async function requestJoinCommunity(communityId: string) {
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

  // Check if already requested
  const existingRequest = await db.query.joinRequests.findFirst({
    where: and(
      eq(joinRequests.communityId, communityId),
      eq(joinRequests.userId, session.userId),
      eq(joinRequests.status, "pending")
    )
  });

  if (existingRequest) {
    return { error: "이미 가입 신청한 커뮤니티입니다." };
  }

  const requestId = randomUUID();
  await db.insert(joinRequests).values({
    id: requestId,
    communityId,
    userId: session.userId,
    status: "pending",
  });

  return { success: true, message: "가입 신청이 완료되었습니다. 리더의 승인을 기다려주세요." };
}

// Get pending join requests for a community (leader only)
export async function getPendingJoinRequests(communityId: string) {
  const session = await getSession();
  if (!session) {
    return [];
  }

  const community = await db.query.communities.findFirst({
    where: eq(communities.id, communityId),
  });

  if (!community || community.leaderId !== session.userId) {
    return [];
  }

  const requests = await db.query.joinRequests.findMany({
    where: and(
      eq(joinRequests.communityId, communityId),
      eq(joinRequests.status, "pending")
    ),
    with: {
      user: true,
    }
  });

  return requests;
}

// Approve join request (leader only)
export async function approveJoinRequest(requestId: string) {
  const session = await getSession();
  if (!session) {
    return { error: "로그인이 필요합니다." };
  }

  const request = await db.query.joinRequests.findFirst({
    where: eq(joinRequests.id, requestId),
    with: {
      community: true,
    }
  });

  if (!request) {
    return { error: "가입 신청을 찾을 수 없습니다." };
  }

  if (request.community.leaderId !== session.userId) {
    return { error: "권한이 없습니다." };
  }

  // Add user to community
  const memberId = randomUUID();
  await db.insert(communityMembers).values({
    id: memberId,
    communityId: request.communityId,
    userId: request.userId,
    role: 'member',
  });

  // Update request status
  await db.update(joinRequests)
    .set({ status: "approved", respondedAt: new Date() })
    .where(eq(joinRequests.id, requestId));

  // Update member count
  await db.update(communities)
    .set({ memberCount: request.community.memberCount + 1 })
    .where(eq(communities.id, request.communityId));

  return { success: true, message: "가입 신청을 승인했습니다." };
}

// Reject join request (leader only)
export async function rejectJoinRequest(requestId: string) {
  const session = await getSession();
  if (!session) {
    return { error: "로그인이 필요합니다." };
  }

  const request = await db.query.joinRequests.findFirst({
    where: eq(joinRequests.id, requestId),
    with: {
      community: true,
    }
  });

  if (!request) {
    return { error: "가입 신청을 찾을 수 없습니다." };
  }

  if (request.community.leaderId !== session.userId) {
    return { error: "권한이 없습니다." };
  }

  // Update request status
  await db.update(joinRequests)
    .set({ status: "rejected", respondedAt: new Date() })
    .where(eq(joinRequests.id, requestId));

  return { success: true, message: "가입 신청을 거절했습니다." };
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