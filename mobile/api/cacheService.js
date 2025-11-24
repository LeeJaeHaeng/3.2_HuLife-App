import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

/**
 * Cache Service
 * - 오프라인 모드 지원
 * - API 응답 캐싱
 * - 네트워크 상태 감지
 * - 자동 캐시 무효화
 */

const CACHE_PREFIX = '@hulife_cache_';
const CACHE_EXPIRY = 30 * 60 * 1000; // 30분

class CacheService {
  constructor() {
    this.isOnline = true;
    this.listeners = [];

    // 네트워크 상태 리스너 설정
    this.setupNetworkListener();
  }

  /**
   * 네트워크 상태 리스너 설정
   */
  setupNetworkListener() {
    NetInfo.addEventListener((state) => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected && state.isInternetReachable !== false;

      console.log('[캐시 서비스] 네트워크 상태:', this.isOnline ? '온라인' : '오프라인');

      // 오프라인 → 온라인 전환 시 리스너 호출
      if (wasOffline && this.isOnline) {
        this.notifyOnlineStatusChange(true);
      } else if (!wasOffline && !this.isOnline) {
        this.notifyOnlineStatusChange(false);
      }
    });
  }

  /**
   * 네트워크 상태 변경 리스너 추가
   */
  addOnlineStatusListener(callback) {
    this.listeners.push(callback);
  }

  /**
   * 네트워크 상태 변경 알림
   */
  notifyOnlineStatusChange(isOnline) {
    this.listeners.forEach((callback) => callback(isOnline));
  }

  /**
   * 현재 네트워크 상태 확인
   */
  async checkNetworkStatus() {
    const state = await NetInfo.fetch();
    this.isOnline = state.isConnected && state.isInternetReachable !== false;
    return this.isOnline;
  }

  /**
   * 캐시에 데이터 저장
   */
  async set(key, data, expiryMs = CACHE_EXPIRY) {
    try {
      const cacheKey = CACHE_PREFIX + key;
      const cacheData = {
        data,
        timestamp: Date.now(),
        expiry: expiryMs,
      };
      await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
      console.log(`[캐시 서비스] ✅ 캐시 저장: ${key}`);
    } catch (error) {
      console.error(`[캐시 서비스] ❌ 캐시 저장 실패: ${key}`, error);
    }
  }

  /**
   * 캐시에서 데이터 조회
   */
  async get(key) {
    try {
      const cacheKey = CACHE_PREFIX + key;
      const cachedItem = await AsyncStorage.getItem(cacheKey);

      if (!cachedItem) {
        console.log(`[캐시 서비스] ⚠️ 캐시 없음: ${key}`);
        return null;
      }

      const { data, timestamp, expiry } = JSON.parse(cachedItem);
      const age = Date.now() - timestamp;

      // 캐시 만료 확인
      if (age > expiry) {
        console.log(`[캐시 서비스] ⏰ 캐시 만료: ${key} (${Math.floor(age / 1000)}초 지남)`);
        await this.remove(key);
        return null;
      }

      console.log(`[캐시 서비스] ✅ 캐시 조회: ${key} (${Math.floor(age / 1000)}초 전)`);
      return data;
    } catch (error) {
      console.error(`[캐시 서비스] ❌ 캐시 조회 실패: ${key}`, error);
      return null;
    }
  }

  /**
   * 캐시 삭제
   */
  async remove(key) {
    try {
      const cacheKey = CACHE_PREFIX + key;
      await AsyncStorage.removeItem(cacheKey);
      console.log(`[캐시 서비스] 🗑️ 캐시 삭제: ${key}`);
    } catch (error) {
      console.error(`[캐시 서비스] ❌ 캐시 삭제 실패: ${key}`, error);
    }
  }

  /**
   * 전체 캐시 삭제 (특정 패턴)
   */
  async clearPattern(pattern) {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((k) => k.startsWith(CACHE_PREFIX) && k.includes(pattern));
      await AsyncStorage.multiRemove(cacheKeys);
      console.log(`[캐시 서비스] 🗑️ 패턴 캐시 삭제: ${pattern} (${cacheKeys.length}개)`);
    } catch (error) {
      console.error(`[캐시 서비스] ❌ 패턴 캐시 삭제 실패:`, error);
    }
  }

  /**
   * 전체 캐시 삭제
   */
  async clearAll() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((k) => k.startsWith(CACHE_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
      console.log(`[캐시 서비스] 🗑️ 전체 캐시 삭제 (${cacheKeys.length}개)`);
    } catch (error) {
      console.error(`[캐시 서비스] ❌ 전체 캐시 삭제 실패:`, error);
    }
  }

  /**
   * Stale-While-Revalidate 패턴
   * 캐시된 데이터를 즉시 반환하고, 백그라운드에서 최신 데이터 가져오기
   */
  async getStaleWhileRevalidate(key, fetchFn, expiryMs = CACHE_EXPIRY) {
    // 1. 캐시된 데이터 먼저 반환 (Stale)
    const cachedData = await this.get(key);

    // 2. 온라인이면 백그라운드에서 최신 데이터 가져오기 (Revalidate)
    if (this.isOnline) {
      fetchFn()
        .then((freshData) => {
          this.set(key, freshData, expiryMs);
        })
        .catch((error) => {
          console.error(`[캐시 서비스] Revalidate 실패: ${key}`, error);
        });
    }

    return cachedData;
  }

  /**
   * Cache-First 패턴
   * 캐시가 있으면 반환, 없거나 만료되면 API 호출
   */
  async getCacheFirst(key, fetchFn, expiryMs = CACHE_EXPIRY) {
    // 1. 캐시 확인
    const cachedData = await this.get(key);
    if (cachedData) {
      return cachedData;
    }

    // 2. 캐시 없음 → API 호출
    if (!this.isOnline) {
      throw new Error('오프라인 상태이고 캐시된 데이터도 없습니다.');
    }

    const freshData = await fetchFn();
    await this.set(key, freshData, expiryMs);
    return freshData;
  }

  /**
   * Network-First 패턴
   * 온라인이면 API 호출, 실패하면 캐시 반환
   */
  async getNetworkFirst(key, fetchFn, expiryMs = CACHE_EXPIRY) {
    if (this.isOnline) {
      try {
        const freshData = await fetchFn();
        await this.set(key, freshData, expiryMs);
        return freshData;
      } catch (error) {
        console.warn(`[캐시 서비스] API 호출 실패, 캐시 사용: ${key}`, error);
        const cachedData = await this.get(key);
        if (cachedData) {
          return cachedData;
        }
        throw error;
      }
    } else {
      // 오프라인 → 캐시 사용
      const cachedData = await this.get(key);
      if (cachedData) {
        return cachedData;
      }
      throw new Error('오프라인 상태이고 캐시된 데이터도 없습니다.');
    }
  }
}

// Singleton 인스턴스
const cacheService = new CacheService();
export default cacheService;
