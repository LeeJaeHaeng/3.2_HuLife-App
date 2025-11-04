# HuLife - 은퇴자를 위한 취미 추천 및 커뮤니티 플랫폼

## 🌟 프로젝트 개요

'HuLife-App'은 은퇴 후 새로운 삶을 시작하는 분들을 위한 서비스입니다. 비슷한 관심사를 가진 사람들과 교류하고, 즐거운 취미 생활을 통해 활기찬 노후를 보낼 수 있도록 돕는 것을 목표로 합니다. 사용자 맞춤형 취미 추천, 커뮤니티 기능, 일정 관리 등 다양한 기능을 통해 풍요로운 여가 생활을 제안합니다.

---

## 📱 프로젝트 구조

이 프로젝트는 **웹 앱**과 **모바일 앱** 두 가지로 구성되어 있습니다:

### 1. **웹 애플리케이션** (Next.js)
- 경로: 프로젝트 루트
- 기술: Next.js 14, React 18, TypeScript
- 포트: http://localhost:3001

### 2. **모바일 애플리케이션** (Expo)
- 경로: `/mobile` 폴더
- 기술: Expo, React Native, TypeScript
- 실행: `cd mobile && npx expo start`

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

# 2. Expo 개발 서버 실행
npx expo start

# 3. 실행 방법 선택
# - 스마트폰: Expo Go 앱으로 QR 코드 스캔
# - Android: 'a' 키 눌러 에뮬레이터 실행
# - iOS: 'i' 키 눌러 시뮬레이터 실행 (Mac만)
# - 웹: 'w' 키 눌러 브라우저 실행
```

---

## 🎯 주요 기능

### 공통 기능 (웹 & 모바일)
- ✅ **맞춤형 취미 추천**: 간단한 설문조사로 성향에 맞는 취미 추천
- ✅ **취미 정보 탐색**: 123개 이상의 취미 카테고리별 탐색
- ✅ **커뮤니티**: 관심사 기반 모임 참여 및 소통
- ✅ **소셜 로그인**: 카카오, 네이버, 구글 OAuth 연동
- ✅ **마이페이지**: 프로필 관리 및 활동 내역 확인

### 웹 전용 기능
- 🌓 다크 모드 지원
- 📄 About, FAQ, Contact 페이지
- 🎨 shadcn/ui 기반 컴포넌트

---

## 🛠️ 기술 스택

### 웹 (Next.js)
- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: Drizzle ORM + Turso (SQLite)
- **Styling**: Tailwind CSS, shadcn/ui
- **Authentication**: NextAuth.js (OAuth)
- **Theme**: next-themes (다크 모드)

### 모바일 (Expo)
- **Framework**: Expo SDK 54, React Native
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **State**: AsyncStorage
- **API**: Axios with interceptors
- **Backend**: Next.js API Routes 연동

---

## 📂 프로젝트 구조

```
retiree-hobby-app/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # 인증 페이지
│   │   ├── login/
│   │   └── signup/
│   ├── about/                   # 정보 페이지
│   ├── contact/
│   ├── faq/
│   ├── hobbies/                 # 취미 관련
│   ├── communities/             # 커뮤니티
│   ├── survey/                  # 설문조사
│   └── api/                     # API Routes
│
├── components/                   # React 컴포넌트
│   ├── hero-section.tsx
│   ├── hobby-list.tsx
│   ├── social-login-buttons.tsx
│   └── ui/                      # shadcn/ui 컴포넌트
│
├── lib/                         # 유틸리티
│   ├── db.ts                    # Drizzle 설정
│   ├── schema.ts                # DB 스키마
│   └── actions/                 # Server Actions
│
├── scripts/                     # DB 스크립트
│   ├── seed.ts
│   ├── update-hobby-images.ts
│   └── merge-hobbies.ts
│
├── public/                      # 정적 파일
│   └── [취미 이미지들].png
│
└── mobile/                      # 📱 Expo 모바일 앱
    ├── App.tsx                  # 앱 진입점
    ├── app.json                 # Expo 설정
    ├── src/
    │   ├── navigation/
    │   │   └── AppNavigator.tsx # 네비게이션 설정
    │   ├── screens/             # 10개 화면
    │   │   ├── HomeScreen.tsx
    │   │   ├── LoginScreen.tsx
    │   │   ├── RegisterScreen.tsx
    │   │   ├── HobbyListScreen.tsx
    │   │   ├── HobbyDetailScreen.tsx
    │   │   ├── CommunityListScreen.tsx
    │   │   ├── CommunityDetailScreen.tsx
    │   │   ├── ProfileScreen.tsx
    │   │   ├── SurveyScreen.tsx
    │   │   └── RecommendationsScreen.tsx
    │   ├── services/
    │   │   └── api.ts           # API 클라이언트
    │   └── types/
    │       └── index.ts         # TypeScript 타입
    └── README.md                # 모바일 앱 가이드
```

---

## 🗄️ 데이터베이스 스키마

### 주요 테이블 (11개)
1. **users** - 사용자 정보
2. **hobbies** - 취미 정보 (123개)
3. **communities** - 모임/커뮤니티
4. **user_hobbies** - 사용자-취미 관계
5. **community_members** - 커뮤니티 멤버
6. **posts** - 게시글
7. **comments** - 댓글
8. **messages** - 메시지
9. **events** - 이벤트
10. **survey_responses** - 설문 응답
11. **notifications** - 알림

### 유용한 스크립트
```bash
# DB 시드 (초기 데이터 입력)
pnpm tsx scripts/seed.ts

# 취미 이미지 업데이트
pnpm tsx scripts/update-hobby-images.ts

# 중복 취미 병합 (예: 파크골프 → 게이트볼)
pnpm tsx scripts/merge-hobbies.ts

# DB 스키마 푸시
pnpm drizzle-kit push
```

---

## 🎨 UI/UX 디자인 가이드

### 브랜드 컬러
- **Primary**: `#FF7A5C` (오렌지) - 주요 버튼, 강조
- **Background**: `#FFF5F0` (연한 오렌지) - Hero 섹션
- **Success**: `#10B981` (초록) - 성공 메시지
- **Kakao**: `#FEE500` (노랑) - 카카오 로그인
- **Naver**: `#03C75A` (초록) - 네이버 로그인

### 디자인 원칙
- 웹과 모바일 앱의 UI는 **완전히 동일**하게 유지
- 소셜 로그인 버튼 색상은 **정확히** 브랜드 컬러 사용
- 다크 모드는 웹에서만 지원 (모바일은 라이트 모드만)

---

## 🔑 환경 변수 설정

`.env.local` 파일을 생성하고 아래 내용 추가:

```env
# OAuth Providers
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NAVER_CLIENT_ID=...
NAVER_CLIENT_SECRET=...
KAKAO_CLIENT_ID=...
KAKAO_CLIENT_SECRET=...

# NextAuth
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=... # openssl rand -hex 32

# Database (Turso)
TURSO_DATABASE_URL=...
TURSO_AUTH_TOKEN=...
```

---

## 📱 모바일 앱 상세 가이드

### 네비게이션 구조
- **로그인 불필요**: 메인 페이지부터 시작 (웹과 동일)
- **Stack Navigation**: 화면 간 이동
- 초기 화면: `Home` (웹의 메인 페이지와 동일)

### 화면 플로우
```
HomeScreen (메인)
  ↓ [취미 추천받기]
  SurveyScreen → RecommendationsScreen

  ↓ [둘러보기]
  HobbyListScreen → HobbyDetailScreen

  ↓ [모임 찾기]
  CommunityListScreen → CommunityDetailScreen

  ↓ [로그인]
  LoginScreen (소셜 로그인) → ProfileScreen
```

### API 연동
- **개발 환경**: `http://localhost:3001/api`
- **모바일 설정**: `src/services/api.ts`
- **인증**: JWT 토큰 + AsyncStorage

---

## 🚨 중요한 최근 변경사항

### 2025-10-30 주요 업데이트

#### 1. 키보드 입력 가림 문제 해결 ✅
- **문제**: 모바일 앱에서 댓글 작성, 게시글 작성, 채팅 메시지 등 입력 시 키보드가 입력창을 가려 사용자가 입력 내용을 볼 수 없음
- **시도한 방법**: `react-native-keyboard-aware-scroll-view` 설치
  - React Compiler 오류 발생 → `app.json`에서 `reactCompiler: false` 설정
  - Metro bundler watch mode 오류 → `my-v0-project` 의존성 제거
  - 런타임 에러 발생 → Expo SDK 54와 호환성 문제
- **최종 해결**: Native 솔루션 사용
  - `KeyboardAvoidingView` + `ScrollView` 조합으로 교체
  - 모든 텍스트 입력 화면에 적용:
    - `community/posts/[id].js` (댓글 입력)
    - `community/posts/create.js` (게시글 작성)
    - `community/create.js` (모임 생성)
    - `contact.js` (문의 폼)
  - 자동화 스크립트: `mobile/scripts/fix-keyboard.js`
  - Platform.OS 분기: iOS는 'padding', Android는 'height' behavior

#### 2. 게시글 작성 500 에러 해결 ✅
- **문제**: 게시글 작성 시 `POST /api/posts` 500 에러 발생
- **에러 메시지**: `Incorrect datetime value: '2025-10-30T03:22:55.123Z' for column 'created_at'`
- **원인**: Drizzle ORM이 자동으로 `created_at`을 처리하는데 수동으로 `createdAt: new Date()` 추가하여 타입 불일치 발생
- **해결**: `app/api/posts/route.ts`에서 `createdAt` 제거
- **적용 파일**:
  - `app/api/posts/route.ts`
  - `app/api/posts/[id]/comments/route.ts` (댓글도 동일한 문제)

#### 3. 데이터베이스 컬럼 타입 수정 ✅
- **문제**: Base64 인코딩된 프로필 이미지 저장 시 `Data too long for column` 에러
- **원인**:
  - Base64 이미지는 약 50KB~200KB
  - `VARCHAR(255)`는 최대 255바이트만 저장 가능
- **해결**:
  - `users.profile_image`: `varchar(255)` → `longtext`
  - `posts.user_image`: `varchar(255)` → `text`
  - `posts.images`: `longtext` (이미 적용됨)
- **영향**: 프로필 이미지, 게시글 작성자 이미지가 정상적으로 저장됨

#### 4. 대시보드 실시간 업데이트 구현 ✅
- **요구사항**: 취미 목록에서 관심 추가/제거 시 대시보드가 즉시 반영되어야 함
- **이전**: `useEffect`로 최초 로드만 수행
- **현재**: `useFocusEffect`로 화면 포커스 시마다 데이터 새로고침
- **적용 파일**: `mobile/app/dashboard.js`
- **적용 범위**:
  - 관심 취미 수 (❤️ 하트 버튼)
  - 참여 모임 수
  - 예정된 일정 수
  - 완료한 취미 수
  - 추천 취미 목록
  - 학습 진행도

### 2025-10-16 주요 업데이트

#### 0. 네트워크 오류 수정 ✅
- **문제**: AxiosError: Network Error - 취미/커뮤니티 목록 로딩 실패
- **원인**: IP 주소 변경 (10.205.167.63 → 192.168.0.40)
- **해결**: `mobile/src/services/api.ts`에서 API_BASE_URL 업데이트
- **확인 방법**: `ipconfig` 명령어로 현재 IPv4 주소 확인 필요
- **영향 범위**: 모든 API 호출 (호비, 커뮤니티, OAuth 등)

#### 1. OAuth 소셜 로그인 완전 구현 ✅
- **문제 해결**: WebView 방식의 CORS 및 쿠키 문제 해결
- **새 방식**: 디바이스 기본 브라우저를 사용한 안정적인 OAuth 인증
- **지원 제공자**: 카카오, 네이버, 구글 (실제 Client ID 적용)
- **UX 개선**: 2단계 다이얼로그로 명확한 사용자 가이드
- **LoginScreen**: 완전 재구현 (469 lines)
- **RegisterScreen**: 완전 재구현 (644 lines)
- **동작 흐름**:
  1. 소셜 로그인 버튼 탭 → 안내 다이얼로그
  2. "로그인 시작" → 브라우저에서 OAuth 인증
  3. 인증 완료 후 앱으로 복귀
  4. "로그인 확인" → Dashboard/Survey 화면으로 자동 이동

#### 2. 모바일 앱 UI 개선 (2025-10-16)
- ✅ **취미 목록 이미지**: 각 카드에 200px 높이 대표 이미지 표시
- ✅ **브랜드 로고**: 재사용 가능한 Logo 컴포넌트 생성 및 전체 적용
- ✅ **SafeAreaView**: 모바일 상단바(노치) 영역 대응
- ✅ **네이티브 UI**: 웹 스타일 네비게이션 제거, 완전 모바일 네이티브 방식

#### 3. 모바일 앱을 Expo로 변경 (2025-10-15)
- ❌ **이전**: React Native CLI (Android Studio 필수)
- ✅ **현재**: Expo (QR 코드로 즉시 실행)

#### 4. 네비게이션 구조 변경 (2025-10-15)
- ❌ **이전**: 로그인 화면부터 시작
- ✅ **현재**: 메인 페이지부터 시작 (웹과 동일)

#### 5. HomeScreen 웹 매칭 (2025-10-15)
- ✅ Hero Section: "당신만을 위한 맞춤 취미를 찾아드립니다"
- ✅ 통계: 12,000+ 회원, 500+ 모임, 50+ 카테고리
- ✅ 이용 방법 3단계
- ✅ 바로가기 버튼

---

## 🐛 트러블슈팅

### 웹 앱

**포트 3000이 사용 중일 때**
```bash
# 자동으로 3001 포트 사용
pnpm dev
```

**다크 모드 토글 버튼 작동 안함**
- 해결됨: `theme-toggle.tsx`에서 dropdown → 직접 토글로 변경

### 모바일 앱

**Expo 서버 시작 안됨**
```bash
cd mobile
rm -rf node_modules
npm install
npx expo start --clear
```

**QR 코드 스캔 안됨**
- 컴퓨터와 스마트폰이 **같은 Wi-Fi**에 연결되어 있는지 확인
- 터널 모드 사용: `npx expo start --tunnel`

**웹 번들링 에러**
- 무시해도 됨 (모바일 앱은 정상 작동)
- 웹은 Next.js 사용, 모바일만 Expo 사용

---

## 📝 개발 워크플로우

### 새 기능 추가 시

1. **웹 먼저 구현**
   ```bash
   # 웹 앱에서 기능 구현 및 테스트
   pnpm dev
   ```

2. **모바일 동일하게 구현**
   ```bash
   # 웹과 동일한 UI/기능으로 모바일 구현
   cd mobile
   npx expo start
   ```

3. **README 업데이트**
   - 변경사항을 README에 기록
   - 새 세션에서 바로 이어서 작업 가능하도록

### Git 커밋 메시지 규칙
```
feat: 새 기능 추가
fix: 버그 수정
docs: 문서 업데이트
style: UI/스타일 변경
refactor: 코드 리팩토링
```

---

## 🔮 향후 개선 계획

### 웹 앱
- [ ] 실시간 채팅 기능
- [ ] 고도화된 추천 알고리즘
- [ ] 오프라인 모임 지원
- [ ] 관리자 대시보드

### 모바일 앱
- [ ] 실제 API 연동 (현재 준비 중)
- [ ] Push 알림 구현
- [ ] 오프라인 모드 지원
- [ ] 앱스토어 배포 (EAS Build)

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

프로젝트 관련 문의사항은 [GitHub Issues](https://github.com/LeeJaeHaeng/HuLife-App/issues)에 남겨주세요.

---

## 💡 빠른 참고

### 자주 사용하는 명령어
```bash
# 웹 앱 실행
pnpm dev

# 모바일 앱 실행
cd mobile && npx expo start

# DB 시드
pnpm tsx scripts/seed.ts

# 의존성 설치
pnpm install              # 웹
cd mobile && npm install  # 모바일
```

### 중요 파일 위치
- 웹 메인: `app/page.tsx`
- 모바일 메인: `mobile/src/screens/HomeScreen.tsx`
- 네비게이션: `mobile/src/navigation/AppNavigator.tsx`
- API 서비스: `mobile/src/services/api.ts`
- DB 스키마: `lib/schema.ts`

---

## 🎨 최근 UI 개선 사항 (2025-10-16)

### 1. 취미 목록 이미지 추가
- 각 취미 카드에 대표 이미지 표시
- 상대 URL → 절대 URL 자동 변환
- 플레이스홀더 이미지 지원

### 2. 브랜드 로고 컴포넌트
- 재사용 가능한 Logo 컴포넌트 생성 (`mobile/src/components/Logo.tsx`)
- 3가지 크기 옵션: small, medium, large
- HomeScreen 및 Navigation 헤더에 적용

### 3. 모바일 네이티브 UI 완성
- 웹 스타일 네비게이션 바 제거 확인
- 완전히 모바일 네이티브 방식으로 구현
- 브랜드 아이덴티티 강화

---

**마지막 업데이트**: 2025-10-30
**현재 상태**:
- ✅ **키보드 입력 가림 문제 해결** (2025-10-30)
  - 모든 텍스트 입력 화면에서 키보드가 입력창을 가리던 문제 해결
  - Native `KeyboardAvoidingView` + `ScrollView` 솔루션 적용
  - 4개 화면 수정: 댓글 입력, 게시글 작성, 모임 생성, 문의 폼
- ✅ **게시글/댓글 작성 500 에러 해결** (2025-10-30)
  - Drizzle ORM의 자동 `createdAt` 처리와 충돌하는 수동 설정 제거
  - `app/api/posts/route.ts`, `app/api/posts/[id]/comments/route.ts` 수정
- ✅ **데이터베이스 컬럼 타입 수정** (2025-10-30)
  - Base64 이미지 저장을 위해 `VARCHAR(255)` → `LONGTEXT/TEXT` 변경
  - `users.profile_image`, `posts.user_image` 컬럼 업데이트
- ✅ **대시보드 실시간 업데이트 구현** (2025-10-30)
  - `useEffect` → `useFocusEffect`로 변경
  - 관심 취미, 참여 모임 등 변경 사항이 즉시 반영됨
- ✅ **게시글 작성 500 에러 해결** (2025-10-28 오후)
  - `posts` 테이블의 `userImage` 컬럼을 `varchar(255)` → `text`로 변경
  - Base64 이미지 데이터 지원으로 프로필 이미지 정상 저장
  - DB 마이그레이션 완료 (`0003_late_manta.sql`)
- ✅ **취미 필터링 수정** (2025-10-28 오후)
  - 난이도, 장소, 예산 필터 옵션을 하드코딩 대신 동적 생성
  - 실제 DB 데이터로부터 고유 값 추출하여 필터 옵션 구성
  - 필터 선택 시 취미 목록이 정상적으로 표시되도록 수정
- ✅ **게시판 UI 수정** (2025-10-28 오후)
  - 게시글 카드에서 조회수, 좋아요, 댓글 수 통계가 잘리는 문제 해결
  - `postAuthor`에 `flex: 1`, `minWidth: 0` 추가
  - `postStats`에 `flexShrink: 0` 추가하여 항상 보이도록 수정
  - 작성자 이름에 `numberOfLines={1}` 적용
- ✅ **모바일 앱 오류 수정** (2025-10-28 오후)
  - `hobbies.js`: `filteredHobbies` 정의 순서 재배치로 undefined 에러 해결
  - `userService.js`: `SecureStore`, `axios`, `TOKEN_KEY` import 누락 수정
  - Verbose 로깅 간소화 (전체 배열 대신 개수만 표시)
- ✅ **모바일 앱 커뮤니티 페이지 수정** (2025-10-28)
  - 변수 정의 순서 재배치로 크래시 해결
  - `undefined.length` 에러 수정
  - API Base URL 업데이트 (192.168.219.204 → 192.168.0.40)
- ✅ **API 500 에러 해결** (2025-10-28)
  - Import 이름 불일치 수정 (`KNNEngine` → `KNNRecommendationEngine`)
  - 하이브리드 추천 시스템 정상화
  - 모든 API 엔드포인트 정상 작동 확인
- ✅ **OAuth 소셜 로그인 완전 구현** (2025-10-16)
  - Kakao, Naver, Google 로그인 정상 작동
  - 외부 브라우저 방식으로 안정적인 인증 구현
  - WebView CORS 문제 완전 해결
- ✅ Expo 모바일 앱 완성, 웹과 완전히 동일한 UI/UX 구현 완료
- ✅ 취미 목록 이미지 표시 (2025-10-16)
- ✅ 브랜드 로고 컴포넌트 적용 (2025-10-16)
- ✅ 모바일 네이티브 UI 최적화 완료 (2025-10-16)

### 현재 서버 상태
- 💻 로컬 IP: `192.168.0.40:3000` (**주의**: Wi-Fi 재연결 시 IP 변경 가능)
- 🚀 서버: Next.js 14 (`npm run dev:socket`)
- ✅ 상태: 정상 작동 중
- 📱 모바일 API Base URL: `mobile/api/apiClient.js`에서 현재 IP로 업데이트 필요

### 향후 작업 사항
- [ ] 모바일 앱 채팅 기능 최종 검증 (Socket.IO 이미 구현됨)
- [ ] 추천 알고리즘 가중치 튜닝
- [ ] 푸시 알림 구현 (Expo Notifications)
- [ ] 앱스토어 배포 준비 (EAS Build)
