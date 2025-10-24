import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

//===============================================//
// 사용자님의 IP 주소로 최종 수정되었습니다.     //
// cmd 창에서 'ipconfig' 명령어로 확인 가능.     //
const API_URL = 'http://10.188.236.63:3000/api';  //
//===============================================//
const TOKEN_KEY = 'userToken';

export const getAllHobbies = async () => {
  try {
    const response = await axios.get(`${API_URL}/hobbies`);
    return response.data;
  } catch (error) {
    console.error("Error fetching hobbies:", error);
    throw error;
  }
};

export const getHobbyById = async (id) => {
  const requestUrl = `${API_URL}/hobbies/${id}`;
  console.log(`[API 서비스] 📞 이 주소로 데이터를 요청합니다: ${requestUrl}`);

  try {
    const response = await axios.get(requestUrl);
    console.log(`[API 서비스] ✅ 요청 성공! 서버 상태: ${response.status}`);
    return response.data;
  } catch (error) {
    console.error("--------------------------------------------------");
    console.error("[API 서비스] ❌ 요청 실패! 아래에서 진짜 원인을 확인하세요:");
    if (error.response) {
      console.error('[실패 원인] 서버 응답 오류:', error.response.data);
      console.error('[실패 원인] HTTP 상태 코드:', error.response.status);
    } else if (error.request) {
      console.error('[실패 원인] 네트워크 오류: 서버로부터 응답이 없습니다. IP 주소나 방화벽을 확인하세요.');
    } else {
      console.error('[실패 원인] 요청 설정 오류:', error.message);
    }
    console.error("--------------------------------------------------");
    throw error;
  }
};

// ========== 리뷰 관련 함수 ==========

// Get reviews for a hobby
export const getHobbyReviews = async (hobbyId) => {
  const requestUrl = `${API_URL}/hobbies/${hobbyId}/reviews`;
  console.log(`[API 서비스] 📞 리뷰 목록 요청: ${requestUrl}`);
  try {
    const response = await axios.get(requestUrl);
    console.log(`[API 서비스] ✅ 리뷰 목록 응답 받음: ${response.data.length}개`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 리뷰 목록 요청 실패:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '리뷰 목록을 불러오는데 실패했습니다.');
  }
};

// Create a review for a hobby
export const createHobbyReview = async (hobbyId, reviewData) => {
  const requestUrl = `${API_URL}/hobbies/${hobbyId}/reviews`;
  console.log(`[API 서비스] 📞 리뷰 작성 요청: ${requestUrl}`, reviewData);
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await axios.post(requestUrl, reviewData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log(`[API 서비스] ✅ 리뷰 작성 성공`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 리뷰 작성 실패:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '리뷰 작성 중 오류가 발생했습니다.');
  }
};