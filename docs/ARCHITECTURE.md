# HuLife 시스템 아키텍처 & 기술스택 로드맵

## 1. 전체 시스템 아키텍처

```mermaid
graph TB
    subgraph "클라이언트 레이어"
        Web[웹 애플리케이션<br/>Next.js 14<br/>React 18<br/>TypeScript]
        Mobile[모바일 앱<br/>Expo SDK 54<br/>React Native<br/>TypeScript]
    end

    subgraph "API 게이트웨이"
        NextAPI[Next.js API Routes<br/>/api/*]
    end

    subgraph "비즈니스 로직 레이어"
        Auth[인증 서비스<br/>JWT + Session]
        Survey[설문 서비스<br/>AI 추천 엔진]
        Community[커뮤니티 서비스]
        Chat[채팅 서비스<br/>폴링 방식]
        Hobby[취미 서비스]
        User[사용자 서비스]
    end

    subgraph "데이터 레이어"
        ORM[Drizzle ORM]
        DB[(Turso DB<br/>SQLite)]
    end

    subgraph "외부 서비스"
        OAuth[OAuth 제공자<br/>카카오/네이버/구글]
        Storage[이미지 스토리지<br/>/public/images]
    end

    Web -->|HTTP/HTTPS| NextAPI
    Mobile -->|HTTP| NextAPI

    NextAPI --> Auth
    NextAPI --> Survey
    NextAPI --> Community
    NextAPI --> Chat
    NextAPI --> Hobby
    NextAPI --> User

    Auth --> ORM
    Survey --> ORM
    Community --> ORM
    Chat --> ORM
    Hobby --> ORM
    User --> ORM

    ORM --> DB

    Auth -->|OAuth 2.0| OAuth
    User -->|업로드| Storage

    style Web fill:#FF7A5C,color:#fff
    style Mobile fill:#FF7A5C,color:#fff
    style NextAPI fill:#000,color:#fff
    style DB fill:#4A90E2,color:#fff
    style OAuth fill:#FAE100,color:#000
```

---

## 2. 기술스택 상세

```mermaid
mindmap
  root((HuLife<br/>기술스택))
    Frontend
      웹 애플리케이션
        Next.js 14
        React 18
        TypeScript
        Tailwind CSS
        shadcn/ui
      모바일 앱
        Expo SDK 54
        React Native
        TypeScript
        React Navigation 6
        Axios
    Backend
      프레임워크
        Next.js 14 API Routes
      인증
        NextAuth.js
        bcrypt
        JWT
      ORM
        Drizzle ORM
        Drizzle Kit
      데이터베이스
        Turso DB (SQLite)
    외부 서비스
      OAuth
        카카오 로그인
        네이버 로그인
        구글 로그인
      스토리지
        로컬 파일 시스템
        /public/images
    개발 도구
      버전 관리
        Git
        GitHub
      패키지 관리
        npm
      린팅
        ESLint
        Prettier
      테스팅
        향후 추가 예정
```

---

## 3. 웹 애플리케이션 아키텍처

```mermaid
graph LR
    subgraph "웹 프론트엔드"
        Pages[Pages<br/>14개 페이지]
        Components[Components<br/>재사용 컴포넌트]
        Hooks[Custom Hooks]
        Utils[Utils<br/>헬퍼 함수]
    end

    subgraph "Next.js API Routes"
        AuthAPI[/api/auth/*]
        HobbyAPI[/api/hobbies/*]
        SurveyAPI[/api/survey/*]
        CommunityAPI[/api/communities/*]
        ChatAPI[/api/chat/*]
        PostAPI[/api/posts/*]
    end

    subgraph "Server Actions"
        AuthActions[lib/actions/auth.ts]
        HobbyActions[lib/actions/hobbies.ts]
        CommunityActions[lib/actions/community.ts]
        ChatActions[lib/actions/chat.ts]
        PostActions[lib/actions/posts.ts]
    end

    subgraph "데이터베이스"
        Schema[lib/db/schema.ts<br/>Drizzle Schema]
        DBClient[lib/db/index.ts<br/>Turso Client]
    end

    Pages --> Components
    Pages --> Hooks
    Pages --> AuthActions
    Pages --> HobbyActions
    Pages --> CommunityActions

    AuthAPI --> AuthActions
    HobbyAPI --> HobbyActions
    SurveyAPI --> HobbyActions
    CommunityAPI --> CommunityActions
    ChatAPI --> ChatActions
    PostAPI --> PostActions

    AuthActions --> Schema
    HobbyActions --> Schema
    CommunityActions --> Schema
    ChatActions --> Schema
    PostActions --> Schema

    Schema --> DBClient
```

---

## 4. 모바일 애플리케이션 아키텍처

```mermaid
graph LR
    subgraph "모바일 프론트엔드"
        Screens[Screens<br/>19개 화면]
        Components2[Components<br/>Logo, Modal 등]
        Navigation[Navigation<br/>Stack Navigator]
        Types[Types<br/>TypeScript 타입]
    end

    subgraph "API 서비스"
        ApiClient[services/api.ts<br/>Axios 클라이언트]
        AuthService[authService]
        HobbyService[hobbyService]
        CommunityService[communityService]
        ChatService[chatService]
        PostService[postService]
        SurveyService[surveyService]
    end

    subgraph "로컬 스토리지"
        AsyncStorage[AsyncStorage<br/>인증 토큰 저장]
    end

    subgraph "Next.js 서버"
        ServerAPI[/api/*<br/>14개 엔드포인트]
    end

    Screens --> Navigation
    Screens --> Components2
    Screens --> Types

    Screens --> AuthService
    Screens --> HobbyService
    Screens --> CommunityService
    Screens --> ChatService
    Screens --> PostService
    Screens --> SurveyService

    AuthService --> ApiClient
    HobbyService --> ApiClient
    CommunityService --> ApiClient
    ChatService --> ApiClient
    PostService --> ApiClient
    SurveyService --> ApiClient

    ApiClient --> AsyncStorage
    ApiClient -->|HTTP| ServerAPI
```

---

## 5. 인증 흐름 아키텍처

```mermaid
sequenceDiagram
    participant User as 사용자
    participant Mobile as 모바일 앱
    participant Browser as 브라우저
    participant NextAPI as Next.js API
    participant OAuth as OAuth 제공자
    participant DB as 데이터베이스

    Note over User,DB: 이메일 로그인
    User->>Mobile: 이메일/비밀번호 입력
    Mobile->>NextAPI: POST /api/auth/login
    NextAPI->>DB: 사용자 조회 + 비밀번호 검증
    DB-->>NextAPI: 사용자 정보
    NextAPI-->>Mobile: JWT 토큰 반환
    Mobile->>Mobile: AsyncStorage에 저장

    Note over User,DB: 소셜 로그인 (OAuth)
    User->>Mobile: 소셜 로그인 버튼 클릭
    Mobile->>Browser: Linking.openURL(OAuth URL)
    Browser->>NextAPI: GET /api/auth/{provider}
    NextAPI->>OAuth: OAuth 인증 페이지로 리다이렉트
    User->>OAuth: 로그인 & 동의
    OAuth->>NextAPI: 콜백 + 인증 코드
    NextAPI->>OAuth: 액세스 토큰 요청
    OAuth-->>NextAPI: 액세스 토큰
    NextAPI->>OAuth: 사용자 정보 요청
    OAuth-->>NextAPI: 사용자 정보
    NextAPI->>DB: 사용자 저장/업데이트
    NextAPI-->>Browser: 세션 생성 + 리다이렉트
    User->>Mobile: 앱으로 복귀
    Mobile->>NextAPI: GET /api/auth/me
    NextAPI-->>Mobile: 사용자 정보 + 토큰
```

---

## 6. 데이터 흐름 아키텍처

```mermaid
flowchart TD
    subgraph "사용자 입력"
        Input1[설문 응답]
        Input2[게시글 작성]
        Input3[채팅 메시지]
        Input4[모임 가입 신청]
    end

    subgraph "API 레이어"
        API1[POST /api/survey]
        API2[POST /api/posts]
        API3[POST /api/chat/messages]
        API4[POST /api/communities/join-request]
    end

    subgraph "비즈니스 로직"
        Logic1[설문 응답 처리<br/>→ AI 추천 엔진]
        Logic2[게시글 검증<br/>→ DB 저장]
        Logic3[메시지 저장<br/>→ 폴링 반환]
        Logic4[가입 신청 검증<br/>→ 리더에게 알림]
    end

    subgraph "데이터베이스"
        DB1[(surveyResponses)]
        DB2[(posts)]
        DB3[(chatMessages)]
        DB4[(joinRequests)]
    end

    subgraph "응답 처리"
        Response1[추천 결과 반환<br/>상위 6개 취미]
        Response2[게시글 ID 반환]
        Response3[메시지 ID 반환]
        Response4[신청 상태 반환]
    end

    Input1 --> API1 --> Logic1 --> DB1 --> Response1
    Input2 --> API2 --> Logic2 --> DB2 --> Response2
    Input3 --> API3 --> Logic3 --> DB3 --> Response3
    Input4 --> API4 --> Logic4 --> DB4 --> Response4

    Response1 -.-> Cache1[캐싱 고려]
    Response3 -.-> Polling[3초 폴링]
    Response4 -.-> Notification[푸시 알림 고려]
```

---

## 7. 프로젝트 폴더 구조

```mermaid
graph TD
    Root[HuLife_App/] --> App[app/<br/>Next.js 14 Pages]
    Root --> Lib[lib/<br/>Server Actions & Utils]
    Root --> Components[components/<br/>React 컴포넌트]
    Root --> Public[public/<br/>정적 파일]
    Root --> Mobile[mobile/<br/>React Native 앱]

    App --> AppPages[pages/<br/>/, /about, /hobbies 등]
    App --> AppAPI[api/<br/>API Routes]

    AppAPI --> AuthAPI2[auth/]
    AppAPI --> HobbyAPI2[hobbies/]
    AppAPI --> SurveyAPI2[survey/]
    AppAPI --> CommunityAPI2[communities/]
    AppAPI --> ChatAPI2[chat/]
    AppAPI --> PostAPI2[posts/]

    Lib --> Actions[actions/<br/>Server Actions]
    Lib --> DB[db/<br/>Drizzle ORM]
    Lib --> Recommend[recommendation/<br/>AI 엔진]

    DB --> Schema2[schema.ts]
    DB --> Seed[seed.ts<br/>123개 취미 데이터]

    Mobile --> MobileApp[app/<br/>Expo Router]
    Mobile --> MobileScreens[screens/<br/>19개 화면]
    Mobile --> MobileServices[services/<br/>API 서비스]
    Mobile --> MobileNav[navigation/<br/>AppNavigator]
    Mobile --> MobileComponents[components/<br/>Logo, Modal 등]

    Public --> Images[images/<br/>취미 이미지]
    Public --> Favicon[favicon.ico]
```

---

## 8. 기술 스택 버전 정보

| 카테고리 | 기술 | 버전 | 용도 |
|---------|------|------|------|
| **프레임워크** | Next.js | 14.x | 웹 풀스택 프레임워크 |
| | React | 18.x | UI 라이브러리 |
| | Expo | SDK 54 | React Native 개발 도구 |
| | React Native | 0.76.x | 모바일 크로스 플랫폼 |
| **언어** | TypeScript | 5.x | 정적 타입 언어 |
| | JavaScript | ES2022 | 동적 언어 |
| **스타일링** | Tailwind CSS | 3.x | 유틸리티 CSS 프레임워크 |
| | shadcn/ui | latest | React 컴포넌트 라이브러리 |
| **데이터베이스** | Turso | latest | SQLite 호스팅 서비스 |
| | Drizzle ORM | 0.28.x | TypeScript ORM |
| **인증** | NextAuth.js | 4.x | 인증 라이브러리 |
| | bcrypt | 5.x | 비밀번호 해싱 |
| **HTTP 클라이언트** | Axios | 1.x | HTTP 요청 라이브러리 |
| **네비게이션** | React Navigation | 6.x | 모바일 네비게이션 |
| **스토리지** | AsyncStorage | 1.x | 모바일 로컬 스토리지 |
| **개발 도구** | ESLint | 8.x | 린팅 도구 |
| | Prettier | 3.x | 코드 포맷터 |
| | Git | 2.x | 버전 관리 |

---

## 9. API 엔드포인트 맵

```mermaid
graph LR
    subgraph "인증 API"
        A1[POST /api/auth/login]
        A2[POST /api/auth/signup]
        A3[GET /api/auth/me]
        A4[GET /api/auth/kakao]
        A5[GET /api/auth/naver]
        A6[GET /api/auth/google]
    end

    subgraph "취미 API"
        H1[GET /api/hobbies]
        H2[GET /api/hobbies/:id]
        H3[GET /api/hobbies/user]
    end

    subgraph "설문 & 추천 API"
        S1[POST /api/survey]
        S2[GET /api/survey]
        S3[GET /api/recommendations]
    end

    subgraph "커뮤니티 API"
        C1[GET /api/communities]
        C2[GET /api/communities/:id]
        C3[GET /api/communities/active]
        C4[POST /api/communities/join]
        C5[GET /api/communities/user]
        C6[POST /api/communities/:id/join-request]
        C7[DELETE /api/communities/:id/leave]
        C8[GET /api/communities/:id/join-requests]
        C9[POST /api/join-requests/:id/approve]
        C10[POST /api/join-requests/:id/reject]
    end

    subgraph "채팅 API"
        CH1[GET /api/communities/:id/chat-room]
        CH2[GET /api/chat/:roomId/messages]
        CH3[POST /api/chat/:roomId/messages]
    end

    subgraph "게시판 API"
        P1[GET /api/posts]
        P2[GET /api/posts/:id]
        P3[POST /api/posts]
        P4[PUT /api/posts/:id]
        P5[DELETE /api/posts/:id]
    end

    subgraph "사용자 API"
        U1[GET /api/user/communities]
        U2[GET /api/user/hobbies]
        U3[POST /api/user/schedules]
        U4[PUT /api/user/profile]
    end
```

---

## 10. 배포 아키텍처 (향후 계획)

```mermaid
graph TB
    subgraph "프론트엔드"
        WebDeploy[Vercel<br/>웹 배포]
        MobileDeploy[Expo EAS<br/>모바일 배포]
    end

    subgraph "백엔드"
        NextDeploy[Vercel<br/>Next.js API]
    end

    subgraph "데이터베이스"
        TursoDeploy[Turso Cloud<br/>SQLite]
    end

    subgraph "스토리지"
        S3[AWS S3<br/>이미지 스토리지]
    end

    subgraph "모니터링"
        Sentry[Sentry<br/>에러 트래킹]
        Analytics[Google Analytics<br/>사용자 분석]
    end

    WebDeploy --> NextDeploy
    MobileDeploy --> NextDeploy
    NextDeploy --> TursoDeploy
    NextDeploy --> S3
    WebDeploy --> Sentry
    MobileDeploy --> Sentry
    WebDeploy --> Analytics
    MobileDeploy --> Analytics

    style WebDeploy fill:#FF7A5C,color:#fff
    style MobileDeploy fill:#FF7A5C,color:#fff
```

---

## 11. 개발 로드맵

```mermaid
timeline
    title HuLife 개발 로드맵
    section Phase 1 (완료)
        웹 애플리케이션 개발 : 14개 페이지
                              : 11개 DB 테이블
                              : OAuth 소셜 로그인
                              : 설문 & AI 추천 엔진
                              : 실시간 채팅 (폴링)
                              : 게시판 시스템

    section Phase 2 (완료)
        모바일 앱 개발 : 19개 화면 구현
                      : 웹 API 연동
                      : 검색 & 필터
                      : 브랜드 로고 적용
                      : OAuth 외부 브라우저 방식

    section Phase 3 (진행 중)
        기능 개선 : 리뷰 시스템
                 : 일정 관리 고도화
                 : 관심 취미 추가
                 : 고급 필터링
                 : 메인 페이지 섹션 추가

    section Phase 4 (계획)
        성능 최적화 : 이미지 CDN
                   : API 캐싱
                   : 무한 스크롤
                   : WebSocket 채팅

    section Phase 5 (계획)
        추가 기능 : 푸시 알림
                 : 결제 시스템
                 : 관리자 대시보드
                 : 다국어 지원

    section Phase 6 (계획)
        배포 & 운영 : Vercel 배포
                   : Expo EAS 빌드
                   : 모니터링 구축
                   : 테스트 자동화
```

---

## 12. 성능 최적화 전략

```mermaid
mindmap
  root((성능 최적화))
    프론트엔드
      React 최적화
        useMemo
        useCallback
        React.memo
      이미지 최적화
        Next.js Image
        WebP 포맷
        Lazy Loading
      코드 스플리팅
        Dynamic Import
        Route-based Splitting
    백엔드
      API 최적화
        응답 캐싱
        Gzip 압축
        Rate Limiting
      데이터베이스
        인덱스 추가
        쿼리 최적화
        Connection Pooling
    모바일
      React Native 최적화
        FlatList 대신 SectionList
        이미지 캐싱
        Hermes 엔진
      번들 크기 최적화
        Tree Shaking
        Code Minification
```

---

## 13. 보안 아키텍처

```mermaid
graph TD
    subgraph "인증 보안"
        JWT[JWT 토큰<br/>만료 시간 24시간]
        Bcrypt[bcrypt<br/>비밀번호 해싱]
        CSRF[CSRF 토큰<br/>NextAuth.js]
    end

    subgraph "API 보안"
        Auth2[인증 미들웨어]
        Validation[입력 검증]
        RateLimit[Rate Limiting<br/>향후 추가]
    end

    subgraph "데이터 보안"
        Encryption[전송 암호화<br/>HTTPS]
        Sanitize[XSS 방지<br/>입력 Sanitization]
        SQL[SQL Injection 방지<br/>Drizzle ORM]
    end

    subgraph "모바일 보안"
        SecureStorage[AsyncStorage<br/>토큰 암호화 고려]
        HTTPS2[HTTPS Only]
        Cleartext[Android Cleartext<br/>개발 환경만]
    end

    JWT --> Auth2
    Bcrypt --> Auth2
    CSRF --> Auth2

    Auth2 --> Validation
    Validation --> Encryption
    Encryption --> Sanitize
    Sanitize --> SQL

    SecureStorage --> HTTPS2
    HTTPS2 --> Cleartext
```

---

## 다이어그램 렌더링 방법

### 1. GitHub에서 보기
- 이 파일을 GitHub에 푸시하면 자동으로 다이어그램이 렌더링됩니다.

### 2. VSCode에서 보기
- **Mermaid Preview** 확장 프로그램 설치
- `Ctrl+Shift+P` → "Mermaid: Preview" 선택

### 3. 온라인 에디터
- [Mermaid Live Editor](https://mermaid.live)에 코드 복사/붙여넣기
- PNG, SVG, PDF로 내보내기 가능

### 4. 프레젠테이션 도구
- [Marp](https://marp.app) - 마크다운 기반 프레젠테이션
- [reveal.js](https://revealjs.com) - HTML 프레젠테이션

---

## 참고 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [React Native 공식 문서](https://reactnative.dev/docs/getting-started)
- [Expo 공식 문서](https://docs.expo.dev)
- [Drizzle ORM 공식 문서](https://orm.drizzle.team/docs/overview)
- [Turso 공식 문서](https://docs.turso.tech)
- [Mermaid 공식 문서](https://mermaid.js.org/intro/)

---

**문서 작성일**: 2025-10-16
**최종 수정일**: 2025-10-16
**버전**: 1.0
