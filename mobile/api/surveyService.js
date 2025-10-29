import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG } from '../config/api.config';

const API_URL = API_CONFIG.API_URL;
const TOKEN_KEY = 'userToken';

// 설문 답변 제출 API 호출 함수
export const submitSurveyAnswers = async (responses) => {
  const requestUrl = `${API_URL}/survey`;
  console.log(`[API 서비스] 📞 설문 제출 요청: ${requestUrl}`);
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }

    const response = await axios.post(requestUrl, responses, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log(`[API 서비스] ✅ 설문 제출 성공!`);
    return response.data; // { message: "..." } 객체 반환
  } catch (error) {
    console.error("[API 서비스] ❌ 설문 제출 실패!:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '설문 제출 중 오류가 발생했습니다.');
  }
};

// 추천 목록 API 호출 함수
export const getRecommendationsAPI = async () => {
  const requestUrl = `${API_URL}/recommendations`;
  console.log(`[API 서비스] 📞 추천 목록 요청: ${requestUrl}`);
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }

    const response = await axios.get(requestUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log(`[API 서비스] ✅ 추천 목록 요청 성공!`);
    return response.data; // 추천된 취미 배열 반환
  } catch (error) {
    console.error("[API 서비스] ❌ 추천 목록 요청 실패!:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '추천 목록을 불러오는 중 오류가 발생했습니다.');
  }
};