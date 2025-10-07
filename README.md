# 은퇴자를 위한 취미 추천 및 커뮤니티 플랫폼

## 🌟 프로젝트 개요

'Hobby App'은 은퇴 후 새로운 삶을 시작하는 분들을 위한 서비스입니다. 비슷한 관심사를 가진 사람들과 교류하고, 즐거운 취미 생활을 통해 활기찬 노후를 보낼 수 있도록 돕는 것을 목표로 합니다. 사용자 맞춤형 취미 추천, 커뮤니티 기능, 일정 관리 등 다양한 기능을 통해 풍요로운 여가 생활을 제안합니다.

## 🚀 주요 기능

- **맞춤형 취미 추천:** 간단한 설문조사를 통해 사용자의 성향과 관심사에 맞는 취미를 추천합니다.
- **취미 정보 탐색:** 다양한 카테고리의 취미 정보를 확인하고, 상세 설명을 볼 수 있습니다.
- **커뮤니티:** 관심 있는 취미를 기반으로 커뮤니티에 가입하여 다른 사용자들과 소통할 수 있습니다. (게시글 작성, 채팅 등)
- **소셜 로그인:** Google, Naver, Kakao 계정을 통해 간편하게 로그인할 수 있습니다.
- **마이페이지:** 프로필 수정, 가입한 커뮤니티 목록, 내가 쓴 글 등을 관리할 수 있습니다.

## 🛠️ 기술 스택

- **Frontend:** Next.js (React), TypeScript
- **Backend:** Next.js API Routes
- **Database:** Drizzle ORM, turso
- **Styling:** Tailwind CSS, shadcn/ui
- **Authentication:** NextAuth.js (OAuth)

## 🏃 시작하기

### 1. 저장소 복제
```bash
git clone https://github.com/LeeJaeHaeng/Hobby-app.git
cd Hobby-app
```

### 2. 종속성 설치
```bash
pnpm install
```

### 3. 환경 변수 설정
`.env.local` 파일을 생성하고 아래와 같이 필요한 환경 변수를 추가합니다. 각 소셜 로그인을 위한 `CLIENT_ID`와 `CLIENT_SECRET`은 해당 플랫폼의 개발자 콘솔에서 발급받아야 합니다.

```env
# .env.example

# OAuth Providers
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NAVER_CLIENT_ID=...
NAVER_CLIENT_SECRET=...
KAKAO_CLIENT_ID=...
KAKAO_CLIENT_SECRET=...

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=... # openssl rand -hex 32 명령어로 생성

# Database (Turso)
TURSO_DATABASE_URL=...
TURSO_AUTH_TOKEN=...
```

### 4. 개발 서버 실행
```bash
pnpm dev
```

## 🔮 향후 개선 계획

- **실시간 채팅 및 알림:** 커뮤니티 내 사용자 간의 실시간 소통 경험을 강화합니다.
- **고도화된 추천 알고리즘:** 사용자 활동 데이터를 기반으로 더욱 정교한 취미 추천 모델을 구현합니다.
- **오프라인 모임 지원:** 지역 기반 오프라인 모임 생성 및 참여 기능을 추가합니다.
- **관리자 대시보드:** 사용자, 커뮤니티, 취미 데이터를 효율적으로 관리할 수 있는 관리자 페이지를 개발합니다.
- **모바일 최적화 강화:** 모바일 환경에서의 사용자 경험을 지속적으로 개선합니다.
