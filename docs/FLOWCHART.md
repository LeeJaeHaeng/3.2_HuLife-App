# HuLife 사용자 플로우차트

## 1. 전체 사용자 여정

```mermaid
flowchart TD
    Start([앱 시작]) --> CheckAuth{로그인<br/>상태?}

    CheckAuth -->|Yes| Dashboard[대시보드]
    CheckAuth -->|No| Home[메인 페이지]

    Home --> Login[로그인]
    Home --> Signup[회원가입]
    Home --> BrowseHobbies[취미 둘러보기]

    Login --> EmailLogin[이메일 로그인]
    Login --> SocialLogin[소셜 로그인]

    SocialLogin --> Kakao[카카오 OAuth]
    SocialLogin --> Naver[네이버 OAuth]
    SocialLogin --> Google[구글 OAuth]

    Kakao --> Browser[외부 브라우저]
    Naver --> Browser
    Google --> Browser

    Browser --> ServerCallback[서버 콜백 처리]
    ServerCallback --> CheckSurvey{설문<br/>완료?}

    CheckSurvey -->|No| Survey[설문조사]
    CheckSurvey -->|Yes| Dashboard

    EmailLogin --> Dashboard
    Signup --> Survey

    Dashboard --> MyInterests[관심 취미]
    Dashboard --> MyCommunities[참여 모임]
    Dashboard --> MySchedules[일정 관리]
    Dashboard --> Recommendations[추천 취미]

    BrowseHobbies --> HobbyList[취미 목록]
    HobbyList --> SearchFilter[검색 & 필터]
    SearchFilter --> HobbyDetail[취미 상세]

    HobbyDetail --> AddInterest[관심 추가]
    HobbyDetail --> ViewCommunity[관련 모임]
    HobbyDetail --> ViewReviews[리뷰 보기]

    Survey --> SurveyQuestions[8개 질문<br/>단계별 응답]
    SurveyQuestions --> SubmitSurvey[설문 제출]
    SubmitSurvey --> AIRecommend[AI 추천 엔진]
    AIRecommend --> RecommendResults[추천 결과<br/>매칭도 표시]

    RecommendResults --> AddInterest
    RecommendResults --> HobbyDetail

    ViewCommunity --> CommunityList[모임 목록]
    CommunityList --> CommunitySearch[검색 & 필터]
    CommunitySearch --> CommunityDetail[모임 상세]

    CommunityDetail --> CheckMember{멤버<br/>상태?}

    CheckMember -->|비회원| JoinRequest[가입 신청]
    CheckMember -->|대기중| Pending[신청 대기]
    CheckMember -->|회원| MemberFeatures[회원 전용 기능]

    JoinRequest --> WaitApproval[승인 대기]

    MemberFeatures --> Chat[실시간 채팅]
    MemberFeatures --> Posts[게시판]
    MemberFeatures --> LeaveCommunity[모임 탈퇴]

    Posts --> PostList[게시글 목록]
    PostList --> PostDetail[게시글 상세]
    PostList --> CreatePost[글쓰기]

    PostDetail --> EditPost[수정]
    PostDetail --> DeletePost[삭제]

    Chat --> SendMessage[메시지 전송]
    Chat --> ViewMessages[메시지 조회<br/>3초 폴링]

    CommunityDetail --> CheckLeader{리더<br/>권한?}
    CheckLeader -->|Yes| ManageRequests[가입 신청 관리]

    ManageRequests --> ApproveRequest[승인]
    ManageRequests --> RejectRequest[거절]

    Dashboard --> MyPage[마이페이지]
    MyPage --> EditProfile[프로필 수정]
    MyPage --> ViewStats[활동 통계]
    MyPage --> Logout[로그아웃]

    Logout --> Home
```

## 2. OAuth 소셜 로그인 상세 플로우

```mermaid
sequenceDiagram
    participant User as 사용자
    participant App as 모바일 앱
    participant Browser as 외부 브라우저
    participant Server as Next.js 서버
    participant OAuth as OAuth 제공자
    participant DB as 데이터베이스

    User->>App: 소셜 로그인 버튼 클릭
    App->>User: 안내 다이얼로그 표시
    User->>App: 확인

    App->>Browser: Linking.openURL(OAuth URL)
    Note over Browser: http://192.168.0.40:3000/api/auth/kakao

    Browser->>Server: GET /api/auth/kakao
    Server->>Browser: OAuth 인증 페이지로 리다이렉트

    Browser->>OAuth: 사용자 인증 요청
    User->>OAuth: 로그인 & 동의
    OAuth->>Browser: 인증 코드 반환

    Browser->>Server: GET /api/auth/kakao/callback?code=xxx
    Server->>OAuth: 액세스 토큰 요청 (code)
    OAuth->>Server: 액세스 토큰 반환

    Server->>OAuth: 사용자 정보 요청 (token)
    OAuth->>Server: 사용자 정보 반환

    Server->>DB: 사용자 저장/업데이트
    DB->>Server: 저장 완료

    Server->>Server: 세션 생성 (쿠키)

    alt 설문 미완료
        Server->>Browser: redirect(/survey)
    else 설문 완료
        Server->>Browser: redirect(/dashboard)
    end

    User->>App: 앱으로 수동 복귀
    App->>Server: GET /api/auth/me (세션 확인)
    Server->>App: 사용자 정보 반환
    App->>User: Dashboard 또는 Survey 화면 표시
```

## 3. 설문 & 추천 시스템 플로우

```mermaid
flowchart TD
    Start([설문 시작]) --> Q1[질문 1/8<br/>야외 활동 선호도]
    Q1 --> Q2[질문 2/8<br/>자연 선호도]
    Q2 --> Q3[질문 3/8<br/>사회적 활동]
    Q3 --> Q4[질문 4/8<br/>새로운 사람 만나기]
    Q4 --> Q5[질문 5/8<br/>창의적 활동]
    Q5 --> Q6[질문 6/8<br/>예술적 표현]
    Q6 --> Q7[질문 7/8<br/>신체 활동]
    Q7 --> Q8[질문 8/8<br/>예산 수준]

    Q8 --> Submit[설문 제출]
    Submit --> SaveDB[(surveyResponses<br/>테이블 저장)]

    SaveDB --> CreateProfile[사용자 프로필 생성]
    CreateProfile --> Normalize[응답 정규화<br/>1-5 → 0-1]

    Normalize --> Profile{사용자 프로필}
    Profile --> Outdoor[실내/외 선호도]
    Profile --> Social[사회성 선호도]
    Profile --> Creative[창의성 선호도]
    Profile --> Physical[신체활동 선호도]
    Profile --> Budget[예산 선호도]

    Outdoor --> Engine[RecommendationEngine]
    Social --> Engine
    Creative --> Engine
    Physical --> Engine
    Budget --> Engine

    Engine --> LoadHobbies[(hobbies<br/>테이블 123개)]

    LoadHobbies --> Calculate[매칭 점수 계산]

    Calculate --> Weight1[실내/외 매칭 25%]
    Calculate --> Weight2[사회성 매칭 25%]
    Calculate --> Weight3[창의성 매칭 20%]
    Calculate --> Weight4[신체활동 20%]
    Calculate --> Weight5[예산 5%]
    Calculate --> Weight6[난이도 5%]

    Weight1 --> TotalScore[총점 0-100]
    Weight2 --> TotalScore
    Weight3 --> TotalScore
    Weight4 --> TotalScore
    Weight5 --> TotalScore
    Weight6 --> TotalScore

    TotalScore --> Sort[매칭도 높은 순 정렬]
    Sort --> Top6[상위 6개 선택]

    Top6 --> Reasons[개인화된 추천 이유 생성]
    Reasons --> Reason1[이유 1: 실내/외 적합성]
    Reasons --> Reason2[이유 2: 사회성 매칭]
    Reasons --> Reason3[이유 3: 창의성/난이도/예산]

    Reason1 --> Display[추천 결과 표시]
    Reason2 --> Display
    Reason3 --> Display

    Display --> ShowCard[취미 카드<br/>매칭도 % + 이유 3개]
    ShowCard --> UserAction{사용자 액션}

    UserAction -->|관심 추가| AddInterest[userHobbies 저장]
    UserAction -->|자세히 보기| HobbyDetail[취미 상세 페이지]
    UserAction -->|설문 재시도| Start
    UserAction -->|모든 취미 보기| HobbyList[취미 목록]
```

## 4. 커뮤니티 가입 & 채팅 플로우

```mermaid
flowchart TD
    Start([커뮤니티 상세]) --> CheckStatus{멤버십<br/>상태 확인}

    CheckStatus --> API1[GET /api/communities/:id/membership-status]

    API1 --> Status{상태}

    Status -->|not-member| ShowJoin[가입 신청 버튼]
    Status -->|pending| ShowPending[신청 대기 중 버튼<br/>비활성]
    Status -->|member| ShowMember[회원 전용 기능]

    ShowJoin --> UserClick1[사용자 클릭]
    UserClick1 --> Confirm1[확인 다이얼로그]
    Confirm1 --> API2[POST /api/communities/:id/join-request]

    API2 --> Validate{검증}
    Validate -->|정원 초과| Error1[에러: 정원 초과]
    Validate -->|중복 신청| Error2[에러: 이미 신청함]
    Validate -->|성공| SaveRequest[(joinRequests<br/>테이블 저장<br/>status: pending)]

    SaveRequest --> UpdateUI1[UI 업데이트<br/>신청 대기 중]

    ShowPending --> WaitApproval[리더 승인 대기]

    ShowMember --> MemberMenu{회원 메뉴}

    MemberMenu --> ChatBtn[모임 채팅]
    MemberMenu --> PostBtn[게시판]
    MemberMenu --> LeaveBtn[모임 탈퇴]

    ChatBtn --> GetChatRoom[GET /api/communities/:id/chat-room]
    GetChatRoom --> ChatScreen[CommunityChatScreen]

    ChatScreen --> LoadMessages[GET /api/chat/:roomId/messages]
    LoadMessages --> DisplayChat[FlatList<br/>메시지 표시]

    DisplayChat --> Polling[3초마다 폴링]
    Polling --> LoadMessages

    DisplayChat --> UserType[사용자 메시지 입력]
    UserType --> SendMsg[POST /api/chat/:roomId/messages]
    SendMsg --> SaveMsg[(chatMessages<br/>테이블 저장)]
    SaveMsg --> UpdateChat[채팅 화면 업데이트]
    UpdateChat --> AutoScroll[자동 스크롤]

    PostBtn --> PostList[CommunityPostListScreen]
    PostList --> FilterCategory[카테고리 필터<br/>전체/자유/질문/정보]
    FilterCategory --> ShowPosts[게시글 목록]

    ShowPosts --> ClickPost[게시글 클릭]
    ClickPost --> PostDetail[PostDetailScreen]

    ShowPosts --> ClickWrite[글쓰기 FAB]
    ClickWrite --> CreatePost[CreatePostScreen]
    CreatePost --> ValidatePost{유효성 검증}

    ValidatePost -->|제목 < 2자| ErrorTitle[에러: 제목 너무 짧음]
    ValidatePost -->|내용 < 10자| ErrorContent[에러: 내용 너무 짧음]
    ValidatePost -->|통과| SubmitPost[POST /api/posts]

    SubmitPost --> SavePost[(posts 테이블 저장)]
    SavePost --> BackToList[PostList로 돌아가기]

    LeaveBtn --> ConfirmLeave[확인 다이얼로그]
    ConfirmLeave --> APILeave[DELETE /api/communities/:id/leave]
    APILeave --> RemoveMember[(communityMembers<br/>삭제)]
    RemoveMember --> DecrementCount[memberCount - 1]
    DecrementCount --> BackToCommunityList[커뮤니티 목록]

    CheckStatus -->|isLeader| ShowLeader[리더 전용 메뉴]
    ShowLeader --> ManageBtn[가입 신청 관리<br/>Badge: 신청 수]

    ManageBtn --> GetRequests[GET /api/communities/:id/join-requests]
    GetRequests --> RequestList[JoinRequestsScreen]

    RequestList --> ShowRequestCards[신청자 카드<br/>이름/나이/지역/신청일]

    ShowRequestCards --> LeaderAction{리더 액션}

    LeaderAction -->|승인| ConfirmApprove[확인 다이얼로그]
    LeaderAction -->|거절| ConfirmReject[확인 다이얼로그]

    ConfirmApprove --> APIApprove[POST /api/communities/join-requests/:id/approve]
    APIApprove --> AddMember[(communityMembers<br/>추가)]
    AddMember --> UpdateRequest1[(joinRequests<br/>status: approved)]
    UpdateRequest1 --> IncrementCount[memberCount + 1]
    IncrementCount --> RemoveFromList1[목록에서 제거]

    ConfirmReject --> APIReject[POST /api/communities/join-requests/:id/reject]
    APIReject --> UpdateRequest2[(joinRequests<br/>status: rejected)]
    UpdateRequest2 --> RemoveFromList2[목록에서 제거]
```

## 5. 마이페이지 & 일정 관리 플로우

```mermaid
flowchart TD
    Start([MyPage 진입]) --> LoadProfile[프로필 정보 로드]

    LoadProfile --> API1[GET /api/auth/me]
    API1 --> DisplayProfile[프로필 카드 표시<br/>아바타/이름/나이/지역]

    DisplayProfile --> Stats[활동 통계]
    Stats --> Stat1[관심 취미 수]
    Stats --> Stat2[참여 모임 수]
    Stats --> Stat3[완료 취미 수]

    DisplayProfile --> Tabs{탭 선택}

    Tabs -->|관심 취미| Tab1[관심 취미 탭]
    Tabs -->|참여 모임| Tab2[참여 모임 탭]
    Tabs -->|일정| Tab3[일정 탭]

    Tab1 --> LoadHobbies[GET /api/user/hobbies]
    LoadHobbies --> HobbyCards[취미 카드 표시]
    HobbyCards --> Progress[진행도 Progress Bar]
    HobbyCards --> Status[상태: interested/<br/>learning/completed]

    Tab2 --> LoadCommunities[GET /api/user/communities]
    LoadCommunities --> CommunityCards[모임 카드 표시]
    CommunityCards --> ClickCommunity[클릭]
    ClickCommunity --> CommunityDetail[모임 상세]

    Tab3 --> Calendar[캘린더 컴포넌트]
    Calendar --> LoadSchedules[GET /api/user/schedules]
    LoadSchedules --> DisplayDates[날짜에 색상 점 표시]

    DisplayDates --> ClickDate[날짜 클릭]
    ClickDate --> ShowSchedules[해당 날짜 일정 목록]

    ShowSchedules --> ScheduleCard[일정 카드<br/>제목/시간/장소/타입]
    ScheduleCard --> TypeColor{타입별 색상}

    TypeColor -->|class| Blue[파란색]
    TypeColor -->|practice| Green[초록색]
    TypeColor -->|meeting| Orange[주황색]
    TypeColor -->|event| Purple[보라색]

    Calendar --> AddBtn[일정 추가 버튼]
    AddBtn --> AddModal[AddScheduleModal]

    AddModal --> Input1[제목 입력]
    AddModal --> Input2[취미 선택]
    AddModal --> Input3[날짜 선택]
    AddModal --> Input4[시간 입력]
    AddModal --> Input5[장소 입력]
    AddModal --> Input6[타입 선택]

    Input1 --> Validate{유효성 검증}
    Input2 --> Validate
    Input3 --> Validate
    Input4 --> Validate
    Input5 --> Validate
    Input6 --> Validate

    Validate -->|실패| ErrorMsg[에러 메시지]
    Validate -->|성공| Submit[POST /api/user/schedules]

    Submit --> SaveSchedule[(schedules<br/>테이블 저장)]
    SaveSchedule --> CloseModal[모달 닫기]
    CloseModal --> Refresh[캘린더 새로고침]

    DisplayProfile --> EditBtn[프로필 수정 버튼]
    EditBtn --> EditModal[EditProfileModal]

    EditModal --> EditName[이름 수정]
    EditModal --> EditAge[나이 수정]
    EditModal --> EditLocation[지역 수정]
    EditModal --> EditPhone[전화번호 수정]
    EditModal --> EditImage[프로필 이미지 업로드]

    EditImage --> ImagePicker[ImagePicker]
    ImagePicker --> UploadImage[이미지 업로드]

    EditName --> SaveProfile[저장 버튼]
    EditAge --> SaveProfile
    EditLocation --> SaveProfile
    EditPhone --> SaveProfile
    UploadImage --> SaveProfile

    SaveProfile --> API2[PUT /api/user/profile]
    API2 --> UpdateDB[(users 테이블 업데이트)]
    UpdateDB --> CloseEdit[모달 닫기]
    CloseEdit --> RefreshProfile[프로필 새로고침]

    DisplayProfile --> LogoutBtn[로그아웃 버튼]
    LogoutBtn --> ConfirmLogout[확인 다이얼로그]
    ConfirmLogout --> ClearStorage[AsyncStorage.clear]
    ClearStorage --> Home[홈 화면으로 이동]
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

### 4. 마크다운 뷰어
- Typora, Obsidian 등 Mermaid를 지원하는 마크다운 에디터 사용
