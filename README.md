# HuLife - 은퇴자를 위한 취미 추천 및 커뮤니티 플랫폼

![완성도](https://img.shields.io/badge/완성도-98%25-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Expo](https://img.shields.io/badge/Expo-SDK%2054-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🌟 프로젝트 개요

**HuLife**는 은퇴 후 새로운 삶을 시작하는 분들을 위한 종합 취미 생활 플랫폼입니다. AI 기반 맞춤형 취미 추천, 커뮤니티 모임, 실시간 채팅, Instagram Reels 스타일 갤러리 등 다양한 기능을 통해 활기찬 노후 생활을 지원합니다.

### 핵심 가치
- 🎯 **AI 기반 개인화**: 하이브리드 알고리즘으로 맞춤형 취미 추천
- 👥 **커뮤니티**: 같은 관심사를 가진 사람들과의 소통
- 📸 **작품 공유**: Instagram Reels 스타일의 갤러리
- 💬 **실시간 소통**: WebSocket 기반 채팅 및 게시판
- 📴 **오프라인 모드**: 캐싱으로 네트워크 없이도 사용 가능

---

## 📱 프로젝트 구성

### 🌐 웹 애플리케이션 (Next.js 14)
- **기술**: Next.js 14, React 18, TypeScript
- **포트**: `http://0.0.0.0:3000` (모바일 접근 가능)
- **특징**: SSR, API Routes, OAuth 인증, Socket.IO 통합

### 📱 모바일 애플리케이션 (Expo SDK 54)
- **경로**: `/mobile`
- **기술**: Expo, React Native, TypeScript
- **특징**: QR 코드 즉시 실행, 웹과 98% 동일한 기능

---

## 🚀 빠른 시작

### 필수 요구사항
- **Node.js** 18 이상
- **npm** 또는 **pnpm**
- **Expo Go** 앱 (모바일 테스트 시)

### 1. 환경 변수 설정

```bash
# 백엔드 환경 변수
cp .env.example .env
# .env 파일을 열어 실제 값으로 수정

# 모바일 환경 변수
cp mobile/.env.example mobile/.env
# mobile/.env 파일을 열어 API_URL 수정
```

**필수 설정**:
- `DATABASE_URL` - Turso SQLite 데이터베이스 URL
- `SESSION_SECRET` - 32자 이상의 랜덤 문자열
- `API_URL` (모바일) - 현재 PC의 IP 주소 (예: `http://192.168.0.40:3000`)

OAuth 설정은 **선택사항**입니다. 소셜 로그인을 사용하지 않아도 이메일/비밀번호 로그인이 가능합니다.

### 2. 백엔드 서버 실행

```bash
# 의존성 설치
npm install

# Socket.IO 서버 실행 (권장)
npm run dev:socket

# 또는 일반 Next.js 서버
npm run dev
```

**서버 주소**:
- 로컬: http://localhost:3000
- 네트워크: http://[현재_IP]:3000

### 3. 모바일 앱 실행

```bash
# mobile 폴더로 이동
cd mobile

# 의존성 설치
npm install

# Expo 개발 서버 실행
npx expo start
```

**실행 방법**:
- 📱 **스마트폰**: Expo Go 앱으로 QR 코드 스캔
- 🤖 **Android**: 'a' 키로 에뮬레이터 실행
- 🍎 **iOS**: 'i' 키로 시뮬레이터 실행 (Mac만)

### ⚠️ 중요: IP 주소 설정

모바일 앱이 서버에 접근하려면 현재 PC의 IP 주소를 확인하고 설정해야 합니다:

```bash
# Windows에서 IP 확인
ipconfig

# mobile/.env 파일에서 API_URL 수정
API_URL=http://192.168.0.40:3000  # 현재 IPv4 주소로 변경
```

---

## 🎯 주요 기능

### ✅ 완전 구현된 기능 (97%)

#### 🔐 인증 시스템
- 이메일/비밀번호 로그인 및 회원가입
- OAuth 소셜 로그인 (카카오, 네이버, 구글)
- JWT 토큰 기반 세션 관리
- 프로필 이미지 업로드 (Base64)

#### 🎨 취미 관리
- 123개 이상의 취미 데이터베이스 (15개 카테고리)
- 상세한 취미 정보 (설명, 혜택, 준비물)
- 검색 및 다중 필터링 (카테고리, 난이도, 실내/외, 예산)
- 관심 취미 추가/제거
- 취미 리뷰 작성/수정/삭제

#### 📝 설문 및 추천
- 8개 질문 성향 분석 설문
- **하이브리드 추천 알고리즘**:
  - Content-based 필터링 (60-70%)
  - KNN 협업 필터링 (30-40%)
  - 사용자 활동 기반 동적 가중치
- 개인화된 추천 이유 제공
- 매칭도 점수 (0-100%)

#### 👥 커뮤니티 & 모임
- 모임 생성/수정/삭제 (리더 전용)
- 가입 신청 시스템 (승인/거절)
- 멤버 관리 (리더/일반 멤버)
- 위치, 일정, 정원 설정
- 취미별 필터링 및 검색

#### 💬 실시간 채팅
- **WebSocket 기반** (Socket.IO)
- 모임별 독립 채팅방
- 실시간 메시지 전송/수신
- 입력 중 표시 (Typing Indicator)
- 날짜 구분선 (카카오톡 스타일)
- 멤버 전용 접근 제어

#### 📰 게시판 시스템
- 게시글 작성/수정/삭제
- 카테고리별 필터 (자유게시판, 질문/답변, 정보공유)
- 댓글 작성/수정/삭제 (인라인 편집)
- 좋아요, 조회수 추적
- 이미지 첨부 (Base64)

#### 📸 갤러리 (Instagram Reels 스타일)
- 📱 **세로 풀스크린 UI** (contentFit: "cover")
- 🎬 **비디오 & 이미지 업로드**
- 🖼️ **취미 이미지 우선 표시** (hobbyImages 로컬 에셋 → Base64/URL → placeholder)
- ❤️ **통일된 좋아요 UI** (하단 메타 영역 18px 아이콘, 모든 작품 일관성)
- 💬 **댓글 시스템** (하단 스크롤 통합)
- 🎞️ **비디오 프로그레스 바**
- 🔄 **자동 재생/일시정지**
- 📊 **통계** (좋아요, 조회수, 댓글 수)
- ✏️ **작품 수정/삭제** (본인만)

#### 📅 일정 관리
- 일정 생성/수정/삭제 (Long Press)
- 캘린더 뷰
- 취미별 일정 분류
- 타입별 구분 (수업, 연습, 모임, 이벤트)

#### 📊 대시보드 & 마이페이지
- 실시간 통계 (관심 취미, 참여 모임, 일정)
- AI 추천 취미 목록 (매칭도 표시)
- 다가오는 일정
- 갤러리 회원 작품 보기 (2x2 그리드)
- **📝 내글 탭**: 내 작품 + 내 게시판 글 통합 관리
  - 서브탭으로 갤러리 작품/게시글 분리 표시
  - 2-column 그리드 (작품) / 리스트 (게시글)
  - 빈 상태 시 작성 유도 CTA
- 모던한 탭 디자인 (그림자 효과, 활성 탭 하이라이트)
- 한국어 형식 달력 (2025년 11월)

#### 🔔 Push 알림 (프로덕션 빌드 시)
- Expo Notifications로 푸시 알림 전송
- 새 메시지, 댓글, 가입 승인 등 알림
- Expo Go에서는 미지원 (Development Build 필요)

#### 🔗 딥링크 (Deep Linking)
- 커뮤니티 초대 링크: `hulifeexpoapp://community/[id]`
- 갤러리 작품 공유: `hulifeexpoapp://gallery/[id]`
- 게시글 공유: `hulifeexpoapp://post/[id]`
- 앱이 닫힌 상태에서도 특정 화면으로 직접 이동

#### 📴 오프라인 모드
- **캐싱 전략**:
  - Cache-First: 취미 목록 (자주 변경되지 않는 데이터)
  - Network-First: 채팅, 댓글 (실시간성 중요)
  - Stale-While-Revalidate: 커뮤니티 목록
- AsyncStorage + NetInfo 기반
- 오프라인 인디케이터 (네트워크 상태 표시)

---

## 🛠️ 기술 스택

### 웹 (Next.js)
```
- Framework: Next.js 14 (App Router)
- Language: TypeScript
- UI: Tailwind CSS, shadcn/ui
- Database: Drizzle ORM + Turso (SQLite)
- Auth: iron-session (세션 기반)
- Realtime: Socket.IO (WebSocket)
- Theme: next-themes (다크모드)
```

### 모바일 (Expo)
```
- Framework: Expo SDK 54
- Language: JavaScript (TypeScript 호환)
- Navigation: Expo Router (file-based)
- Video: expo-video
- Image Picker: expo-image-picker
- Storage: expo-secure-store, AsyncStorage
- HTTP: Axios with interceptors
- Realtime: socket.io-client
- Push: expo-notifications
- Network: @react-native-community/netinfo
```

---

## 📂 프로젝트 구조

```
HuLife_App/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # 인증
│   │   ├── hobbies/              # 취미
│   │   ├── communities/          # 커뮤니티
│   │   ├── posts/                # 게시판
│   │   ├── gallery/              # 갤러리
│   │   ├── chat/                 # 채팅
│   │   ├── user/                 # 사용자
│   │   ├── survey/               # 설문
│   │   └── recommendations/      # 추천
│   └── [pages]/                  # 웹 페이지
│
├── lib/                          # 라이브러리
│   ├── db/
│   │   └── schema.ts             # DB 스키마 (13개 테이블)
│   ├── auth/
│   │   └── session.ts            # 세션 관리
│   └── recommendation/
│       ├── engine.ts             # Content-based
│       └── knn-engine.ts         # KNN 협업 필터링
│
├── mobile/                       # 📱 Expo 모바일 앱
│   ├── app/                      # 화면 (22개)
│   │   ├── index.js              # 메인
│   │   ├── login.js              # 로그인
│   │   ├── hobbies/              # 취미
│   │   ├── community/            # 커뮤니티
│   │   ├── gallery/              # 갤러리
│   │   ├── dashboard.js          # 대시보드
│   │   └── my-page.js            # 마이페이지
│   │
│   ├── api/                      # API 서비스
│   │   ├── apiClient.js          # Axios 인스턴스
│   │   ├── cacheService.js       # 캐싱
│   │   ├── notificationService.js # Push 알림
│   │   └── socketService.js      # Socket.IO
│   │
│   ├── components/               # 재사용 컴포넌트
│   │   ├── Logo.js
│   │   ├── OfflineIndicator.js
│   │   └── UploadGalleryModal.js
│   │
│   └── babel.config.js           # Babel 설정 (프로덕션 최적화)
│
├── server.js                     # Socket.IO 서버
├── next.config.mjs               # Next.js 설정
├── .env.example                  # 환경 변수 템플릿
├── DEPLOYMENT.md                 # 📘 배포 가이드 (필독!)
└── README.md                     # 이 파일
```

---

## 🗄️ 데이터베이스 스키마

### 주요 테이블 (13개)

| 테이블 | 설명 | 비정규화 |
|-------|------|----------|
| **users** | 사용자 정보 | - |
| **hobbies** | 취미 (123개) | - |
| **communities** | 모임/커뮤니티 | ✅ hobbyName |
| **communityMembers** | 모임 멤버 | - |
| **joinRequests** | 가입 신청 | - |
| **chatRooms** | 채팅방 | - |
| **chatMessages** | 채팅 메시지 | ✅ userName, userImage |
| **posts** | 게시글 | - |
| **comments** | 댓글 | - |
| **userHobbies** | 사용자-취미 | ✅ hobbyName, hobbyCategory |
| **schedules** | 일정 | - |
| **galleryItems** | 갤러리 작품 | - |
| **galleryComments** | 갤러리 댓글 | ✅ userName, userImage |

### 비정규화 전략

성능 최적화를 위해 자주 조회되는 데이터는 중복 저장:
- `communities.hobbyName`: JOIN 없이 취미 이름 표시 → 이미지 로드 속도 향상
- `userHobbies.hobbyName`: 마이페이지 빠른 로드
- `chatMessages.userName`, `userImage`: 사용자 정보 변경과 무관하게 메시지 유지

---

## 🔧 환경 설정

### 1. 백엔드 환경 변수 (.env)

`.env.example` 파일을 `.env`로 복사한 후 실제 값으로 수정:

```bash
cp .env.example .env
```

**필수 항목**:
- `DATABASE_URL` - Turso SQLite 데이터베이스 URL
- `SESSION_SECRET` - 32자 이상의 랜덤 문자열

**선택 항목** (OAuth):
- `KAKAO_CLIENT_ID`, `KAKAO_CLIENT_SECRET`
- `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

### 2. 모바일 환경 변수 (mobile/.env)

`mobile/.env.example` 파일을 `mobile/.env`로 복사한 후 IP 주소 수정:

```bash
cd mobile
cp .env.example .env
```

**필수 수정**:
```env
API_URL=http://192.168.0.40:3000  # 현재 PC의 IPv4 주소로 변경
```

IP 확인 방법:
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

---

## 🚀 배포

**상세한 배포 가이드는 [DEPLOYMENT.md](DEPLOYMENT.md)를 참고하세요.**

### 백엔드 배포 (Node.js 서버)

```bash
# PM2로 프로세스 관리
npm install -g pm2
pm2 start server.js --name "hulife-socket"
pm2 startup
pm2 save
```

**Nginx 리버스 프록시 설정 예시**:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }

    # WebSocket 지원
    location /api/socketio {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
    }
}
```

### 모바일 앱 배포 (EAS Build)

```bash
cd mobile

# EAS CLI 설치
npm install -g eas-cli
eas login

# 빌드 설정
eas build:configure

# Android APK (테스트용)
eas build --platform android --profile preview

# 프로덕션 빌드
eas build --platform android --profile production
eas build --platform ios --profile production

# 스토어 제출
eas submit --platform android
eas submit --platform ios
```

---

## 🚨 트러블슈팅

### 웹 앱

#### 1. 빌드 캐시 손상 (Module Not Found)
```bash
# 증상: "Cannot find module '../webpack-runtime.js'"
# 해결: 캐시 완전 삭제 후 재시작
rm -rf .next
rm -rf node_modules/.cache
npm run dev:socket
```

#### 2. MySQL2 번들링 실패
```bash
# 증상: "Cannot find module './vendor-chunks/mysql2.js'"
# 해결: next.config.mjs에 이미 설정됨 (외부 패키지)
# 추가 작업 불필요
```

### 모바일 앱

#### 1. Network Error (API 실패)
```bash
# 원인: IP 주소 불일치 또는 서버 미실행
# 해결:
1. ipconfig로 현재 IP 확인
2. mobile/.env에서 API_URL 수정
3. 백엔드 서버 실행 확인 (npm run dev:socket)
```

#### 2. Windows 방화벽 차단
```powershell
# 관리자 권한 PowerShell에서 실행:
New-NetFirewallRule -DisplayName "Next.js Dev Server (Port 3000)" `
  -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

#### 3. Push 알림 오류 (Expo Go)
```bash
# 증상: "Android Push notifications functionality removed from Expo Go with SDK 53"
# 설명: Expo Go에서는 Push 알림이 지원되지 않습니다.
# 해결: Development Build 생성
eas build --profile development --platform android
```

---

## 📊 프로젝트 통계

### 코드
- **웹**: ~50개 파일 (TypeScript)
- **모바일**: ~30개 화면 (JavaScript)
- **총 라인 수**: ~18,000 lines

### 데이터
- **취미**: 123개 (15개 카테고리)
- **DB 테이블**: 13개
- **API 엔드포인트**: ~50개

### 완성도
- **웹**: 100% ✅
- **모바일**: 97% ✅
- **전체**: **98%** ✅

### 프로덕션 준비
- ✅ 환경 변수 템플릿 (.env.example)
- ✅ 배포 가이드 (DEPLOYMENT.md)
- ✅ 프로덕션 빌드 최적화 (console.log 제거)
- ✅ 보안 취약점 해결 (npm audit fix)
- ✅ 불필요한 파일 정리 완료

---

## 💡 빠른 참고

### 자주 사용하는 명령어

```bash
# Socket.IO 서버 실행 (권장)
npm run dev:socket

# 일반 Next.js 서버 실행
npm run dev

# 모바일 앱 실행
cd mobile && npx expo start

# 현재 IP 확인 (Windows)
ipconfig

# 방화벽 규칙 추가 (관리자 PowerShell)
New-NetFirewallRule -DisplayName "Next.js Dev Server" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow

# 프로덕션 빌드 테스트
cd mobile && npx expo start --no-dev --minify
```

### 핵심 파일 위치

```
웹:
- 메인: app/page.tsx
- API: app/api/*/route.ts
- 스키마: lib/db/schema.ts
- 추천: lib/recommendation/engine.ts
- Socket.IO: server.js

모바일:
- 메인: mobile/app/index.js
- 갤러리: mobile/app/gallery/[id].js
- API 클라이언트: mobile/api/apiClient.js
- 캐싱: mobile/api/cacheService.js
- Socket.IO: mobile/api/socketService.js
- 환경 변수: mobile/.env
```

---

## 🎉 주요 성과

- ✅ **완전한 웹/모바일 동기화**: 98% 기능 일치
- ✅ **Instagram Reels 스타일 갤러리**: 비디오 지원
- ✅ **WebSocket 실시간 채팅**: Socket.IO 기반
- ✅ **AI 추천 시스템**: 하이브리드 알고리즘 (Content-based + KNN)
- ✅ **OAuth 소셜 로그인**: 3개 제공자 지원
- ✅ **오프라인 모드**: 캐싱으로 네트워크 없이도 사용 가능
- ✅ **Push 알림**: Expo Notifications 통합
- ✅ **딥링크**: 커뮤니티/갤러리 공유 링크
- ✅ **프로덕션 준비 완료**: 배포 가능한 상태

---

## 🎬 시연 영상

[![HuLife 앱 시연 영상](https://img.youtube.com/vi/lC-TkHRQ6R0/0.jpg)](https://youtu.be/lC-TkHRQ6R0)

👉 클릭 시 YouTube에서 전체 시연 영상을 확인할 수 있습니다.

---

## 📄 라이선스

This project is licensed under the MIT License.

---

## 📞 문의

프로젝트 관련 문의: [GitHub Issues](https://github.com/yourusername/HuLife-App/issues)

---

## 💡 빠른 참고

### 자주 사용하는 명령어

```bash
# 웹 서버 실행 (0.0.0.0:3000)
npm run dev:socket

# 모바일 앱 실행
cd mobile && npx expo start --clear

# DB 시드 (초기 데이터)
npm run seed

# DB 스키마 푸시
npx drizzle-kit push

# 현재 IP 확인 (Windows)
ipconfig

# 방화벽 규칙 추가 (관리자 PowerShell)
New-NetFirewallRule -DisplayName "Next.js Dev Server" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

### 핵심 파일 위치

```
웹:
- 메인: app/page.tsx
- API: app/api/*/route.ts
- 스키마: lib/db/schema.ts
- 추천: lib/recommendation/engine.ts

모바일:
- 메인: mobile/app/index.js
- 갤러리: mobile/app/gallery/[id].js
- API 설정: mobile/config/api.config.js
- API 클라이언트: mobile/api/apiClient.js
```

**마지막 업데이트**: 2025-11-24
**현재 상태**: ✅ **프로덕션 준비 완료 (Production Ready)**
**문서 버전**: 13.0

---

## 📚 추가 문서

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - 상세한 배포 가이드 (필독!)
- **[claude.md](claude.md)** - 전체 개발 로그 및 기술 문서
