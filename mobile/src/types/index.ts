export interface User {
  id: string;
  email: string;
  name: string;
  age: number;
  location: string;
  phone?: string;
  profileImage?: string;
}

export interface Hobby {
  id: string;
  name: string;
  category: string;
  description: string;
  difficulty: number;
  indoorOutdoor: 'indoor' | 'outdoor' | 'both';
  socialIndividual: 'social' | 'individual' | 'both';
  budget: 'low' | 'medium' | 'high';
  imageUrl: string;
  videoUrl?: string;
  benefits: string[];
  requirements: string[];
  curriculum?: {
    week: number;
    title: string;
    content: string;
  }[];
}

export interface Community {
  id: string;
  name: string;
  description: string;
  hobbyId: string;
  location: string;
  schedule: string;
  memberCount: number;
  maxMembers: number;
  imageUrl: string;
  leaderId: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  age: number;
  location: string;
  phone?: string;
}

// 채팅 관련 타입
export interface ChatRoom {
  id: string;
  communityId: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  chatRoomId: string;
  userId: string;
  userName: string;
  userImage: string | null;
  message: string;
  createdAt: string;
}

// 게시판 관련 타입
export interface Post {
  id: string;
  userId: string;
  userName: string;
  userImage: string | null;
  title: string;
  content: string;
  category: string;
  likes: number;
  comments: number;
  views: number;
  createdAt: string;
}

export type PostCategory = '전체' | '자유게시판' | '질문/답변' | '정보공유';

// 가입 신청 관련 타입
export interface JoinRequest {
  id: string;
  communityId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  respondedAt: string | null;
  user: {
    id: string;
    name: string;
    age: number;
    location: string;
    profileImage: string | null;
  };
}

export type MembershipStatus = 'not-member' | 'pending' | 'member';

// 설문 및 추천 관련 타입
export interface SurveyQuestion {
  id: string;
  question: string;
  options: Array<{
    value: string;
    label: string;
  }>;
}

export interface SurveyResponses {
  [key: string]: number;
}

export interface HobbyRecommendation extends Hobby {
  matchScore: number;
  reasons: string[];
}
