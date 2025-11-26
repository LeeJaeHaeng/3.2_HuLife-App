# HuLife 모바일 앱 환경 설정 가이드

## 📱 개발 환경 설정

### 1. `.env` 파일 생성
```bash
cp .env.example .env
```

### 2. 로컬 IP 확인
**Windows:**
```bash
ipconfig
# Wi-Fi 또는 이더넷의 IPv4 주소 확인
```

**Mac/Linux:**
```bash
ifconfig
# en0 또는 eth0의 inet 주소 확인
```

### 3. `.env` 파일 수정
```env
# 개발 환경 (예: 10.20.35.24)
EXPO_PUBLIC_API_URL_DEV=http://YOUR_LOCAL_IP:3000

# 프로덕션 환경 (변경 안 함)
EXPO_PUBLIC_API_URL_PROD=https://hulife-app-jaehaeng2001-2614-jaehaeng2001-2614s-projects.vercel.app
```

### 4. Expo 앱 재시작
```bash
# Metro bundler 종료 (Ctrl+C)
# 캐시 클리어 후 재시작
npx expo start -c
```

## 🔧 트러블슈팅

### Network Error 발생 시
1. `.env` 파일의 IP 주소 확인
2. 서버가 실행 중인지 확인 (`npm run dev:socket`)
3. 방화벽 설정 확인
4. Metro bundler 캐시 클리어 (`npx expo start -c`)

### IP 주소 변경 시
1. `ipconfig`로 새 IP 확인
2. `.env` 파일 수정
3. Expo 앱 재시작

## 📝 참고사항
- `.env` 파일은 Git에 커밋되지 않습니다
- IP 주소는 네트워크 환경에 따라 자동으로 변경될 수 있습니다
- 배포 빌드 시 프로덕션 URL이 자동으로 사용됩니다
