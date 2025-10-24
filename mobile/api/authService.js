import axios from 'axios';
import * as SecureStore from 'expo-secure-store'; // ✨ SecureStore 가져오기

const API_URL = 'http://10.188.236.63:3000/api'; // 현재 IP 주소
const TOKEN_KEY = 'userToken'; // 토큰 저장 시 사용할 키 이름

// --- ✨ 로그인 API 호출 함수 추가 ---
export const loginUser = async (email, password) => {
  const requestUrl = `${API_URL}/auth/login`;
  console.log(`[API 서비스] 📞 로그인 요청: ${requestUrl}`);
  try {
    const response = await axios.post(requestUrl, { email, password });
    console.log(`[API 서비스] ✅ 로그인 성공!`);
    
    // ✨ 로그인 성공 시 받은 토큰을 안전하게 저장합니다.
    if (response.data.token) {
      await SecureStore.setItemAsync(TOKEN_KEY, response.data.token);
      console.log(`[API 서비스] 🔑 토큰 저장 완료!`);
      return response.data; // { token: "..." } 객체 반환
    } else {
      throw new Error("서버로부터 토큰을 받지 못했습니다.");
    }
  } catch (error) {
    console.error("[API 서비스] ❌ 로그인 실패!:", error.response?.data?.error || error.message);
    // 에러 메시지를 반환하여 화면에 표시하도록 함
    throw new Error(error.response?.data?.error || '로그인 중 오류가 발생했습니다.'); 
  }
};
// ------------------------------------

// --- ✨ 사용자 정보 요청 함수 수정 ---
export const getCurrentUser = async () => {
  try {
    // ✨ 저장된 토큰을 가져옵니다.
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    
    if (!token) {
        console.warn("[API 서비스] ❓ 저장된 토큰이 없습니다. 로그인이 필요합니다.");
        throw new Error("로그인이 필요합니다."); // 토큰 없으면 에러 발생
    }
    console.log("[API 서비스] 🔑 저장된 토큰 확인 완료.");

    // ✨ Authorization 헤더에 토큰을 담아 요청합니다.
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

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
  const requestUrl = `${API_URL}/auth/register`;
  console.log(`[API 서비스] 📞 회원가입 요청: ${requestUrl}`);
  try {
    const response = await axios.post(requestUrl, userData);
    console.log(`[API 서비스] ✅ 회원가입 성공!`);

    // 회원가입 성공 시 받은 토큰을 안전하게 저장합니다.
    if (response.data.token) {
      await SecureStore.setItemAsync(TOKEN_KEY, response.data.token);
      console.log(`[API 서비스] 🔑 토큰 저장 완료!`);
      return response.data; // { token: "...", user: {...} } 객체 반환
    } else {
      throw new Error("서버로부터 토큰을 받지 못했습니다.");
    }
  } catch (error) {
    console.error("[API 서비스] ❌ 회원가입 실패!:", error.response?.data?.error || error.message);
    // 에러 메시지를 반환하여 화면에 표시하도록 함
    throw new Error(error.response?.data?.error || '회원가입 중 오류가 발생했습니다.');
  }
};