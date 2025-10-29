import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG } from '../config/api.config';

// API URL - config 파일에서 자동으로 가져옴
export const API_URL = API_CONFIG.API_URL;
export const TOKEN_KEY = 'userToken';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
});

// 요청 인터셉터 - 토큰 추가
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log(`[API 클라이언트] 요청: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
      return config;
    } catch (error) {
      console.error('[API 클라이언트] 요청 인터셉터 오류:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 오류 처리
api.interceptors.response.use(
  (response) => {
    console.log(`[API 클라이언트] 응답 성공: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('[API 클라이언트] 요청 실패:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export default api;