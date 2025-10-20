import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://10.20.35.102:3000/api'; // ✅ 포트 번호 :3000 추가!
const TOKEN_KEY = 'userToken';

// Get user's interested hobbies (디버깅 로그 추가)
export const getUserHobbiesAPI = async () => {
  const requestUrl = `${API_URL}/user/hobbies`;
  console.log(`[API 서비스] 📞 관심 취미 목록 요청: ${requestUrl}`);
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await axios.get(requestUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // ✨ 서버로부터 받은 응답 데이터(response.data)를 직접 확인!
    console.log(`[API 서비스] ✅ 관심 취미 목록 응답 받음:`, JSON.stringify(response.data, null, 2));

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

    console.log(`[API 서비스] ✅ 관심 취미 제거 성공!`, response.data);
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

    console.log(`[API 서비스] ✅ 일정 생성 성공`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 일정 생성 실패!:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || "일정 생성에 실패했습니다.");
  }
};