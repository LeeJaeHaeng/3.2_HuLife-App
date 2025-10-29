/**
 * API Configuration
 *
 * IP 주소 변경 시 이 파일의 BASE_IP만 수정하면 됩니다.
 *
 * 사용 방법:
 * 1. Wi-Fi 재연결 시 ipconfig로 현재 IPv4 주소 확인
 * 2. 아래 BASE_IP만 변경
 */

// ⚠️ IP 주소 변경 시 여기만 수정하세요!
const BASE_IP = '10.20.35.108';
const BASE_PORT = 3000;

// 자동으로 모든 URL 생성
export const API_CONFIG = {
  BASE_IP,
  BASE_PORT,
  API_URL: `http://${BASE_IP}:${BASE_PORT}/api`,
  SOCKET_URL: `http://${BASE_IP}:${BASE_PORT}`,
  WEB_URL: `http://${BASE_IP}:${BASE_PORT}`,
};

// 개발 환경에서 IP를 자동으로 콘솔에 출력
if (__DEV__) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📡 API Configuration');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🌐 Base IP:', API_CONFIG.BASE_IP);
  console.log('🔌 Port:', API_CONFIG.BASE_PORT);
  console.log('🚀 API URL:', API_CONFIG.API_URL);
  console.log('💬 Socket URL:', API_CONFIG.SOCKET_URL);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('💡 Tip: IP 변경 시 mobile/config/api.config.js의');
  console.log('    BASE_IP만 수정하세요!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

export default API_CONFIG;
