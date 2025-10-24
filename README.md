# HuLife - 은퇴자를 위한 취미 추천 및 커뮤니티 플랫폼

## 🌟 프로젝트 개요

'HuLife-App'은 은퇴 후 새로운 삶을 시작하는 분들을 위한 서비스입니다. 비슷한 관심사를 가진 사람들과 교류하고, 즐거운 취미 생활을 통해 활기찬 노후를 보낼 수 있도록 돕는 것을 목표로 합니다. 사용자 맞춤형 취미 추천, 커뮤니티 기능, 일정 관리 등 다양한 기능을 통해 풍요로운 여가 생활을 제안합니다.

---

## 📊 현재 작업 진행 상황 (2025-10-24 기준)

### ✅ 최근 완료된 주요 기능 및 수정사항

1.  **대용량 프로필 이미지 업로드 (Web & Mobile)**
    *   **문제 해결**: 기존 `TEXT` 타입(65KB)의 DB 용량 한계로 프로필 이미지 업로드에 실패하던 문제를 `LONGTEXT`(최대 4GB) 타입으로 변경하여 해결했습니다.
    *   **구현 방식**: 모바일 앱에서 이미지를 Base64로 인코딩하여 서버에 전송하고, 서버는 이를 그대로 DB에 저장합니다.
    *   **사용자 경험**: 이제 화질 저하 없이 고용량의 프로필 사진을 업로드하고 모든 관련 화면(마이페이지, 댓글, 게시글 등)에서 확인할 수 있습니다.

2.  **게시판 다중 이미지 업로드 기능 (Mobile)**
    *   **기능 추가**: 게시글 작성 시 최대 5장의 이미지를 선택하여 업로드할 수 있는 기능을 모바일 앱에 추가했습니다.
    *   **UI/UX**: 이미지 선택기, 선택한 이미지 미리보기 및 삭제 기능을 구현했습니다.
    *   **기술**: `expo-image-picker`를 사용하여 다중 이미지를 선택하고, 각 이미지를 Base64로 변환하여 API에 전송합니다.

3.  **로그인 및 인증 시스템 안정화**
    *   **무한 로딩 해결**: 모바일 앱에서 로그인 시 발생하던 무한 로딩 문제를 API 서비스 파일의 URL에 포트 번호(`:3000`)를 명시하여 해결했습니다.
    *   **서버 오류 수정**: `next-auth` 의존성 문제로 발생하던 500 에러를 커스텀 세션 관리 로직(`lib/auth/session`)으로 교체하여 해결했습니다.

4.  **모바일 앱 사용성 개선**
    *   **로그인 화면 스크롤**: 로그인 페이지에서 키보드가 활성화되었을 때도 화면을 스크롤할 수 있도록 `ScrollView`를 적용하여 입력 편의성을 높였습니다.
    *   **프로필 이미지 표시**: 마이페이지에서 프로필 이미지가 정상적으로 표시되지 않던 버그를 수정했습니다. (`user.imageUrl` -> `user.profileImage`)

### 🛠️ 현재 기술 스택

*   **Web**: Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui
*   **Mobile**: React Native, Expo SDK 54
*   **Backend**: Next.js API Routes
*   **Database**: **MySQL** with **Drizzle ORM**
*   **Authentication**: **커스텀 세션 관리** (Bearer Token 방식)
*   **Image Handling**: **Base64 Encoding** + **LONGTEXT** DB 저장

---

## 🔮 향후 진행 예정 사항

### 1. 최우선 과제 (Immediate Next Steps)

*   **[Backend] 게시판 이미지 저장 로직 구현**
    *   모바일에서 전송된 Base64 이미지 배열을 `posts` 테이블의 `images` 컬럼(LONGTEXT)에 JSON 형태로 저장하는 API를 구현합니다.
*   **[Web/Mobile] 게시글 이미지 표시 기능**
    *   게시글 상세 페이지에서 저장된 이미지들을 불러와 화면에 표시합니다.
*   **[Web/Mobile] 프로필 이미지 통합 표시**
    *   현재 마이페이지에만 적용된 프로필 이미지를 **댓글, 리뷰, 게시글 작성자 정보** 등 모든 영역에 일관되게 표시합니다.

### 2. 주요 기능 개발 (Upcoming Features)

*   **[Mobile] 마이페이지 캘린더 기능 추가**
    *   웹 버전과 동일하게, 모바일 마이페이지의 일정 관리 섹션에 `react-native-calendars`와 같은 라이브러리를 사용하여 캘린더 UI를 추가하고, 사용자가 자신의 일정을 시각적으로 관리할 수 있도록 합니다.
*   **[Web/Mobile] 커뮤니티 실시간 채팅 기능**
    *   `Socket.IO` 또는 `ws` 라이브러리를 사용하여 커뮤니티 멤버 간의 실시간 채팅 기능을 구현합니다.

### 3. 개선 및 고도화 (Refinements)

*   **추천 알고리즘 고도화**: 사용자 설문 데이터와 활동 로그를 기반으로 더 정교한 취미 추천 모델을 개발합니다.
*   **성능 최적화**: 이미지 로딩 최적화(Lazy Loading, 캐싱) 및 API 응답 속도 개선을 진행합니다.
*   **코드 리팩토링**: 웹/모바일 간 중복되는 로직을 공통 유틸리티로 분리하여 유지보수성을 높입니다.

---

## 🚀 빠른 시작

### 웹 앱 실행

```bash
# 1. 종속성 설치
pnpm install

# 2. 개발 서버 실행
pnpm dev
# → http://localhost:3001 에서 실행
```

### 모바일 앱 실행 (Expo)

```bash
# 1. mobile 폴더로 이동
cd mobile

# 2. 종속성 설치
npm install

# 3. Expo 개발 서버 실행
npx expo start

# 4. 실행 방법 선택 (스마트폰과 PC가 동일한 Wi-Fi에 연결되어야 함)
# - 스마트폰: Expo Go 앱으로 QR 코드 스캔
# - Android: 'a' 키 눌러 에뮬레이터 실행
# - iOS: 'i' 키 눌러 시뮬레이터 실행 (Mac만)
```

---

## 🔑 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 아래 내용 추가:

```env
# OAuth Providers
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NAVER_CLIENT_ID=...
NAVER_CLIENT_SECRET=...
KAKAO_CLIENT_ID=...
KAKAO_CLIENT_SECRET=...

# Custom Auth Secret
AUTH_SECRET=... # openssl rand -hex 32 명령어로 생성

# Database (MySQL)
DB_HOST=...
DB_USER=...
DB_PASSWORD=...
DB_NAME=...
DB_PORT=...

# Next.js Server
NEXT_PUBLIC_API_URL=http://localhost:3000
```