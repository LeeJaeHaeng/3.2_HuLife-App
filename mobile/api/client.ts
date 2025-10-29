import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG } from '../config/api.config';

export const TOKEN_KEY = 'auth_token';

// API 클라이언트 인스턴스
const client = axios.create({
  baseURL: __DEV__ ? API_CONFIG.WEB_URL : 'https://hulife.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// 요청 인터셉터
client.interceptors.request.use(async (config) => {
  try {
    // 요청 정보 로깅
    console.log('[API 클라이언트] 요청 URL:', config.url);
    
    // 토큰이 있으면 헤더에 추가
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 상세 요청 정보 로깅
    console.log('[API 클라이언트] 요청 상세 정보:', {
      method: config.method?.toUpperCase(),
      originalUrl: config.url,
      finalUrl: config.baseURL + config.url,
      headers: config.headers,
      data: config.data
    });
    
    return config;
  } catch (error) {
    console.error('[API 클라이언트] 요청 준비 중 오류:', error);
    return Promise.reject(error);
  }
});

// 응답 인터셉터
client.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const errorInfo = {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      requestData: error.config?.data,
      isNetworkError: !error.response,
      isTimeoutError: error.code === 'ECONNABORTED',
      message: error.message,
      response: error.response?.data
    };

    console.error('[API 클라이언트] 요청 실패:', errorInfo);

    // 서버 연결 확인
    try {
      await axios.get(`${client.defaults.baseURL}/api`);
    } catch {
      console.log('[API 클라이언트] 서버 연결 확인이 필요합니다:', `${client.defaults.baseURL}/api`);
    }

    return Promise.reject(error);
  }
);

export default client;