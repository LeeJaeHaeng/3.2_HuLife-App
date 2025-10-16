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

### 2025-10-15 주요 업데이트

#### 1. 모바일 앱을 Expo로 변경
- ❌ **이전**: React Native CLI (Android Studio 필수)
- ✅ **현재**: Expo (QR 코드로 즉시 실행)

#### 2. 네비게이션 구조 변경
- ❌ **이전**: 로그인 화면부터 시작
- ✅ **현재**: 메인 페이지부터 시작 (웹과 동일)

#### 3. 소셜 로그인 구현
- ✅ 카카오 로그인 버튼 (노란색)
- ✅ 네이버 로그인 버튼 (초록색)
- ✅ 구글 로그인 버튼 (흰색)
- ✅ 웹과 완전히 동일한 UI

#### 4. HomeScreen 웹 매칭
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

**마지막 업데이트**: 2025-10-16
**현재 상태**:
- ✅ Expo 모바일 앱 완성, 웹과 완전히 동일한 UI/UX 구현 완료
- ✅ 취미 목록 이미지 표시 (2025-10-16)
- ✅ 브랜드 로고 컴포넌트 적용 (2025-10-16)
- ✅ 모바일 네이티브 UI 최적화 완료 (2025-10-16)
