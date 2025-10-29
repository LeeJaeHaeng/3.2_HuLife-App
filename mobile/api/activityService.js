import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/api.config';

// API Base URL (환경에 따라 변경)
const API_BASE_URL = __DEV__
  ? API_CONFIG.WEB_URL  // 개발 환경
  : 'https://your-production-url.com';  // 프로덕션 환경

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: 모든 요청에 인증 토큰 추가
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('[Activity Service] Failed to get auth token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Log user activity
 * @param {string} activityType - Type of activity (view_hobby, view_community, etc.)
 * @param {string} targetId - ID of the target resource (hobby id, community id, etc.)
 * @param {object} metadata - Additional metadata (searchQuery, duration, etc.)
 */
export const logActivity = async (activityType, targetId = null, metadata = null) => {
  try {
    const response = await apiClient.post('/api/activities', {
      activityType,
      targetId,
      metadata,
    });
    return response.data;
  } catch (error) {
    // Silently fail - activity logging shouldn't break user experience
    console.warn('[Activity Service] Failed to log activity:', error.message);
    return { success: false };
  }
};

/**
 * Get user activities (for analytics/debugging)
 * @param {number} limit - Number of activities to fetch
 * @param {string} type - Filter by activity type (optional)
 */
export const getUserActivities = async (limit = 50, type = null) => {
  try {
    const params = { limit };
    if (type) params.type = type;

    const response = await apiClient.get('/api/activities', { params });
    return response.data.activities || [];
  } catch (error) {
    console.error('[Activity Service] Failed to get activities:', error);
    throw error;
  }
};

/**
 * Activity type constants for consistency
 */
export const ActivityTypes = {
  VIEW_HOBBY: 'view_hobby',
  VIEW_COMMUNITY: 'view_community',
  VIEW_POST: 'view_post',
  SEARCH: 'search',
  JOIN_COMMUNITY: 'join_community',
  ADD_HOBBY_INTEREST: 'add_hobby_interest',
  REMOVE_HOBBY_INTEREST: 'remove_hobby_interest',
  COMPLETE_SURVEY: 'complete_survey',
  CREATE_POST: 'create_post',
  CREATE_SCHEDULE: 'create_schedule',
};

/**
 * Helper function to track page views with duration
 */
export class ActivityTracker {
  constructor() {
    this.startTime = null;
    this.activityType = null;
    this.targetId = null;
  }

  /**
   * Start tracking a page view
   */
  startTracking(activityType, targetId) {
    this.startTime = Date.now();
    this.activityType = activityType;
    this.targetId = targetId;
  }

  /**
   * Stop tracking and log the activity with duration
   */
  async stopTracking(additionalMetadata = {}) {
    if (!this.startTime || !this.activityType) {
      return;
    }

    const duration = Math.floor((Date.now() - this.startTime) / 1000); // seconds

    await logActivity(this.activityType, this.targetId, {
      duration,
      ...additionalMetadata,
    });

    // Reset tracker
    this.startTime = null;
    this.activityType = null;
    this.targetId = null;
  }
}

export default {
  logActivity,
  getUserActivities,
  ActivityTypes,
  ActivityTracker,
};
