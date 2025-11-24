# HuLife - 은퇴자를 위한 취미 추천 및 커뮤니티 플랫폼

## 🌟 프로젝트 개요

**HuLife**는 은퇴 후 새로운 삶을 시작하는 분들을 위한 종합 취미 생활 플랫폼입니다. AI 기반 맞춤형 취미 추천, 커뮤니티 모임, 실시간 채팅, Instagram Reels 스타일 갤러리 등 다양한 기능을 통해 활기찬 노후 생활을 지원합니다.

### 핵심 가치
- 🎯 **AI 기반 개인화**: 설문 분석을 통한 맞춤형 취미 추천
- 👥 **커뮤니티**: 같은 관심사를 가진 사람들과의 소통
- 📸 **작품 공유**: Instagram Reels 스타일의 갤러리
- 💬 **실시간 소통**: 모임별 채팅 및 게시판

---

## 📱 프로젝트 구성

### 🌐 웹 애플리케이션 (Next.js 14)
- **기술**: Next.js 14, React 18, TypeScript
- **포트**: `http://localhost:3000`
- **특징**: SSR, API Routes, OAuth 인증

### 📱 모바일 애플리케이션 (Expo SDK 54)
- **경로**: `/mobile`
- **기술**: Expo, React Native, TypeScript
- **특징**: QR 코드 즉시 실행, 웹과 100% 동일한 UI

---

## 🚀 빠른 시작

### 필수 요구사항
- Node.js 18+
- npm 또는 pnpm
- Expo Go 앱 (모바일 테스트 시)

### 웹 앱 실행

```bash
# 1. 종속성 설치
npm install

# 2. 개발 서버 실행 (0.0.0.0:3000 - 모바일에서 접근 가능)
npm run dev

# 서버 주소:
# - 로컬: http://localhost:3000
# - 네트워크: http://[현재_IP]:3000
```

### 모바일 앱 실행

```bash
# 1. mobile 폴더로 이동
cd mobile

# 2. 종속성 설치
npm install

# 3. Expo 개발 서버 실행
npx expo start

# 4. 실행 방법 선택
# - 📱 스마트폰: Expo Go 앱으로 QR 코드 스캔
# - 🤖 Android: 'a' 키 눌러 에뮬레이터 실행
# - 🍎 iOS: 'i' 키 눌러 시뮬레이터 실행 (Mac만)
```

### ⚠️ 중요: IP 주소 설정

모바일 앱이 서버에 접근하려면 현재 PC의 IP 주소를 확인하고 설정해야 합니다:

```bash
# 1. 현재 IP 확인 (Windows)
ipconfig

# 2. mobile/config/api.config.js 파일 수정
# BASE_IP를 현재 IPv4 주소로 변경
```

---

## 🎯 주요 기능

### ✅ 완전 구현된 기능

#### 🔐 인증 시스템
- 이메일/비밀번호 로그인 및 회원가입
- OAuth 소셜 로그인 (카카오, 네이버, 구글)
- JWT 토큰 기반 세션 관리
- 프로필 이미지 업로드 (Base64)

#### 🎨 취미 관리
- 123개 이상의 취미 데이터베이스
- 15개 카테고리 분류
- 상세한 취미 정보 (설명, 혜택, 준비물, 커리큘럼)
- 검색 및 다중 필터링 (카테고리, 난이도, 실내/외, 예산)
- 관심 취미 추가/제거
- 취미 리뷰 작성/수정/삭제

#### 📝 설문 및 추천
- 8개 질문 성향 분석 설문
- 하이브리드 추천 알고리즘:
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
- 모임별 독립 채팅방
- 3초 폴링 방식 실시간 업데이트
- 본인/타인 메시지 구분
- 날짜 구분선 (카카오톡 스타일)
- 멤버 전용 접근 제어

#### 📰 게시판 시스템
- 게시글 작성/수정/삭제
- 카테고리별 필터 (자유게시판, 질문/답변, 정보공유)
- 댓글 작성/수정/삭제 (인라인 편집)
- 좋아요, 조회수 추적
- 이미지 첨부 (Base64)

#### 📸 갤러리 (Instagram Reels 스타일)
- 🎬 **비디오 & 이미지 업로드**
- 📱 **세로 풀스크린 UI** (contentFit: "cover")
- ❤️ **더블탭 좋아요**
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

#### 📊 대시보드
- 실시간 통계 (관심 취미, 참여 모임, 일정, 완료 취미)
- AI 추천 취미 목록 (매칭도 표시)
- 다가오는 일정
- 갤러리 최신 작품 (2x2 그리드)

#### 👤 마이페이지
- 프로필 정보 수정
- 관심 취미 목록 (2-column 그리드)
- 참여 모임 목록 (2-column 그리드)
- 일정 캘린더

---

## 🛠️ 기술 스택

### 웹 (Next.js)
```
- Framework: Next.js 14 (App Router)
- Language: TypeScript
- UI: Tailwind CSS, shadcn/ui
- Database: Drizzle ORM + Turso (SQLite)
- Auth: iron-session (세션 기반)
- API: Next.js API Routes
- Theme: next-themes (다크모드)
```

### 모바일 (Expo)
```
- Framework: Expo SDK 54
- Language: TypeScript
- Navigation: Expo Router (file-based)
- Video: expo-video
- Image Picker: expo-image-picker
- Storage: expo-secure-store, AsyncStorage
- HTTP: Axios with interceptors
- UI: React Native (Native components)
```

---

## 📂 프로젝트 구조

```
HuLife_App/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # 인증 (로그인, 회원가입, OAuth)
│   │   ├── hobbies/              # 취미 관련
│   │   ├── communities/          # 커뮤니티/모임
│   │   ├── posts/                # 게시판
│   │   ├── gallery/              # 갤러리
│   │   ├── chat/                 # 채팅
│   │   ├── user/                 # 사용자 (관심 취미, 일정)
│   │   ├── survey/               # 설문
│   │   └── recommendations/      # 추천
│   ├── (auth)/                   # 인증 페이지
│   ├── hobbies/                  # 취미 탐색
│   ├── communities/              # 커뮤니티
│   ├── about/                    # 정보 페이지
│   └── my-page/                  # 마이페이지
│
├── components/                   # React 컴포넌트
│   ├── ui/                       # shadcn/ui
│   └── [feature-components].tsx
│
├── lib/                         # 라이브러리 & 유틸리티
│   ├── db/
│   │   ├── schema.ts            # DB 스키마 (11개 테이블)
│   │   └── index.ts             # Drizzle 설정
│   ├── auth/
│   │   └── session.ts           # 세션 관리
│   └── recommendation/
│       ├── engine.ts            # Content-based 추천
│       └── knn-engine.ts        # KNN 협업 필터링
│
├── scripts/                     # DB 관리 스크립트
│   ├── create-gallery-tables.ts
│   ├── create-gallery-comments-table.ts
│   └── add-hobby-name-to-communities.ts
│
├── public/                      # 정적 파일
│   └── images/hobbies/          # 취미 이미지 (123개)
│
├── mobile/                      # 📱 Expo 모바일 앱
│   ├── app/                     # Expo Router 화면
│   │   ├── _layout.js           # 네비게이션 설정
│   │   ├── index.js             # 메인 (Home)
│   │   ├── login.js             # 로그인
│   │   ├── register.js          # 회원가입
│   │   ├── hobbies/
│   │   │   ├── index.js         # 취미 목록
│   │   │   └── [id].js          # 취미 상세
│   │   ├── community/
│   │   │   ├── index.js         # 커뮤니티 목록
│   │   │   ├── [id].js          # 커뮤니티 상세
│   │   │   ├── create.js        # 모임 생성
│   │   │   ├── chat/[id].js     # 채팅방
│   │   │   └── posts/
│   │   │       ├── index.js     # 게시글 목록
│   │   │       ├── [id].js      # 게시글 상세
│   │   │       └── create.js    # 게시글 작성
│   │   ├── gallery/
│   │   │   ├── index.js         # 갤러리 목록 (2-column)
│   │   │   └── [id].js          # 릴스 뷰 (세로 풀스크린)
│   │   ├── survey.js            # 설문
│   │   ├── recommendations.js   # 추천 결과
│   │   ├── dashboard.js         # 대시보드
│   │   └── my-page.js           # 마이페이지
│   │
│   ├── api/                     # API 서비스 레이어
│   │   ├── apiClient.js         # Axios 인스턴스 + 인터셉터
│   │   ├── galleryService.js    # 갤러리 API
│   │   └── ...                  # 기타 서비스
│   │
│   ├── components/              # 재사용 컴포넌트
│   │   ├── Logo.js
│   │   ├── UploadGalleryModal.js
│   │   └── AddScheduleModal.js
│   │
│   ├── config/
│   │   └── api.config.js        # API Base URL 설정
│   │
│   ├── assets/
│   │   ├── hobbies/             # 로컬 취미 이미지
│   │   └── hobbyImages.js       # 이미지 매핑
│   │
│   └── app.json                 # Expo 설정
│
├── next.config.mjs              # Next.js 설정
├── drizzle.config.ts            # Drizzle 설정
├── package.json                 # 웹 의존성
├── claude.md                    # 개발 로그 (상세)
└── README.md                    # 이 파일
```

---

## 🗄️ 데이터베이스 스키마

### 주요 테이블 (13개)

| 테이블 | 설명 | 주요 컬럼 |
|-------|------|----------|
| **users** | 사용자 정보 | email, password, name, age, location, profileImage |
| **hobbies** | 취미 (123개) | name, category, difficulty, indoorOutdoor, budget, imageUrl, videoUrl |
| **communities** | 모임/커뮤니티 | name, hobbyId, **hobbyName** (비정규화), leaderId, memberCount, maxMembers |
| **communityMembers** | 모임 멤버 | communityId, userId, role (leader/member) |
| **joinRequests** | 가입 신청 | communityId, userId, status (pending/approved/rejected) |
| **chatRooms** | 채팅방 | communityId (1:1 관계) |
| **chatMessages** | 채팅 메시지 | chatRoomId, userId, userName, message, createdAt |
| **posts** | 게시글 | userId, title, content, category, likes, comments, views |
| **comments** | 댓글 | postId, userId, content |
| **userHobbies** | 사용자-취미 | userId, hobbyId, **hobbyName** (비정규화), status, progress |
| **schedules** | 일정 | userId, hobbyId, title, date, time, type |
| **galleryItems** | 갤러리 작품 | userId, hobbyId, title, **image** (Base64 LONGTEXT), videoUrl, likes, views |
| **galleryComments** | 갤러리 댓글 | galleryItemId, userId, userName, content |

### 비정규화 전략

성능 최적화를 위해 자주 조회되는 데이터는 중복 저장:
- `communities.hobbyName`: JOIN 없이 취미 이름 표시
- `userHobbies.hobbyName`: 마이페이지 빠른 로드
- `chatMessages.userName`, `userImage`: 사용자 정보 변경과 무관하게 메시지 유지

---

## 🎨 UI/UX 디자인 시스템

### 브랜드 컬러
```css
Primary:    #FF7A5C  /* 주황색 - 브랜드 컬러 */
Background: #FFF5F2  /* 연한 오렌지 */
Success:    #10B981  /* 초록 */
Kakao:      #FEE500  /* 노랑 */
Naver:      #03C75A  /* 초록 */
```

### 디자인 원칙
1. **웹/모바일 일관성**: 동일한 UI 패턴 사용
2. **네이티브 우선**: 플랫폼별 최적화 (iOS/Android)
3. **접근성**: 시니어 친화적 큰 폰트, 명확한 아이콘

---

## 🔧 환경 설정

### 1. 환경 변수 (.env)

```env
# Database (Turso SQLite)
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-auth-token

# Session Secret (iron-session)
SESSION_SECRET=your-secret-key-at-least-32-characters

# OAuth (선택)
KAKAO_CLIENT_ID=your-kakao-client-id
KAKAO_CLIENT_SECRET=your-kakao-secret
NAVER_CLIENT_ID=your-naver-client-id
NAVER_CLIENT_SECRET=your-naver-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-secret
```

### 2. Next.js 설정 (next.config.mjs)

MySQL2와 같은 네이티브 모듈은 번들링에서 제외:

```javascript
export default {
  experimental: {
    serverComponentsExternalPackages: ['mysql2', '@libsql/client'],
  },
}
```

### 3. 모바일 API 설정 (mobile/config/api.config.js)

```javascript
// ⚠️ Wi-Fi 재연결 시 IP 확인 필요 (ipconfig)
const BASE_IP = '10.20.35.101'; // 현재 PC의 IPv4 주소
const BASE_PORT = 3000;

export const API_CONFIG = {
  API_URL: `http://${BASE_IP}:${BASE_PORT}/api`,
  // ...
};
```

---

## 🚨 트러블슈팅

### 웹 앱

#### 1. 빌드 캐시 손상 (Module Not Found)
```bash
# 증상: webpack-runtime.js, vendor-chunks 오류
# 해결: 캐시 완전 삭제 후 재시작
rm -rf .next
rm -rf node_modules/.cache
npm run dev
```

#### 2. MySQL2 번들링 실패
```bash
# 증상: Cannot find module './vendor-chunks/mysql2.js'
# 해결: next.config.mjs에 외부 패키지 설정 추가됨 (이미 적용)
experimental: {
  serverComponentsExternalPackages: ['mysql2', '@libsql/client'],
}
```

### 모바일 앱

#### 1. Network Error (로그인/API 실패)
```bash
# 원인: IP 주소 불일치
# 해결:
ipconfig  # 현재 IP 확인 (예: 10.20.35.101)
# mobile/config/api.config.js에서 BASE_IP 수정
```

#### 2. Windows 방화벽 차단
```powershell
# 관리자 권한 PowerShell에서 실행:
New-NetFirewallRule -DisplayName "Next.js Dev Server (Port 3000)" `
  -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

또는 GUI:
1. Windows 보안 → 방화벽 → 고급 설정
2. 인바운드 규칙 → 새 규칙
3. 포트 → TCP 3000 → 연결 허용

#### 3. Base64 이미지 업로드 오류
```bash
# 증상: TypeError: Cannot read property 'Base64' of undefined
# 원인: expo-file-system 패키지 누락
# 해결: expo-image-picker의 내장 base64 옵션 사용 (이미 적용)
{
  base64: true,  // result.assets[0].base64 사용
}
```

#### 4. 커뮤니티 이미지 안 보임
```bash
# 원인: hobbyName 비정규화 필요
# 해결: DB에 hobbyName 컬럼 추가 (이미 적용)
# communities 테이블에 hobby_name VARCHAR(255) 추가
```

---

## 📱 모바일 앱 개발 가이드

### 화면 추가 방법 (Expo Router)

```bash
# 1. mobile/app/ 폴더에 파일 생성
mobile/app/new-screen.js

# 2. 자동으로 라우트 생성됨
# 접근: navigation.navigate('new-screen')
```

### API 호출 패턴

```javascript
// mobile/api/yourService.js
import api from './apiClient';

export const yourService = {
  async getData() {
    const response = await api.get('/endpoint');
    return response.data;
  },

  async postData(data) {
    const response = await api.post('/endpoint', data);
    return response.data;
  }
};
```

### 인증 토큰 관리

```javascript
import * as SecureStore from 'expo-secure-store';

// 토큰 저장
await SecureStore.setItemAsync('userToken', token);

// 토큰 조회 (apiClient.js에서 자동 처리)
const token = await SecureStore.getItemAsync('userToken');
```

---

## 🎯 최신 구현 사항 (2025-11-19)

### ✅ 서버 안정성 개선
- **빌드 캐시 손상 문제 해결**: `.next` 폴더 관리 전략 수립
- **MySQL2 네이티브 모듈 지원**: `next.config.mjs` 외부 패키지 설정
- **Windows 방화벽 설정**: 포트 3000 인바운드 규칙 추가

### ✅ 갤러리 시스템 (Instagram Reels 스타일)
- **세로 풀스크린 UI**: contentFit="cover"로 전체 화면 활용
- **비디오 지원**: expo-video로 자동 재생/일시정지
- **더블탭 좋아요**: TikTok 스타일 인터랙션
- **댓글 통합**: 하단 ScrollView + KeyboardAvoidingView
- **날짜 구분선**: 카카오톡 스타일 날짜 표시

### ✅ 모바일 UX 개선
- **키보드 대응**: KeyboardAvoidingView + ScrollView 패턴 적용
- **2-column 그리드**: 마이페이지 관심 취미/참여 모임
- **Pull-to-Refresh**: 모든 리스트 화면에 적용
- **Empty State**: 명확한 안내 메시지 + CTA 버튼

### ✅ 비정규화 전략
- **communities.hobbyName**: JOIN 없이 빠른 이미지 로드
- **userHobbies.hobbyName**: 마이페이지 성능 향상
- **chatMessages.userName**: 사용자명 변경과 무관한 메시지 이력

---

## 🔮 향후 개선 계획

### 웹 앱
- [ ] 프로덕션 배포 (Vercel)
- [ ] 이미지 최적화 (Cloudinary/S3)
- [ ] SEO 최적화
- [ ] 관리자 대시보드

### 모바일 앱
- [ ] Push 알림 (Expo Notifications)
- [ ] 오프라인 모드 (캐싱)
- [ ] 앱스토어 배포 (EAS Build)
- [ ] 딥링크 (커뮤니티 초대 링크)

### 공통
- [ ] WebSocket 실시간 채팅 (폴링 → Socket.IO)
- [ ] 이미지 압축 및 CDN
- [ ] 성능 모니터링
- [ ] 단위 테스트

---

## 📊 프로젝트 통계

### 코드
- **웹**: ~50개 파일 (TypeScript)
- **모바일**: ~30개 화면 (JavaScript)
- **총 라인 수**: ~15,000 lines

### 데이터
- **취미**: 123개 (15개 카테고리)
- **DB 테이블**: 13개
- **API 엔드포인트**: ~40개

### 완성도
- **웹**: 100% ✅
- **모바일**: 95% ✅
- **전체**: 97% ✅

---

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

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
npm run dev

# 모바일 앱 실행
cd mobile && npx expo start

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

---

**마지막 업데이트**: 2025-11-19
**현재 상태**: ✅ 프로덕션 준비 완료
**IP 주소**: `10.20.35.101:3000` (Wi-Fi: SunMoon-WiFi6)
**문서 버전**: 8.0

---

## 🎉 주요 성과

- ✅ **완전한 웹/모바일 동기화**: 동일한 UI/UX
- ✅ **Instagram Reels 스타일 갤러리**: 비디오 지원
- ✅ **실시간 채팅**: 모임별 독립 채팅방
- ✅ **AI 추천 시스템**: 하이브리드 알고리즘
- ✅ **OAuth 소셜 로그인**: 3개 제공자 지원
- ✅ **서버 안정성**: 모든 주요 오류 해결
- ✅ **프로덕션 준비**: 배포 가능한 상태
