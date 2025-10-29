import api from './apiClient';
import * as SecureStore from 'expo-secure-store';
import { TOKEN_KEY } from './apiClient';

// --- ✨ 로그인 API 호출 함수 추가 ---
export const loginUser = async (email, password) => {
  console.log(`[API 서비스] 📞 로그인 요청`);
  try {
    const response = await api.post('/auth/login', { email, password });
    console.log(`[API 서비스] ✅ 로그인 성공!`);
    
    if (response.data.token) {
      await SecureStore.setItemAsync(TOKEN_KEY, response.data.token);
      console.log(`[API 서비스] 🔑 토큰 저장 완료!`);
      return response.data;
    } else {
      throw new Error("서버로부터 토큰을 받지 못했습니다.");
    }
  } catch (error) {
    console.error("[API 서비스] ❌ 로그인 실패!:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '로그인 중 오류가 발생했습니다.'); 
  }
};
// ------------------------------------

// --- ✨ 사용자 정보 요청 함수 수정 ---
export const getCurrentUser = async () => {
  try {
    console.log("[API 서비스] � 현재 사용자 정보 요청");
    const response = await api.get('/auth/me');

    console.log("[API 서비스] ✅ 현재 사용자 정보 요청 성공!");
    return response.data; 
  } catch (error) {
    console.error("[API 서비스] ❌ 현재 사용자 정보 요청 실패!:", error.response?.data?.error || error.message);
    // 토큰 만료 등의 경우 토큰 삭제
    if (error.response?.status === 401) {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        console.log("[API 서비스] 🗑️ 유효하지 않은 토큰 삭제 완료.");
    }
    throw error; 
  }
};
// ----------------------------------

// ✨ 로그아웃 함수 추가
export const logoutUser = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    console.log("[API 서비스] 🗑️ 로그아웃: 토큰 삭제 완료.");
    // TODO: 필요하다면 서버에 로그아웃 API 호출 (선택 사항)
};

// ✨ 회원가입 함수 추가
export const registerUser = async (userData) => {
  console.log(`[API 서비스] 📞 회원가입 요청`);
  try {
    const response = await api.post('/auth/register', userData);
    console.log(`[API 서비스] ✅ 회원가입 성공!`);

    if (response.data.token) {
      await SecureStore.setItemAsync(TOKEN_KEY, response.data.token);
      console.log(`[API 서비스] 🔑 토큰 저장 완료!`);
      return response.data;
    } else {
      throw new Error("서버로부터 토큰을 받지 못했습니다.");
    }
  } catch (error) {
    console.error("[API 서비스] ❌ 회원가입 실패!:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '회원가입 중 오류가 발생했습니다.');
  }
};