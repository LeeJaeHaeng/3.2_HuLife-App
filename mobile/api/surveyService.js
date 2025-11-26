import api from './apiClient';

// 설문 답변 제출 API 호출 함수
export const submitSurveyAnswers = async (responses) => {
  console.log(`[API 서비스] 📞 설문 제출 요청`);
  try {
    // ✅ 토큰 헤더 자동 처리
    const response = await api.post('/survey', responses);

    console.log(`[API 서비스] ✅ 설문 제출 성공!`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 설문 제출 실패!:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '설문 제출 중 오류가 발생했습니다.');
  }
};

// 추천 목록 API 호출 함수
export const getRecommendationsAPI = async () => {
  console.log(`[API 서비스] 📞 추천 목록 요청`);
  try {
    // ✅ 토큰 헤더 자동 처리
    const response = await api.get('/recommendations');

    console.log(`[API 서비스] ✅ 추천 목록 요청 성공!`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 추천 목록 요청 실패!:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '추천 목록을 불러오는 중 오류가 발생했습니다.');
  }
};