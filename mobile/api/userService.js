import api from './apiClient'; // ✅ axios 대신 api 사용
import { logActivity, ActivityTypes } from './activityService';

// Get user's interested hobbies
export const getUserHobbiesAPI = async () => {
  console.log(`[API 서비스] 📞 관심 취미 목록 요청`);
  try {
    // ✅ api 사용 (baseURL 자동 적용)
    const response = await api.get('/user/hobbies');

    console.log(`[API 서비스] ✅ 관심 취미 목록 응답 받음: ${response.data?.length || 0}개`);

    if (Array.isArray(response.data)) {
        return response.data;
    } else {
        console.warn("[API 서비스] ⚠️ 경고: 서버 데이터가 배열이 아닙니다. 빈 배열 반환.");
        return [];
    }

  } catch (error) {
    // api 인터셉터에서 에러 로그를 이미 찍지만, 서비스별 처리를 위해 남겨둠
    console.error("[API 서비스] ❌ 관심 취미 목록 요청 실패!:", error.response?.data?.error || error.message);
    return [];
  }
};

// Add hobby to interests
export const addHobbyToUserAPI = async (hobbyId, status = 'interested') => {
  console.log(`[API 서비스] 📞 관심 취미 추가 요청:`, { hobbyId, status });
  try {
    // ✅ 토큰 헤더 설정 불필요 (api가 자동 처리)
    const response = await api.post('/user/hobbies', { hobbyId, status });

    // Log activity
    logActivity(ActivityTypes.ADD_HOBBY_INTEREST, hobbyId);

    console.log(`[API 서비스] ✅ 관심 취미 추가 성공!`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 관심 취미 추가 실패!:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '관심 취미 추가 중 오류가 발생했습니다.');
  }
};

// Remove hobby from interests
export const removeHobbyFromUserAPI = async (hobbyId) => {
  console.log(`[API 서비스] 📞 관심 취미 제거 요청: ${hobbyId}`);
  try {
    const response = await api.delete(`/user/hobbies?hobbyId=${hobbyId}`);

    // Log activity
    logActivity(ActivityTypes.REMOVE_HOBBY_INTEREST, hobbyId);

    console.log(`[API 서비스] ✅ 관심 취미 제거 성공!`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 관심 취미 제거 실패!:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '관심 취미 제거 중 오류가 발생했습니다.');
  }
};

// Get user communities
export const getUserCommunitiesAPI = async () => {
  console.log(`[API 서비스] 📞 참여 모임 목록 요청`);
  try {
    const response = await api.get('/user/communities');

    console.log(`[API 서비스] ✅ 참여 모임 목록 응답 받음`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("[API 서비스] ❌ 참여 모임 목록 요청 실패!:", error.response?.data?.error || error.message);
    return [];
  }
};

// Get user schedules
export const getUserSchedulesAPI = async () => {
  console.log(`[API 서비스] 📞 일정 목록 요청`);
  try {
    const response = await api.get('/user/schedules');

    console.log(`[API 서비스] ✅ 일정 목록 응답 받음`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("[API 서비스] ❌ 일정 목록 요청 실패!:", error.response?.data?.error || error.message);
    return [];
  }
};

// Create a new schedule
export const createScheduleAPI = async (scheduleData) => {
  console.log(`[API 서비스] 📞 일정 생성 요청:`, scheduleData);
  try {
    const response = await api.post('/user/schedules', scheduleData);

    // Log activity
    logActivity(ActivityTypes.CREATE_SCHEDULE, scheduleData.hobbyId, {
      scheduleType: scheduleData.type,
      scheduleTitle: scheduleData.title
    });

    console.log(`[API 서비스] ✅ 일정 생성 성공`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 일정 생성 실패!:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || "일정 생성에 실패했습니다.");
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  console.log(`[API 서비스] 📞 프로필 업데이트 요청`);
  try {
    const response = await api.put('/user/profile', profileData);

    console.log(`[API 서비스] ✅ 프로필 업데이트 성공`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 프로필 업데이트 실패!:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || "프로필 업데이트에 실패했습니다.");
  }
};

// ==================== 수정/삭제 API ====================

// Update schedule
export const updateScheduleAPI = async (scheduleId, scheduleData) => {
  console.log(`[API 서비스] 📞 일정 수정 요청: ${scheduleId}`);
  try {
    const response = await api.put(`/user/schedules/${scheduleId}`, scheduleData);
    console.log(`[API 서비스] ✅ 일정 수정 성공!`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 일정 수정 실패!:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '일정 수정 중 오류가 발생했습니다.');
  }
};

// Delete schedule
export const deleteScheduleAPI = async (scheduleId) => {
  console.log(`[API 서비스] 📞 일정 삭제 요청: ${scheduleId}`);
  try {
    const response = await api.delete(`/user/schedules/${scheduleId}`);
    console.log(`[API 서비스] ✅ 일정 삭제 성공!`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 일정 삭제 실패!:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '일정 삭제 중 오류가 발생했습니다.');
  }
};

// ==================== 학습 진행도 API ====================

// Update hobby progress
export const updateHobbyProgressAPI = async (hobbyId, progress, status = null) => {
  console.log(`[API 서비스] 📞 학습 진행도 업데이트 요청: ${hobbyId}`, { progress, status });
  try {
    const data = { progress };
    if (status) data.status = status;

    const response = await api.put(`/user/hobbies/${hobbyId}`, data);
    console.log(`[API 서비스] ✅ 학습 진행도 업데이트 성공!`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 학습 진행도 업데이트 실패!:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '학습 진행도 업데이트 중 오류가 발생했습니다.');
  }
};

// Update curriculum progress
export const updateCurriculumProgressAPI = async (hobbyId, week, action) => {
  console.log(`[API 서비스] 📞 커리큘럼 진행도 업데이트 요청: ${hobbyId}`, { week, action });
  try {
    const response = await api.post(`/user/hobbies/${hobbyId}/curriculum`, { week, action });
    console.log(`[API 서비스] ✅ 커리큘럼 진행도 업데이트 성공!`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 커리큘럼 진행도 업데이트 실패!:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '커리큘럼 진행도 업데이트 중 오류가 발생했습니다.');
  }
};

// Get curriculum progress
export const getCurriculumProgressAPI = async (hobbyId) => {
  console.log(`[API 서비스] 📞 커리큘럼 진행 상황 조회: ${hobbyId}`);
  try {
    const response = await api.get(`/user/hobbies/${hobbyId}/curriculum`);
    console.log(`[API 서비스] ✅ 커리큘럼 진행 상황 조회 성공!`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 커리큘럼 진행 상황 조회 실패!:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '커리큘럼 진행 상황 조회 중 오류가 발생했습니다.');
  }
};

// Get learning stats
export const getLearningStatsAPI = async () => {
  console.log(`[API 서비스] 📞 학습 통계 조회`);
  try {
    const response = await api.get('/user/learning-stats');
    console.log(`[API 서비스] ✅ 학습 통계 조회 성공!`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 학습 통계 조회 실패!:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '학습 통계 조회 중 오류가 발생했습니다.');
  }
};