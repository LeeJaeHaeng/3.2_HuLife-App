# HuLife 웹 프로젝트의 Expo 모바일 앱 전환 기록

> 📅 최종 업데이트: 2025년 10월 20일 (Phase 4 완료)

이 문서는 기존 Next.js(웹) 프로젝트를 Expo(React Native) 모바일 앱으로 전환하는 모든 과정과 주요 문제 해결 기록을 정리합니다.

---

## 🚀 현재 상태 (Current Status)

**로그인, 회원 정보 로딩, 취미 목록/상세 보기, 설문 제출, 추천 결과 보기 등 앱의 핵심 흐름 대부분이 실제 DB 데이터와 연동되어 작동합니다.** 👍

-   **성공:** 로그인 성공 시 토큰 저장 및 API 요청 시 헤더에 토큰 사용 구현 완료.
-   **성공:** 마이페이지에서 사용자 프로필 정보 DB 연동 완료.
-   **성공:** 취미 목록 및 상세 페이지 DB 연동 완료 (텍스트, 유튜브 영상).
-   **성공:** 설문조사 답변 제출 DB 연동 완료.
-   **성공:** 추천 결과 페이지 DB 연동 완료.
-   **성공:** 취미 상세 페이지 및 취미 목록 페이지에 '관심 추가/제거' (좋아요) 버튼 기능 및 API 연동 완료.
-   **성공:** 앱 로고 적용 완료.
-   **성공:** 모든 화면에 `react-native-safe-area-context`를 사용한 안전 영역 적용 완료.
-   **✅ 완료:** **마이페이지의 '관심 취미' 탭 실시간 동기화 문제 해결!** `DeviceEventEmitter`를 사용한 전역 이벤트 시스템으로 좋아요 상태 변경 시 마이페이지가 즉시 새로고침되도록 구현 완료. 🎉
-   **✅ 완료:** **Phase 1 핵심 기능 완성!** (2025-10-19)
  - 로그아웃 기능: 마이페이지 헤더에 로그아웃 버튼 추가, 토큰 삭제 및 로그인 화면 이동
  - 회원가입 기능: 실제 API 연동, 유효성 검증, 성공 시 자동 로그인 및 설문조사 화면 이동
  - 대시보드 실제 데이터 연동: 통계, 추천 취미, 학습 진행도, 일정 등 모두 실제 DB 데이터 표시
-   **✅ 완료:** **Phase 2 커뮤니티 기능 완성!** (2025-10-19)
  - 커뮤니티 API 서비스 생성 (`api/communityService.js`)
  - 커뮤니티 목록 페이지 구현 (`app/community.js`) - 모임 찾기/게시판 탭
  - 커뮤니티 상세 페이지 구현 (`app/community/[id].js`) - 멤버 목록, 모임 정보
  - 게시글 상세 페이지 구현 (`app/community/posts/[id].js`)
  - 검색 및 지역 필터 기능
  - 가입 신청 기능
  - **네비게이션 개선:** 대시보드, 취미 목록, 마이페이지에서 커뮤니티 접근 가능
-   **✅ 완료:** **Phase 3 UX/UI 개선 및 일정 기능 완성!** (2025-10-20)
  - **취미 목록 개선:**
    - 필터 접기/펴기 기능 추가 (토글 버튼으로 공간 절약)
    - 2열 그리드 레이아웃으로 변경 (더 많은 취미를 한 화면에 표시)
    - 카드 크기 및 텍스트 크기 최적화
  - **게시글 좋아요 버그 수정:**
    - `DeviceEventEmitter`로 게시글 좋아요 상태 실시간 동기화
    - 게시글 상세 페이지에서 좋아요 클릭 → 목록 페이지 즉시 반영
    - 뒤로 가기 시 좋아요 상태 유지 문제 해결
  - **일정/스케줄 기능 완성 (웹 버전과 동일):**
    - `createScheduleAPI` 추가 (`api/userService.js`)
    - `AddScheduleModal` 컴포넌트 생성 (제목, 유형, 날짜, 시간, 장소 입력)
    - 마이페이지 일정 탭 대폭 개선:
      - "일정 추가" 버튼 추가
      - 유형별 색상 코딩 (수업=파랑, 연습=초록, 모임=보라, 행사=주황)
      - 상세 정보 표시 (날짜, 시간, 장소 아이콘과 함께)
      - 다가오는 일정만 표시 (과거 일정 자동 필터링)
      - Empty state 개선 (안내 메시지)
-   **✅ 완료:** **Phase 4 핵심 개선 완성!** (2025-10-20)
  - **새로운 페이지 4개 추가:** Home (메인), About (회사 소개), FAQ, Contact (문의하기)
  - **커뮤니티 이미지 버그 수정:** 서버 업로드 이미지 절대 URL 변환 로직 구현
  - **OAuth 소셜 로그인 구현:** 카카오, 네이버, 구글 간편 로그인/회원가입
  - **프로필 수정 기능 완성:** 이름, 나이, 지역, 전화번호 수정 + 프로필 사진 업로드
-   **진행 중:** 취미 목록 이미지 매핑(`hobbyImages.js`) 작업 거의 완료 (일부 파일 누락 확인).
-   **남은 작업 (Phase 5):** 댓글 기능, 채팅 기능, Push 알림
-   **⚠️ 참고:** 메인페이지(`app/index.js`)는 이제 `/home`으로 리다이렉트되어 완성된 Home 화면을 표시합니다

---

## ✅ 완료된 작업 (Completed Tasks)

### 1. 프로젝트 구조 및 기본 화면 구현
- Expo 프로젝트 생성 및 **Expo Router** 기반 구조 설정 완료.
- 주요 화면 (로그인, 회원가입, 대시보드, 취미 목록/상세, 마이페이지, 설문조사, 추천결과) UI 골격 구현 완료.
- **`react-native-safe-area-context`** 를 사용한 안전 영역 적용 완료.

### 2. 로컬 이미지 자산 처리
- 웹 프로젝트 이미지를 `assets/hobbies` 폴더로 이동 및 **영문 이름으로 변경** 완료.
- DB 이름과 이미지 파일을 매핑하는 **`assets/hobbyImages.js`** 파일 생성 및 대부분 항목 매핑 완료. (일부 파일 누락으로 주석 처리)

### 3. API 서버 연동 (핵심)
- 기존 Next.js 웹 프로젝트를 API 서버로 활용.
- 개발 환경의 IP 주소 변경 문제를 해결하기 위해 **`ngrok` 사용법 안내** (현재는 수동 IP 업데이트 방식 사용 중).
- **웹 프로젝트에 모바일 앱 전용 REST API 엔드포인트 생성 완료:**
    - `POST /api/auth/login` (로그인 및 토큰 발급)
    - `GET /api/auth/me` (현재 사용자 정보 조회)
    - `GET /api/hobbies` (전체 취미 목록 조회)
    - `GET /api/hobbies/:id` (특정 취미 상세 정보 조회 - Drizzle 문법 적용)
    - `POST /api/survey` (설문 답변 저장)
    - `GET /api/recommendations` (추천 목록 조회)
    - `GET /api/user/hobbies` (사용자 관심 취미 목록 조회 - Hobby 정보 JOIN)
    - `POST /api/user/hobbies` (관심 취미 추가)
    - `DELETE /api/user/hobbies` (관심 취미 제거)
    - `GET /api/user/communities` (사용자 참여 모임 목록 조회)
    - `GET /api/user/schedules` (사용자 일정 목록 조회)
- **모바일 앱에 API 호출 서비스 파일 생성 완료:**
    - `api/authService.js` (로그인, 사용자 정보, 로그아웃, 회원가입)
    - `api/hobbyService.js` (취미 목록/상세)
    - `api/surveyService.js` (설문 제출, 추천 목록)
    - `api/userService.js` (관심 취미, 참여 모임, 일정)
    - `api/communityService.js` (커뮤니티 목록/상세, 게시글 목록/상세, 가입 신청)

### 4. 핵심 기능 DB 연동
- **로그인:** 실제 API 호출, 성공 시 토큰 받아 **`expo-secure-store`** 에 저장, 대시보드 이동 구현 완료.
- **사용자 정보:** API 요청 시 헤더에 저장된 토큰 사용, 마이페이지 프로필 정보 표시 완료.
- **취미 목록/상세:** API 호출로 실제 데이터 표시, 유튜브 영상 재생, 좋아요 버튼 기능 및 API 연동 완료.
- **설문조사:** 답변 제출 API 연동 완료, 성공 시 추천 페이지 이동 구현 완료.
- **추천 결과:** 추천 목록 API 연동, 관심 추가/제거 버튼 기능 및 API 연동 완료.
- **마이페이지 탭:** 관심 취미, 참여 모임, 일정 목록 API 연동 완료. (관심 취미 이름 표시 완료)

### 5. 버그 수정 및 개선
- 다양한 `SyntaxError`, `ReferenceError` (import 누락 등) 해결.
- 이미지 경로(`Unable to resolve`) 문제 해결 (한글 이름 -> 영문, 동적 경로 -> 정적 경로, 확장자 불일치 등).
- 서버 API 오류 (`Internal Server Error`, `Hobby not found`, `401 Unauthorized`) 원인 진단 및 해결 (Drizzle 문법 적용, ID 타입 수정, 토큰 전달 등).
- 아이콘(`@expo/vector-icons`) 사용법 오류 수정.
- 앱 로고(`hulife_logo.png`) 적용 완료.

---

### 6. 마이페이지 실시간 데이터 동기화 구현 (2025-10-19)
- **문제:** 마이페이지의 '관심 취미' 탭이 다른 페이지(취미 상세, 취미 목록, 추천 결과)에서의 좋아요 상태 변경을 실시간으로 반영하지 못함
- **원인 분석:**
  - 각 페이지가 독립적으로 로컬 상태만 업데이트
  - `useFocusEffect`로 화면 포커스 시 데이터를 다시 불러오지만, 실제 DB 변경사항 반영 시점에 차이 발생
- **해결 방법:**
  - React Native의 `DeviceEventEmitter`를 활용한 전역 이벤트 시스템 구현
  - 좋아요 상태 변경 시 `HOBBY_INTEREST_CHANGED` 이벤트 발송
  - 마이페이지에서 해당 이벤트 수신 시 즉시 데이터 새로고침
- **적용 파일:**
  - `app/my-page.js`: 이벤트 리스너 추가
  - `app/hobbies/[id].js`: 좋아요 토글 후 이벤트 발송 + 이벤트 리스너 추가
  - `app/hobbies.js`: 좋아요 토글 후 이벤트 발송 + 이벤트 리스너 추가
  - `app/recommendations.js`: 좋아요 토글 후 이벤트 발송 + 이벤트 리스너 추가

### 7. 전역 하트(좋아요) 상태 동기화 구현 (2025-10-19)
- **문제 1:** `api/userService.js`의 `addHobbyToUserAPI`, `removeHobbyFromUserAPI` 등의 함수가 실제로 구현되지 않고 주석만 존재
- **문제 2:** 취미 목록에서 하트를 누르면 상세 페이지, 추천 페이지, 마이페이지에 즉시 반영되지 않음
- **해결 방법:**
  - `api/userService.js`의 모든 API 함수 완전 구현 (POST, DELETE, GET 요청)
  - 모든 페이지(취미 목록, 상세, 추천, 마이페이지)에 양방향 이벤트 리스너 추가
  - 어느 페이지에서든 하트를 누르면 `HOBBY_INTEREST_CHANGED` 이벤트 발송
  - 모든 페이지가 이벤트를 수신하여 관심 취미 상태 즉시 업데이트
- **결과:**
  - ✅ 취미 목록에서 하트 클릭 → 상세 페이지, 추천 페이지, 마이페이지 즉시 반영
  - ✅ 상세 페이지에서 하트 클릭 → 취미 목록, 추천 페이지, 마이페이지 즉시 반영
  - ✅ 추천 페이지에서 하트 클릭 → 취미 목록, 상세 페이지, 마이페이지 즉시 반영
  - ✅ 모든 페이지가 실시간으로 동기화되어 일관된 상태 유지

### 8. Phase 1 핵심 기능 완성 (2025-10-19)

#### 8.1 로그아웃 기능 구현
- **위치:** `app/my-page.js`
- **구현 내용:**
  - 마이페이지 헤더 우측 상단에 로그아웃 아이콘 추가 (`log-out` 아이콘)
  - 클릭 시 확인 다이얼로그 표시
  - `SecureStore`에서 토큰 삭제
  - 로그인 화면으로 이동 (`router.replace('/login')`)

#### 8.2 회원가입 기능 구현
- **API 함수:** `api/authService.js`의 `registerUser` 추가
- **화면:** `app/signup.js`
- **구현 내용:**
  - 서버 API (`POST /api/auth/register`) 연동
  - 필수 입력값 유효성 검증 (이름, 나이, 이메일, 비밀번호, 거주지역)
  - 비밀번호 확인 매칭 검증
  - 이용약관 동의 체크
  - 회원가입 성공 시 자동으로 토큰 저장 (`SecureStore`)
  - 성공 후 설문조사 화면으로 자동 이동

#### 8.3 대시보드 실제 데이터 연동
- **화면:** `app/dashboard.js`
- **이미 구현 완료:** 모든 데이터가 실제 DB에서 로드됨
- **개선사항:**
  - 학습 진행도에서 취미 ID 대신 실제 취미 이름 표시
  - JOIN된 `hobby` 객체 활용 (`item.hobby?.name`)
  - 클릭 시 해당 취미 상세 페이지로 이동 가능

### 9. Phase 2 커뮤니티 기능 완성 (2025-10-19)

#### 9.1 커뮤니티 API 서비스 구현
- **파일:** `api/communityService.js`
- **구현된 함수:**
  - `getAllCommunitiesAPI(hobbyId)`: 전체 커뮤니티 목록 조회 (취미별 필터링 가능)
  - `getCommunityByIdAPI(id)`: 커뮤니티 상세 정보 조회
  - `requestJoinCommunityAPI(communityId)`: 커뮤니티 가입 신청
  - `getAllPostsAPI(category)`: 게시글 목록 조회 (카테고리별 필터링 가능)
  - `getPostByIdAPI(id)`: 게시글 상세 정보 조회
  - `createPostAPI(postData)`: 게시글 작성
  - `createCommunityAPI(communityData)`: 커뮤니티 생성

#### 9.2 커뮤니티 목록 페이지 구현
- **파일:** `app/community.js`
- **주요 기능:**
  - 모임 찾기 / 게시판 탭 구현
  - 커뮤니티 검색 기능 (이름, 설명)
  - 지역별 필터링 (서울, 경기, 인천, 부산, 대구, 광주, 대전)
  - Pull to refresh 기능
  - 커뮤니티 카드: 이미지, 멤버 수, 위치, 일정, 가입 신청 버튼
  - 게시글 카드: 카테고리, 제목, 내용, 조회수, 좋아요, 댓글 수

#### 9.3 커뮤니티 상세 페이지 구현
- **파일:** `app/community/[id].js`
- **주요 기능:**
  - 히어로 이미지 및 모임 정보 표시
  - 모임 소개 / 멤버 탭
  - 모임 상세 정보: 장소, 일정, 정원, 생성일
  - 멤버 목록: 아바타, 이름, 역할 (리더/멤버)
  - 가입 신청 버튼 (정원 마감 처리)
  - Pull to refresh 기능
  - **준비 중:** 채팅 기능 (멤버 전용)

#### 9.4 게시글 상세 페이지 구현
- **파일:** `app/community/posts/[id].js`
- **주요 기능:**
  - 게시글 제목, 카테고리, 내용 표시
  - 작성자 정보 (아바타, 이름, 작성일)
  - 조회수, 좋아요, 댓글 수 통계
  - 좋아요, 댓글 쓰기, 공유 액션 버튼
  - **준비 중:** 댓글 기능

#### 9.5 향후 개선 사항
- 커뮤니티 채팅 기능 (실시간 채팅)
- 댓글 작성 및 표시 기능
- 게시글 작성 다이얼로그
- 커뮤니티 생성 다이얼로그
- 가입 신청 승인/거절 (리더 전용)

### 10. Phase 3 UX/UI 개선 및 일정 기능 완성 (2025-10-20)

#### 10.1 취미 목록 UI 개선
- **파일:** `app/hobbies.js`
- **구현 내용:**
  - **필터 접기/펴기 기능:**
    - `filtersExpanded` 상태 추가
    - 필터 토글 버튼 구현 (아이콘: filter + chevron-up/down)
    - 모든 필터 섹션(카테고리, 난이도, 장소, 예산)을 조건부 렌더링
    - 기본값: 접힌 상태로 화면 공간 절약
  - **2열 그리드 레이아웃:**
    - FlatList에 `numColumns={2}` 적용
    - 카드 스타일 최적화 (flex: 1, marginHorizontal: 6)
    - 이미지 높이 축소 (180px → 140px)
    - 텍스트 크기 조정 (제목: 20px → 16px, 설명: 14px → 13px)
    - 더 많은 취미를 한 화면에 표시 가능

#### 10.2 게시글 좋아요 버그 수정
- **문제:** 게시글 상세 페이지에서 좋아요 클릭 후 뒤로가기 시 상태가 유지되지 않음
- **해결 방법:**
  - **파일:** `app/community/posts/[id].js`
    - `DeviceEventEmitter` import 추가
    - `handleLike` 함수에서 `POST_LIKE_CHANGED` 이벤트 발송
    - 이벤트 리스너 추가로 자신의 좋아요 상태 동기화
  - **파일:** `app/community.js`
    - `DeviceEventEmitter` import 추가
    - `POST_LIKE_CHANGED` 이벤트 리스너 추가
    - 게시글 목록에서 해당 게시글의 좋아요 수 실시간 업데이트
- **결과:**
  - ✅ 게시글 상세 → 좋아요 클릭 → 뒤로가기 시 좋아요 수 유지
  - ✅ 게시글 목록에서도 즉시 좋아요 수 반영

#### 10.3 일정/스케줄 기능 완성
- **API 추가:** `api/userService.js`
  - `createScheduleAPI(scheduleData)` 함수 추가
  - POST 요청으로 새 일정 생성
  - 필수 필드: title, type, date, time
  - 선택 필드: location

- **컴포넌트 생성:** `components/AddScheduleModal.js`
  - 전체 화면 모달 UI
  - 입력 필드:
    - 제목 (TextInput)
    - 유형 (Picker: 수업/연습/모임/행사)
    - 날짜 (TextInput, 형식: YYYY-MM-DD)
    - 시간 (TextInput, 형식: HH:MM)
    - 장소 (TextInput, 선택사항)
  - 유효성 검증 (제목, 날짜, 시간 필수)
  - 제출 후 자동으로 일정 목록 새로고침

- **마이페이지 일정 탭 개선:** `app/my-page.js`
  - "일정 추가" 버튼 추가 (주황색, 플러스 아이콘)
  - AddScheduleModal 통합
  - 일정 카드 UI 완전 재설계:
    - 유형별 색상 코딩 (왼쪽 4px 인디케이터 + 배지):
      - 수업(class): 파랑(#3b82f6)
      - 연습(practice): 초록(#10b981)
      - 모임(meeting): 보라(#8b5cf6)
      - 행사(event): 주황(#f97316)
    - 상세 정보 표시:
      - 날짜 (아이콘 + 요일 포함)
      - 시간 (아이콘 + HH:MM)
      - 장소 (아이콘 + 위치명)
  - 다가오는 일정만 표시 (과거 일정 자동 필터링)
  - Empty state 개선 (아이콘 + 메시지 + 서브텍스트)

- **결과:**
  - ✅ 웹 버전과 동일한 일정 관리 기능 완성
  - ✅ 직관적이고 시각적으로 개선된 UI
  - ✅ 유형별 색상으로 일정을 쉽게 구분 가능

### 11. Phase 4 핵심 개선 및 확장 (2025-10-20)

#### 11.1 새로운 페이지 4개 추가

##### 11.1.1 Home 페이지 (`app/home.js`)
- **구현 내용:**
  - HeroSection: 히어로 이미지 + CTA 버튼 ("설문 시작하기")
  - HobbyCategories: 6개 카테고리 그리드 (운동/스포츠, 예술/창작, 음악, 요리, 야외활동, 기타)
  - FeaturedGroups: 추천 모임 Horizontal ScrollView
  - HowItWorks: 이용 방법 3단계 안내
  - Testimonials: 사용자 후기 3개
  - CTASection: 추가 액션 유도 섹션
  - Footer: 서비스 링크 (회사 소개, FAQ, 문의하기)
- **네비게이션:** `app/index.js`가 `/home`으로 자동 리다이렉트

##### 11.1.2 About 페이지 (`app/about.js`)
- **구현 내용:**
  - 우리의 미션 카드
  - 통계 카드 4개 (12,000+ 활동 회원, 500+ 활동 모임, 123+ 취미 카테고리, 95% 회원 만족도)
  - 연락처 정보 (이메일, 주소, 전화번호)
  - Feather 아이콘 사용

##### 11.1.3 FAQ 페이지 (`app/faq.js`)
- **구현 내용:**
  - 9개 자주 묻는 질문
  - Accordion UI (토글 펼치기/접기)
  - CTA 섹션 (추가 문의 안내)
  - Contact 페이지로 이동 링크

##### 11.1.4 Contact 페이지 (`app/contact.js`)
- **구현 내용:**
  - 연락처 정보 카드 3개 (이메일, 전화, 주소)
  - 문의 폼 (이름, 이메일, 제목, 메시지)
  - 유효성 검증
  - 폼 제출 처리 (임시 구현)

#### 11.2 커뮤니티 이미지 버그 수정
- **문제:** 서버에 업로드된 커뮤니티 이미지가 모바일 앱에서 기본 로고로만 표시됨
- **원인:**
  - 웹 프로젝트는 상대 경로(`/uploads/communities/image.jpg`)로 이미지 저장
  - 모바일 앱의 `getImageSource()` 함수가 이를 `hobbyImages` 매핑에서만 찾으려 함
  - 서버 업로드 이미지는 절대 URL로 변환되어야 함
- **해결 방법:**
  - **파일:** `app/community.js`
  - `API_BASE_URL` 상수 추가 (`http://172.30.1.60:3000`)
  - `getImageSource()` 함수 업데이트:
    - 상대 경로 중 `uploads` 또는 `public` 포함 → 절대 URL로 변환
    - 그 외 상대 경로 → `hobbyImages` 매핑 사용
    - HTTP URL → 그대로 사용
- **결과:** ✅ 서버 업로드 커뮤니티 이미지가 정상 표시됨

#### 11.3 OAuth 소셜 로그인 구현
- **구현 화면:**
  - **OAuthWebViewScreen** (`app/oauth-webview.js`): WebView 기반 OAuth 인증 처리
  - **LoginScreen** (`app/login.js`): 소셜 로그인 버튼 3개 추가
  - **SignupScreen** (`app/signup.js`): 소셜 회원가입 버튼 3개 추가

- **지원하는 OAuth 제공자:**
  - 카카오 (Kakao): 노란색 배경 (#FEE500)
  - 네이버 (Naver): 초록색 배경 (#03C75A)
  - 구글 (Google): 흰색 배경 + 테두리

- **동작 흐름:**
  1. 사용자가 소셜 로그인 버튼 클릭
  2. OAuthWebViewScreen 모달 열림
  3. WebView에서 OAuth 제공자 인증 페이지 로드
  4. 사용자 인증 완료 후 콜백 URL로 리다이렉트
  5. 웹 서버(`/api/auth/{provider}/callback`)가 처리:
     - 액세스 토큰 획득
     - 사용자 정보 조회
     - DB에 사용자 생성/조회
     - 세션 생성
  6. 신규 사용자 → `/survey`, 기존 사용자 → `/dashboard`로 리다이렉트
  7. 모바일 앱이 URL 변경 감지하여 해당 화면으로 자동 이동

- **필요한 패키지:**
  - `react-native-webview` (이미 설치됨)

- **주의사항:**
  - OAuth Client ID는 환경 변수로 관리 (현재 임시 값 사용)
  - 프로덕션 환경에서는 Native SDK 사용 권장

#### 11.4 프로필 수정 기능 완성
- **구현 컴포넌트:**
  - **EditProfileModal** (`components/EditProfileModal.js`): 전체 화면 모달
  - 마이페이지(`app/my-page.js`)의 "프로필 수정" 버튼과 연동

- **구현 기능:**
  - **이미지 업로드:**
    - `expo-image-picker` 사용 (자동 설치됨)
    - 갤러리에서 사진 선택
    - 1:1 비율로 크롭
    - 프로필 아바타에 즉시 미리보기
    - 카메라 버튼 오버레이
  - **프로필 정보 수정:**
    - 이름 (필수)
    - 나이 (필수)
    - 거주 지역 (필수, Picker 17개 지역)
    - 전화번호 (선택)
  - **유효성 검증:**
    - 이름: 빈 값 체크
    - 나이: 1~150 범위 체크
  - **API 연동:**
    - `updateUserProfile()` 함수 추가 (`api/userService.js`)
    - 이미지 파일 있을 때: FormData로 multipart/form-data 전송
    - 이미지 없을 때: JSON 데이터만 전송
  - **성공 후 동작:**
    - Alert로 성공 메시지 표시
    - 마이페이지 데이터 자동 새로고침
    - 모달 닫기

- **설치된 패키지:**
  - `expo-image-picker` (Phase 4에서 추가 설치)

- **결과:**
  - ✅ 프로필 정보 수정 가능
  - ✅ 프로필 사진 업로드/변경 가능
  - ✅ 즉시 마이페이지에 반영됨

#### 11.5 네비게이션 업데이트
- **파일:** `app/_layout.js`
- **추가된 화면:**
  - `home` (headerShown: false)
  - `about` (headerShown: false)
  - `faq` (headerShown: false)
  - `contact` (headerShown: false)
  - `oauth-webview` (headerShown: false, presentation: 'modal')

---

## 🛠️ 다음 진행 계획 (Next Steps)

### Phase 5: 추가 기능 (선택)
1.  **커뮤니티 채팅 기능**
    - 실시간 채팅 구현
    - WebSocket 또는 Polling 방식

2.  **댓글 기능**
    - 게시글 댓글 작성/조회
    - 댓글 좋아요 기능

3.  **게시글 작성 기능**
    - 게시글 작성 화면 구현
    - 이미지 첨부 기능

4.  **알림 기능**
    - Push 알림 설정
    - 알림 목록 페이지

5.  **취미 목록 이미지 완성**
    - 누락된 이미지 파일 추가
    - `hobbyImages.js` 매핑 완성

---
### 마지막 채팅내역(확인!)

---

## 📝 주요 기술 스택 (Tech Stack)

- **Frontend (Mobile):** React Native, Expo, Expo Router
- **Backend API:** Next.js (기존 웹 프로젝트)
- **Database:** MySQL (Drizzle ORM)
- **Authentication:** JWT (JSON Web Token)
- **Storage:** expo-secure-store (토큰 저장)
- **State Management:** React Hooks (useState, useEffect, useFocusEffect)
- **Event System:** DeviceEventEmitter (전역 상태 동기화)
- **UI Components:**
  - @react-native-picker/picker (드롭다운 선택)
  - Modal (일정 추가, 프로필 수정 등 커스텀 모달)
  - FlatList (리스트 렌더링, 2열 그리드)
  - WebView (react-native-webview: OAuth 인증)
- **Icons:** @expo/vector-icons (Feather, Ionicons)
- **Image & Media:**
  - expo-image-picker (프로필 사진 업로드)
  - Image (이미지 표시)

---

## 🔍 주요 문제 해결 사례

### 1. 마이페이지 실시간 동기화 문제
**문제:** 다른 페이지에서 좋아요를 누르면 마이페이지에 즉시 반영되지 않음

**해결:** `DeviceEventEmitter`를 사용한 전역 이벤트 시스템 구현으로 모든 페이지가 실시간으로 동기화되도록 개선

### 2. Drizzle ORM 쿼리 오류
**문제:** 기존 `.get()` 메서드가 없어 서버 에러 발생

**해결:** Drizzle 최신 문법에 맞게 `.then()` 또는 `await` 사용으로 수정

### 3. 이미지 경로 문제
**문제:** 한글 파일명, 동적 경로 등으로 인한 이미지 로딩 실패

**해결:** 모든 이미지를 영문 이름으로 변경하고 `hobbyImages.js`를 통한 정적 매핑 방식 도입

### 4. 게시글 좋아요 상태 지속성 문제 (2025-10-20)
**문제:** 게시글 상세 페이지에서 좋아요를 클릭한 후 뒤로가기를 하면 게시글 목록에서 좋아요 수가 원래대로 돌아감

**원인:**
- 게시글 상세 페이지에서 로컬 상태만 업데이트
- API 호출 없이 UI만 변경 (TODO 주석만 있음)
- 뒤로가기 시 게시글 목록은 이전 데이터 그대로 유지

**해결:**
- `DeviceEventEmitter`를 활용한 실시간 동기화 구현
- 게시글 상세 페이지 (`app/community/posts/[id].js`):
  - `handleLike` 함수에서 `POST_LIKE_CHANGED` 이벤트 발송
  - 이벤트 리스너로 자신의 좋아요 상태 동기화
- 게시글 목록 페이지 (`app/community.js`):
  - `POST_LIKE_CHANGED` 이벤트 리스너 추가
  - 해당 게시글의 좋아요 수 실시간 업데이트

**결과:** ✅ 게시글 상세 페이지와 목록 페이지 간 좋아요 상태 완벽 동기화

---

## 💡 참고사항

- 개발 환경에서 API 서버 접속을 위해 로컬 네트워크 IP 주소 사용 중
- 프로덕션 배포 시 `ngrok` 또는 실제 도메인 사용 권장
- 모든 API 요청에는 JWT 토큰이 헤더에 포함되어야 함
- 안전 영역(Safe Area) 적용으로 노치/홈 인디케이터 영역 대응 완료

---

**