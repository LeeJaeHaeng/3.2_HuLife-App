import api, { API_URL, TOKEN_KEY } from './apiClient';
import { logActivity, ActivityTypes } from './activityService';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

// Get user's interested hobbies (디버깅 로그 추가)
export const getUserHobbiesAPI = async () => {
  console.log(`[API 서비스] 📞 관심 취미 목록 요청`);
  try {
    const response = await api.get('/user/hobbies');

    // ✨ 서버로부터 받은 응답 데이터 개수만 확인
    console.log(`[API 서비스] ✅ 관심 취미 목록 응답 받음: ${response.data?.length || 0}개`);

    // 응답 데이터가 배열인지 다시 한번 확인하고 반환
    if (Array.isArray(response.data)) {
        return response.data; // Array of user hobbies
    } else {
        console.warn("[API 서비스] ⚠️ 경고: 서버에서 받은 관심 취미 데이터가 배열이 아닙니다. 빈 배열을 반환합니다.");
        return []; // 배열이 아니면 빈 배열을 반환하여 앱 오류 방지
    }

  } catch (error) {
    console.error("[API 서비스] ❌ 관심 취미 목록 요청 실패!:", error.response?.data?.error || error.message);
    // 실패 시에도 빈 배열을 반환하여 앱 오류 방지 (선택적)
    // throw new Error(error.response?.data?.error || '관심 취미 목록 조회 중 오류 발생');
    console.warn("[API 서비스] ⚠️ 경고: 관심 취미 목록 요청 실패. 빈 배열을 반환합니다.");
    return []; // 실패 시 빈 배열 반환
  }
};

// Add hobby to interests
export const addHobbyToUserAPI = async (hobbyId, status = 'interested') => {
  const requestUrl = `${API_URL}/user/hobbies`;
  console.log(`[API 서비스] 📞 관심 취미 추가 요청: ${requestUrl}`, { hobbyId, status });
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await axios.post(requestUrl, { hobbyId, status }, {
      headers: { Authorization: `Bearer ${token}` }
    });

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
  // URL에 hobbyId를 쿼리 파라미터로 추가
  const requestUrl = `${API_URL}/user/hobbies?hobbyId=${hobbyId}`;
  console.log(`[API 서비스] 📞 관심 취미 제거 요청: ${requestUrl}`);
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await axios.delete(requestUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });

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
  const requestUrl = `${API_URL}/user/communities`;
  console.log(`[API 서비스] 📞 참여 모임 목록 요청: ${requestUrl}`);
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await axios.get(requestUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log(`[API 서비스] ✅ 참여 모임 목록 응답 받음`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("[API 서비스] ❌ 참여 모임 목록 요청 실패!:", error.response?.data?.error || error.message);
    console.warn("[API 서비스] ⚠️ 경고: 참여 모임 목록 요청 실패. 빈 배열을 반환합니다.");
    return [];
  }
};

// Get user schedules
export const getUserSchedulesAPI = async () => {
  const requestUrl = `${API_URL}/user/schedules`;
  console.log(`[API 서비스] 📞 일정 목록 요청: ${requestUrl}`);
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await axios.get(requestUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log(`[API 서비스] ✅ 일정 목록 응답 받음`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("[API 서비스] ❌ 일정 목록 요청 실패!:", error.response?.data?.error || error.message);
    console.warn("[API 서비스] ⚠️ 경고: 일정 목록 요청 실패. 빈 배열을 반환합니다.");
    return [];
  }
};

// Create a new schedule
export const createScheduleAPI = async (scheduleData) => {
  const requestUrl = `${API_URL}/user/schedules`;
  console.log(`[API 서비스] 📞 일정 생성 요청: ${requestUrl}`, scheduleData);
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await axios.post(requestUrl, scheduleData, {
      headers: { Authorization: `Bearer ${token}` }
    });

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
  const requestUrl = `${API_URL}/user/profile`;
  console.log(`[API 서비스] 📞 프로필 업데이트 요청: ${requestUrl}`);
  console.log(`[API 서비스] 📦 전송 데이터 키:`, Object.keys(profileData));

  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!token) throw new Error("로그인이 필요합니다.");

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const response = await axios.put(requestUrl, profileData, { headers });

    console.log(`[API 서비스] ✅ 프로필 업데이트 성공`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 프로필 업데이트 실패!:", error.response?.data?.error || error.message);
    console.error("[API 서비스] ❌ 전체 에러:", error);
    console.error("[API 서비스] ❌ 응답 상태:", error.response?.status);
    console.error("[API 서비스] ❌ 응답 데이터:", error.response?.data);
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