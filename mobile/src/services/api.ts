import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User,
  Hobby,
  Community,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  ChatRoom,
  ChatMessage,
  Post,
  JoinRequest,
  MembershipStatus,
  SurveyResponses,
  HobbyRecommendation,
} from '../types';

// API Base URL - 개발 환경에 따라 자동 설정
// ⚠️ 중요: 모바일 개발 시 localhost가 아닌 컴퓨터의 로컬 IP를 사용해야 합니다
// IP 확인 방법 (Windows): ipconfig 명령어 실행 후 Wi-Fi의 IPv4 주소 확인
const API_BASE_URL = __DEV__
  ? 'http://10.205.167.63:3000'  // 개발 환경: 컴퓨터의 로컬 IP (모바일 접근 가능)
  : 'https://your-production-url.com'; // 프로덕션 환경

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 30000,  // 30초로 증가 (Next.js 첫 컴파일 시간 고려)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - 모든 요청에 토큰 자동 추가
api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response Interceptor - 에러 처리
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // 토큰 만료 시 로그아웃
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  },
);

// Auth Service
export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const {data} = await api.post<AuthResponse>('/auth/login', credentials);
    await AsyncStorage.setItem('authToken', data.token);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    const {data} = await api.post<AuthResponse>('/auth/register', userData);
    await AsyncStorage.setItem('authToken', data.token);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
  },

  async getCurrentUser(): Promise<User> {
    const {data} = await api.get<User>('/auth/me');
    return data;
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem('authToken');
    return !!token;
  },
};

// Hobby Service
export const hobbyService = {
  async getAll(): Promise<Hobby[]> {
    const {data} = await api.get<Hobby[]>('/hobbies');
    return data;
  },

  async getById(id: string): Promise<Hobby> {
    const {data} = await api.get<Hobby>(`/hobbies/${id}`);
    return data;
  },

  async getByCategory(category: string): Promise<Hobby[]> {
    const {data} = await api.get<Hobby[]>(`/hobbies/category/${category}`);
    return data;
  },

  async addToUserHobbies(hobbyId: string): Promise<void> {
    await api.post('/hobbies/user/add', {hobbyId});
  },

  async removeFromUserHobbies(hobbyId: string): Promise<void> {
    await api.delete(`/hobbies/user/${hobbyId}`);
  },

  async getUserHobbies(): Promise<Hobby[]> {
    const {data} = await api.get<Hobby[]>('/hobbies/user');
    return data;
  },
};

// Community Service
export const communityService = {
  async getAll(): Promise<Community[]> {
    const {data} = await api.get<Community[]>('/communities');
    return data;
  },

  async getById(id: string): Promise<Community> {
    const {data} = await api.get<Community>(`/communities/${id}`);
    return data;
  },

  async join(communityId: string): Promise<void> {
    await api.post(`/communities/${communityId}/join`);
  },

  async leave(communityId: string): Promise<void> {
    await api.post(`/communities/${communityId}/leave`);
  },

  async create(communityData: Partial<Community>): Promise<Community> {
    const {data} = await api.post<Community>('/communities', communityData);
    return data;
  },

  async getUserCommunities(): Promise<Community[]> {
    const {data} = await api.get<Community[]>('/communities/user');
    return data;
  },
};

// Chat Service
export const chatService = {
  // 채팅방 조회
  async getChatRoom(communityId: string): Promise<ChatRoom> {
    const {data} = await api.get<ChatRoom>(`/communities/${communityId}/chat-room`);
    return data;
  },

  // 메시지 목록 조회
  async getMessages(chatRoomId: string, limit: number = 50): Promise<ChatMessage[]> {
    const {data} = await api.get<ChatMessage[]>(`/chat/${chatRoomId}/messages`, {
      params: {limit},
    });
    return data;
  },

  // 메시지 전송
  async sendMessage(chatRoomId: string, message: string): Promise<{success: boolean; message: ChatMessage}> {
    const {data} = await api.post(`/chat/${chatRoomId}/messages`, {message});
    return data;
  },
};

// Post Service (게시판)
export const postService = {
  // 전체 게시글 조회
  async getAll(category?: string): Promise<Post[]> {
    const {data} = await api.get<Post[]>('/posts', {
      params: category ? {category} : undefined,
    });
    return data;
  },

  // 게시글 상세 조회
  async getById(id: string): Promise<Post> {
    const {data} = await api.get<Post>(`/posts/${id}`);
    return data;
  },

  // 게시글 작성
  async create(postData: {title: string; content: string; category: string}): Promise<{success: boolean; post: Post}> {
    const {data} = await api.post('/posts', postData);
    return data;
  },

  // 게시글 수정
  async update(id: string, postData: {title: string; content: string; category: string}): Promise<{success: boolean; post: Post}> {
    const {data} = await api.put(`/posts/${id}`, postData);
    return data;
  },

  // 게시글 삭제
  async delete(id: string): Promise<{success: boolean}> {
    const {data} = await api.delete(`/posts/${id}`);
    return data;
  },
};

// Join Request Service (가입 신청)
export const joinRequestService = {
  // 멤버십 상태 확인
  async getMembershipStatus(communityId: string): Promise<{status: MembershipStatus; isLeader: boolean}> {
    const {data} = await api.get(`/communities/${communityId}/membership-status`);
    return data;
  },

  // 가입 신청
  async requestJoin(communityId: string): Promise<{success: boolean; message: string}> {
    const {data} = await api.post(`/communities/${communityId}/join-request`);
    return data;
  },

  // 모임 탈퇴
  async leave(communityId: string): Promise<{success: boolean}> {
    const {data} = await api.delete(`/communities/${communityId}/leave`);
    return data;
  },

  // 가입 신청 목록 조회 (리더 전용)
  async getPendingRequests(communityId: string): Promise<JoinRequest[]> {
    const {data} = await api.get<JoinRequest[]>(`/communities/${communityId}/join-requests`);
    return data;
  },

  // 가입 승인 (리더 전용)
  async approve(requestId: string): Promise<{success: boolean; message: string}> {
    const {data} = await api.post(`/communities/join-requests/${requestId}/approve`);
    return data;
  },

  // 가입 거절 (리더 전용)
  async reject(requestId: string): Promise<{success: boolean; message: string}> {
    const {data} = await api.post(`/communities/join-requests/${requestId}/reject`);
    return data;
  },
};

// Survey and Recommendation Service (설문 및 추천)
export const surveyService = {
  // 설문 제출
  async submitSurvey(responses: SurveyResponses): Promise<{success: boolean; message: string}> {
    const {data} = await api.post('/survey', {responses});
    return data;
  },

  // 설문 응답 조회
  async getSurveyResponse(): Promise<{surveyResponse: {id: string; userId: string; responses: SurveyResponses; completedAt: string} | null}> {
    const {data} = await api.get('/survey');
    return data;
  },

  // 추천 결과 조회
  async getRecommendations(): Promise<{recommendations: HobbyRecommendation[]; message?: string}> {
    const {data} = await api.get('/recommendations');
    return data;
  },
};

export default api;
