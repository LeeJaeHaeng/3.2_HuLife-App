import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG } from '../config/api.config';
import cacheService from './cacheService';

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

/**
 * 캐시 지원 GET 요청 (Cache-First 패턴)
 * 캐시가 있으면 즉시 반환, 없으면 API 호출 후 캐싱
 */
api.getCached = async (url, options = {}) => {
  const cacheKey = `api_${url}`;
  const expiryMs = options.expiryMs || 30 * 60 * 1000; // 기본 30분

  const fetchFn = async () => {
    const response = await api.get(url, options);
    return response.data;
  };

  return await cacheService.getCacheFirst(cacheKey, fetchFn, expiryMs);
};

/**
 * 캐시 지원 GET 요청 (Network-First 패턴)
 * 온라인이면 API 호출, 실패하면 캐시 반환
 */
api.getWithFallback = async (url, options = {}) => {
  const cacheKey = `api_${url}`;
  const expiryMs = options.expiryMs || 30 * 60 * 1000;

  const fetchFn = async () => {
    const response = await api.get(url, options);
    return response.data;
  };

  return await cacheService.getNetworkFirst(cacheKey, fetchFn, expiryMs);
};

/**
 * 캐시 지원 GET 요청 (Stale-While-Revalidate 패턴)
 * 캐시 데이터를 즉시 반환하고, 백그라운드에서 최신 데이터 가져오기
 */
api.getStale = async (url, options = {}) => {
  const cacheKey = `api_${url}`;
  const expiryMs = options.expiryMs || 30 * 60 * 1000;

  const fetchFn = async () => {
    const response = await api.get(url, options);
    return response.data;
  };

  return await cacheService.getStaleWhileRevalidate(cacheKey, fetchFn, expiryMs);
};

/**
 * 캐시 무효화 (특정 URL 패턴)
 */
api.invalidateCache = async (pattern) => {
  await cacheService.clearPattern(pattern);
};

export default api;