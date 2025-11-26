import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import cacheService from './cacheService';
import Constants from 'expo-constants';

// API URL - 환경별 자동 전환 (개발/프로덕션)
const getApiUrl = () => {
  // 🔍 빌드 환경 감지 (더 안정적인 방법)
  const isStandaloneBuild = Constants.executionEnvironment === 'standalone' ||
                             Constants.executionEnvironment === 'storeClient';
  const isDevelopment = __DEV__ && !isStandaloneBuild;

  console.log('[API Client] 🔍 환경 감지:', {
    __DEV__,
    executionEnvironment: Constants.executionEnvironment,
    isStandaloneBuild,
    isDevelopment
  });

  // 🎯 우선순위 1: APK/AAB 빌드는 무조건 PROD URL 사용
  if (isStandaloneBuild) {
    if (process.env.EXPO_PUBLIC_API_URL_PROD) {
      console.log('[API Client] ✅ [APK] 프로덕션 URL:', process.env.EXPO_PUBLIC_API_URL_PROD);
      return process.env.EXPO_PUBLIC_API_URL_PROD;
    }
    // APK 빌드인데 PROD URL이 없으면 에러!
    const prodUrl = 'https://hulife-app-jaehaeng2001-2614-jaehaeng2001-2614s-projects.vercel.app';
    console.error('[API Client] ❌ EXPO_PUBLIC_API_URL_PROD 없음! 하드코딩된 PROD URL 사용:', prodUrl);
    return prodUrl;
  }

  // 🎯 우선순위 2: 개발 환경 (Expo Go, npx expo start)
  if (isDevelopment) {
    if (process.env.EXPO_PUBLIC_API_URL_DEV) {
      console.log('[API Client] ✅ [DEV] 개발 URL:', process.env.EXPO_PUBLIC_API_URL_DEV);
      return process.env.EXPO_PUBLIC_API_URL_DEV;
    }
    // 개발 환경인데 DEV URL이 없으면 경고
    const devUrl = 'http://10.20.35.24:3000';
    console.warn('[API Client] ⚠️ EXPO_PUBLIC_API_URL_DEV 없음! 폴백 DEV URL 사용:', devUrl);
    return devUrl;
  }

  // 🎯 우선순위 3: 알 수 없는 환경 (PROD URL 사용)
  const fallbackUrl = process.env.EXPO_PUBLIC_API_URL_PROD ||
                      'https://hulife-app-jaehaeng2001-2614-jaehaeng2001-2614s-projects.vercel.app';
  console.warn('[API Client] ⚠️ 알 수 없는 환경. PROD URL 사용:', fallbackUrl);
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