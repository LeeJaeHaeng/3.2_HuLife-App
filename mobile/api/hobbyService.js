import axios from 'axios';
//===============================================//
// 사용자님의 IP 주소로 최종 수정되었습니다.     //
// cmd 창에서 'ipconfig' 명령어로 확인 가능.     //
const API_URL = 'http://10.20.35.102:3000/api';//
//===============================================//

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