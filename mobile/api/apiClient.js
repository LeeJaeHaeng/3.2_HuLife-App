import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import cacheService from './cacheService';
import Constants from 'expo-constants';

// API URL - 환경별 자동 전환 (개발/프로덕션)
const getApiUrl = () => {
  // __DEV__ 플래그로 개발/프로덕션 환경 자동 감지
  const isDevelopment = __DEV__;

  console.log('[API Client] 🔍 환경 감지:', isDevelopment ? '개발 모드' : '프로덕션 모드');

  // 방법 1: 환경별 process.env 변수 사용
  if (isDevelopment) {
    // 로컬 개발 환경
    if (process.env.EXPO_PUBLIC_API_URL_DEV) {
      console.log('[API Client] ✅ 개발 URL:', process.env.EXPO_PUBLIC_API_URL_DEV);
      return process.env.EXPO_PUBLIC_API_URL_DEV;
    }
  } else {
    // 프로덕션 환경
    if (process.env.EXPO_PUBLIC_API_URL_PROD) {
      console.log('[API Client] ✅ 프로덕션 URL:', process.env.EXPO_PUBLIC_API_URL_PROD);
      return process.env.EXPO_PUBLIC_API_URL_PROD;
    }
  }

  // 방법 2: Constants.expoConfig.extra (환경별)
  const extraConfig = Constants.expoConfig?.extra;
  if (extraConfig) {
    const url = isDevelopment ? extraConfig.apiUrlDev : extraConfig.apiUrlProd;
    if (url) {
      console.log('[API Client] ✅ Constants에서 가져옴:', url);
      return url;
    }
  }

  // 방법 3: 하드코딩된 폴백
  const fallbackUrl = isDevelopment
    ? 'http://10.20.35.24:3000'  // 개발 폴백 (변경됨: 192.168.0.40 → 10.20.35.24)
    : 'https://hulife-app-jaehaeng2001-2614-jaehaeng2001-2614s-projects.vercel.app';  // 프로덕션 폴백

  console.warn('[API Client] ⚠️ 환경 변수 없음. 폴백 사용:', fallbackUrl);
  return fallbackUrl;
};

export const API_URL = getApiUrl();
export const TOKEN_KEY = 'userToken';

console.log('[API Client] 🌐 최종 API_URL:', API_URL);
console.log('[API Client] 📍 환경:', __DEV__ ? '개발' : '프로덕션');

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: `${API_URL}/api`,  // ✅ /api 접두사 추가
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