// mobile/api/activityService.js
import api from './apiClient';

/**
 * Log user activity
 */
export const logActivity = async (activityType, targetId = null, metadata = null) => {
  try {
    // apiClient에는 이미 base URL이 설정되어 있으므로 뒷부분만 적으면 됩니다.
    // 서버 API 경로가 /activities 인지 /api/activities 인지 확인 필요
    // 보통 apiClient가 /api 까지 포함한다면 여기서는 /activities 만 씀
    const response = await api.post('/activities', {
      activityType,
      targetId,
      metadata,
    });
    return response.data;
  } catch (error) {
    // 활동 로그 실패는 사용자 경험을 방해하지 않도록 콘솔만 찍음
    console.warn('[Activity Service] Failed to log activity:', error.message);
    return { success: false };
  }
};

/**
 * Get user activities
 */
export const getUserActivities = async (limit = 50, type = null) => {
  try {
    const params = { limit };
    if (type) params.type = type;

    const response = await api.get('/activities', { params });
    return response.data.activities || [];
  } catch (error) {
    console.error('[Activity Service] Failed to get activities:', error);
    throw error;
  }
};

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

export class ActivityTracker {
  constructor() {
    this.startTime = null;
    this.activityType = null;
    this.targetId = null;
  }

  startTracking(activityType, targetId) {
    this.startTime = Date.now();
    this.activityType = activityType;
    this.targetId = targetId;
  }

  async stopTracking(additionalMetadata = {}) {
    if (!this.startTime || !this.activityType) {
      return;
    }
    const duration = Math.floor((Date.now() - this.startTime) / 1000);
    await logActivity(this.activityType, this.targetId, {
      duration,
      ...additionalMetadata,
    });
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