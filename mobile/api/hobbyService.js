import api, { API_URL } from './apiClient';

export const getAllHobbies = async () => {
  try {
    // 캐시된 데이터를 먼저 보여주고, 백그라운드에서 최신 데이터 가져오기
    // ✅ api.getStale()은 이미 data를 반환하므로 바로 사용
    const data = await api.getStale('/hobbies');
    return data;
  } catch (error) {
    // 캐시된 데이터가 있으면 오류 대신 캐시 반환
    console.error("Error fetching hobbies:", error);
    throw error;
  }
};

export const getHobbyById = async (id) => {
  const requestUrl = `${API_URL}/hobbies/${id}`;
  console.log(`[API 서비스] 📞 취미 상세 정보 요청: ${requestUrl}`);

  try {
    const response = await api.get(`/hobbies/${id}`);
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
    const response = await api.get(`/hobbies/${hobbyId}/reviews`);
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
    const response = await api.post(`/hobbies/${hobbyId}/reviews`, reviewData);

    console.log(`[API 서비스] ✅ 리뷰 작성 성공`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 리뷰 작성 실패:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '리뷰 작성 중 오류가 발생했습니다.');
  }
};

// ==================== 수정/삭제 API ====================

// Update review
export const updateHobbyReview = async (reviewId, reviewData) => {
  const requestUrl = `${API_URL}/hobbies/reviews/${reviewId}`;
  console.log(`[API 서비스] 📞 리뷰 수정 요청: ${requestUrl}`, reviewData);
  try {
    const response = await api.put(`/hobbies/reviews/${reviewId}`, reviewData);

    console.log(`[API 서비스] ✅ 리뷰 수정 성공`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 리뷰 수정 실패:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '리뷰 수정 중 오류가 발생했습니다.');
  }
};

// Delete review
export const deleteHobbyReview = async (reviewId) => {
  const requestUrl = `${API_URL}/hobbies/reviews/${reviewId}`;
  console.log(`[API 서비스] 📞 리뷰 삭제 요청: ${requestUrl}`);
  try {
    const response = await api.delete(`/hobbies/reviews/${reviewId}`);

    console.log(`[API 서비스] ✅ 리뷰 삭제 성공`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 리뷰 삭제 실패:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '리뷰 삭제 중 오류가 발생했습니다.');
  }
};