import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User,
  Hobby,
  Community,
  AuthResponse,
  LoginCredentials,
  RegisterData,
} from '../types';

// API Base URL - 개발 환경에 따라 자동 설정
const API_BASE_URL = __DEV__
  ? 'http://localhost:3001'  // 개발 환경: localhost
  : 'https://your-production-url.com'; // 프로덕션 환경

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
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

export default api;
