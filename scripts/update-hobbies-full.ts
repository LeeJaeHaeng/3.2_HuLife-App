import { db } from "../lib/db/index.js";
import { hobbies } from "../lib/db/schema.js";
import { eq } from "drizzle-orm";

const hobbyData: Record<string, { videoUrl: string; curriculum: { week: number; title: string; content: string }[] }> = {
  "수채화": {
    videoUrl: "https://www.youtube.com/watch?v=ZZKo1W9aalo",
    curriculum: [
      { week: 1, title: "수채화 기초", content: "물과 물감의 비율, 붓 사용법, 기본 색채 이론 학습" },
      { week: 2, title: "기본 기법 연습", content: "번지기, 그라데이션, 드라이브러시 기법 익히기" },
      { week: 3, title: "정물화 실습", content: "과일과 꽃을 주제로 한 정물화 그리기" },
      { week: 4, title: "풍경화 기초", content: "하늘, 나무, 물 표현 기법 연습" },
      { week: 5, title: "명암과 원근법", content: "빛과 그림자 표현, 원근감 있는 그림 그리기" },
      { week: 6, title: "색채 혼합", content: "다양한 색 만들기와 조화로운 배색 학습" },
      { week: 7, title: "풍경화 실습", content: "실제 풍경을 보고 수채화로 표현하기" },
      { week: 8, title: "개인 작품 제작", content: "배운 기법을 활용한 자유 주제 작품 완성" }
    ]
  },
  "서예": {
    videoUrl: "https://www.youtube.com/watch?v=kEAGl41xPLM",
    curriculum: [
      { week: 1, title: "서예 도구와 자세", content: "붓, 먹, 벼루 사용법과 올바른 집필 자세" },
      { week: 2, title: "기본 획 연습", content: "가로획, 세로획, 삐침, 꺾임 등 기본 획 익히기" },
      { week: 3, title: "한글 서예 기초", content: "자음과 모음의 기본 쓰기 연습" },
      { week: 4, title: "한자 서예 기초", content: "간단한 한자 쓰기와 필순 익히기" },
      { week: 5, title: "글씨체 연습", content: "정자체와 흘림체 비교 학습" },
      { week: 6, title: "시와 문구 쓰기", content: "짧은 시나 명언을 서예로 작성" },
      { week: 7, title: "작품 구성", content: "낙관과 여백의 아름다움 이해하기" },
      { week: 8, title: "완성 작품 제작", content: "족자나 액자용 서예 작품 완성" }
    ]
  },
  "요가": {
    videoUrl: "https://www.youtube.com/watch?v=v7AYKMP6rOE",
    curriculum: [
      { week: 1, title: "요가 기본 원리", content: "호흡법과 요가의 철학 이해" },
      { week: 2, title: "기본 자세 익히기", content: "산 자세, 나무 자세, 아이 자세 등 기초 동작" },
      { week: 3, title: "유연성 향상", content: "스트레칭 중심의 동작으로 몸 풀기" },
      { week: 4, title: "균형감 기르기", content: "한 발로 서기, 워리어 자세 등 균형 동작" },
      { week: 5, title: "코어 강화", content: "복부와 허리 근력 강화 동작" },
      { week: 6, title: "호흡과 명상", content: "프라나야마 호흡법과 명상 실습" },
      { week: 7, title: "태양 경배 수련", content: "연속 동작 흐름 익히기" },
      { week: 8, title: "종합 수련", content: "배운 모든 동작을 조합한 60분 루틴" }
    ]
  },
  "원예": {
    videoUrl: "https://www.youtube.com/watch?v=9Lz92TOrLhU",
    curriculum: [
      { week: 1, title: "원예 기초 지식", content: "흙, 비료, 물주기의 기본 원리" },
      { week: 2, title: "계절별 식물 선택", content: "사계절 키울 수 있는 식물 알아보기" },
      { week: 3, title: "씨앗 파종", content: "씨앗 뿌리기와 발아 조건 이해" },
      { week: 4, title: "모종 심기", content: "모종 선택과 심는 방법 실습" },
      { week: 5, title: "병충해 관리", content: "식물 질병 예방과 친환경 방제법" },
      { week: 6, title: "가지치기와 순치기", content: "식물 성장 관리 기술 익히기" },
      { week: 7, title: "화분 정원 꾸미기", content: "베란다나 실내 정원 디자인" },
      { week: 8, title: "수확과 보관", content: "채소와 허브 수확 및 저장 방법" }
    ]
  },
  "등산": {
    videoUrl: "https://www.youtube.com/watch?v=fFJHH5g-GBQ",
    curriculum: [
      { week: 1, title: "등산 장비와 복장", content: "등산화, 배낭, 옷차림 선택 가이드" },
      { week: 2, title: "기초 체력 훈련", content: "계단 오르기, 걷기로 체력 기르기" },
      { week: 3, title: "저지대 산 실습", content: "3시간 이내 코스로 등산 경험" },
      { week: 4, title: "등산 안전 수칙", content: "날씨 확인, 응급처치, 조난 대비법" },
      { week: 5, title: "트레킹 폴 사용법", content: "스틱 활용으로 무릎 보호하기" },
      { week: 6, title: "중급 코스 도전", content: "5시간 정도 소요되는 산 오르기" },
      { week: 7, title: "산행 예절과 환경", content: "자연 보호와 등산 문화 배우기" },
      { week: 8, title: "종주 산행", content: "하루 종일 걷는 긴 코스 완주" }
    ]
  },
  "사진 촬영": {
    videoUrl: "https://www.youtube.com/watch?v=V7z7BAZdt2M",
    curriculum: [
      { week: 1, title: "카메라 기초", content: "조리개, 셔터속도, ISO 이해하기" },
      { week: 2, title: "구도와 프레이밍", content: "3분할 법칙, 황금비율 활용" },
      { week: 3, title: "빛의 이해", content: "자연광, 역광, 측광 촬영 기법" },
      { week: 4, title: "인물 사진", content: "표정, 각도, 배경 활용 인물 촬영" },
      { week: 5, title: "풍경 사진", content: "원근감과 계절감 담는 풍경 촬영" },
      { week: 6, title: "접사 촬영", content: "꽃과 작은 피사체 클로즈업" },
      { week: 7, title: "보정 기초", content: "스마트폰/컴퓨터로 사진 편집" },
      { week: 8, title: "포트폴리오 제작", content: "주제별 사진 시리즈 완성" }
    ]
  },
  "탁구": {
    videoUrl: "https://www.youtube.com/watch?v=pJRNIpY4dQg",
    curriculum: [
      { week: 1, title: "탁구 기본 규칙", content: "경기 방법, 점수 계산, 서브 규칙" },
      { week: 2, title: "그립과 자세", content: "라켓 잡는 법과 기본 스탠스" },
      { week: 3, title: "포핸드 스트로크", content: "앞쪽으로 치는 기본 타법 연습" },
      { week: 4, title: "백핸드 스트로크", content: "뒤쪽으로 치는 타법 익히기" },
      { week: 5, title: "서브 연습", content: "다양한 서브 기술 배우기" },
      { week: 6, title: "리시브와 랠리", content: "서브 받기와 공 주고받기 실전" },
      { week: 7, title: "스핀 기술", content: "톱스핀, 백스핀 회전 걸기" },
      { week: 8, title: "실전 경기", content: "복식과 단식 게임 경험" }
    ]
  },
  "바둑": {
    videoUrl: "https://www.youtube.com/watch?v=xMshtO8h7RY",
    curriculum: [
      { week: 1, title: "바둑 규칙", content: "바둑판 이해, 돌 놓는 법, 기본 규칙" },
      { week: 2, title: "돌의 삶과 죽음", content: "집과 눈, 돌이 사는 조건" },
      { week: 3, title: "기본 정석", content: "모서리 포석의 기초 수순" },
      { week: 4, title: "수읽기 연습", content: "몇 수 앞을 내다보는 연습" },
      { week: 5, title: "집 계산", content: "영역 계산과 승부 판단" },
      { week: 6, title: "중반 전략", content: "공격과 수비 타이밍 익히기" },
      { week: 7, title: "끝내기", content: "요세와 마무리 기술" },
      { week: 8, title: "실전 대국", content: "19줄판 정식 대국 경험" }
    ]
  },
  "기타": {
    videoUrl: "https://www.youtube.com/watch?v=ytOaYC00gWw",
    curriculum: [
      { week: 1, title: "기타 구조와 튜닝", content: "기타 부위 이름과 조율하는 법" },
      { week: 2, title: "기본 자세와 운지법", content: "앉는 자세, 왼손 오른손 기본 동작" },
      { week: 3, title: "개방현 코드", content: "C, G, Am, Em 등 기본 코드" },
      { week: 4, title: "스트로밍 패턴", content: "다양한 리듬으로 치는 연습" },
      { week: 5, title: "바레 코드", content: "검지로 여러 줄 누르는 기술" },
      { week: 6, title: "핑거스타일 기초", content: "손가락으로 뜯는 주법" },
      { week: 7, title: "쉬운 곡 연주", content: "동요나 가요 1-2곡 완성" },
      { week: 8, title: "반주와 노래", content: "노래하며 기타 반주하기" }
    ]
  },
  "노래교실": {
    videoUrl: "https://www.youtube.com/watch?v=mBh1YE1gFk0",
    curriculum: [
      { week: 1, title: "발성 기초", content: "복식호흡과 바른 발성법 익히기" },
      { week: 2, title: "음정과 박자", content: "음계 부르기와 리듬 맞추기" },
      { week: 3, title: "트로트 기초", content: "한국 전통 가요 부르기" },
      { week: 4, title: "가요 연습", content: "7080 세대 인기곡 배우기" },
      { week: 5, title: "호흡 조절", content: "긴 음표 부르기와 숨 쉬는 타이밍" },
      { week: 6, title: "감정 표현", content: "노래에 감정 담아 부르기" },
      { week: 7, title: "마이크 사용법", content: "노래방에서 잘 부르는 기술" },
      { week: 8, title: "발표회", content: "배운 곡 무대에서 발표하기" }
    ]
  },
  "독서토론": {
    videoUrl: "https://www.youtube.com/watch?v=1L91w7P0IqI",
    curriculum: [
      { week: 1, title: "독서토론 소개", content: "토론의 목적과 진행 방식 이해" },
      { week: 2, title: "책 선정과 읽기", content: "함께 읽을 도서 선택과 독서" },
      { week: 3, title: "질문 만들기", content: "책 내용에 대한 토론 질문 준비" },
      { week: 4, title: "의견 나누기", content: "자신의 생각 정리하고 발표하기" },
      { week: 5, title: "경청과 반론", content: "타인 의견 듣고 존중하며 반박하기" },
      { week: 6, title: "논리적 사고", content: "근거를 들어 주장 펼치기" },
      { week: 7, title: "다양한 관점", content: "여러 해석과 시각 이해하기" },
      { week: 8, title: "종합 토론", content: "심화 주제로 자유 토론 진행" }
    ]
  },
  "합창": {
    videoUrl: "https://www.youtube.com/watch?v=N7hJbKTDV3s",
    curriculum: [
      { week: 1, title: "합창의 기초", content: "파트 구분과 하모니 이해" },
      { week: 2, title: "발성 훈련", content: "단체 발성 연습과 음정 맞추기" },
      { week: 3, title: "호흡 조절", content: "함께 호흡하며 소리 내기" },
      { week: 4, title: "2부 합창", content: "두 파트로 나뉘어 노래하기" },
      { week: 5, title: "4부 합창", content: "소프라노, 알토, 테너, 베이스" },
      { week: 6, title: "리듬과 박자", content: "지휘자 보며 정확한 템포 유지" },
      { week: 7, title: "표현력 향상", content: "곡의 감정과 다이나믹 살리기" },
      { week: 8, title: "공연 준비", content: "무대 매너와 합창 발표회" }
    ]
  },
  "국악": {
    videoUrl: "https://www.youtube.com/watch?v=wqeMd7n15_w",
    curriculum: [
      { week: 1, title: "국악 개론", content: "국악의 종류와 역사 이해" },
      { week: 2, title: "장단 익히기", content: "기본 장단(중중모리, 자진모리 등)" },
      { week: 3, title: "판소리 감상", content: "춘향가, 심청가 등 명창 듣기" },
      { week: 4, title: "민요 부르기", content: "아리랑, 도라지 등 지역 민요" },
      { week: 5, title: "농악 체험", content: "꽹과리, 장구 등 타악기 연주" },
      { week: 6, title: "사물놀이", content: "네 가지 악기 앙상블 배우기" },
      { week: 7, title: "전통 춤", content: "국악에 맞춰 춤사위 익히기" },
      { week: 8, title: "종합 공연", content: "국악 공연 관람 또는 발표" }
    ]
  },
  "영화 감상": {
    videoUrl: "https://www.youtube.com/watch?v=Ke1Y3P9D0Bc",
    curriculum: [
      { week: 1, title: "영화의 이해", content: "영화 문법과 용어 배우기" },
      { week: 2, title: "고전 명화", content: "흑백 영화와 영화사의 걸작" },
      { week: 3, title: "장르별 감상", content: "드라마, 코미디, 스릴러 등" },
      { week: 4, title: "감독과 스타일", content: "거장 감독의 작품 세계" },
      { week: 5, title: "영화 분석", content: "촬영 기법, 편집, 음악 분석" },
      { week: 6, title: "한국 영화", content: "한국 영화의 역사와 명작" },
      { week: 7, title: "토론과 비평", content: "영화 감상 후 의견 나누기" },
      { week: 8, title: "영화제 체험", content: "영화제 관람 또는 특별 상영" }
    ]
  },
  "역사 공부": {
    videoUrl: "https://www.youtube.com/watch?v=rYQOdORErsY",
    curriculum: [
      { week: 1, title: "한국사 개관", content: "고조선부터 현대까지 흐름" },
      { week: 2, title: "삼국시대", content: "고구려, 백제, 신라의 역사" },
      { week: 3, title: "고려시대", content: "고려의 건국과 문화유산" },
      { week: 4, title: "조선시대", content: "조선 500년의 역사와 문화" },
      { week: 5, title: "근현대사", content: "개화기부터 대한민국 건국까지" },
      { week: 6, title: "역사 유적지", content: "문화재와 유적지 탐방" },
      { week: 7, title: "인물 탐구", content: "역사 속 주요 인물 연구" },
      { week: 8, title: "역사 토론", content: "역사적 사건에 대한 토론" }
    ]
  },
  "한문 공부": {
    videoUrl: "https://www.youtube.com/watch?v=TKQjc2JBt0c",
    curriculum: [
      { week: 1, title: "한자의 기초", content: "부수와 획순, 한자의 구조" },
      { week: 2, title: "일상 한자", content: "자주 쓰는 기본 한자 100자" },
      { week: 3, title: "한자어 이해", content: "한자로 이루어진 우리말" },
      { week: 4, title: "고사성어", content: "사자성어와 그 유래" },
      { week: 5, title: "한문 문장", content: "간단한 한문 문장 읽기" },
      { week: 6, title: "천자문", content: "천자문으로 한자 익히기" },
      { week: 7, title: "명심보감", content: "고전 한문 읽고 해석하기" },
      { week: 8, title: "한시 감상", content: "한시 읽고 의미 이해하기" }
    ]
  },
  "박물관 탐방": {
    videoUrl: "https://www.youtube.com/watch?v=5LDXI0b01j8",
    curriculum: [
      { week: 1, title: "박물관 소개", content: "박물관의 종류와 관람 예절" },
      { week: 2, title: "국립중앙박물관", content: "한국 역사 유물 관람" },
      { week: 3, title: "미술관 탐방", content: "회화, 조각 등 미술품 감상" },
      { week: 4, title: "과학관", content: "과학 기술 체험 전시 관람" },
      { week: 5, title: "민속 박물관", content: "전통 생활 문화 이해" },
      { week: 6, title: "특별 전시", content: "기획 전시와 순회 전시 관람" },
      { week: 7, title: "도슨트 투어", content: "해설사와 함께하는 관람" },
      { week: 8, title: "큐레이팅", content: "나만의 전시 기획해보기" }
    ]
  },
  "수영": {
    videoUrl: "https://www.youtube.com/watch?v=5HhSPLuimportant",
    curriculum: [
      { week: 1, title: "물 적응", content: "물에 대한 두려움 극복, 호흡 연습" },
      { week: 2, title: "자유형 킥", content: "다리 차기 기본 동작" },
      { week: 3, title: "자유형 팔 동작", content: "팔 젓기와 호흡 결합" },
      { week: 4, title: "자유형 완성", content: "25m 자유형 완주" },
      { week: 5, title: "배영 기초", content: "등을 대고 수영하기" },
      { week: 6, title: "평영 배우기", content: "개구리 차기와 팔 동작" },
      { week: 7, title: "접영 체험", content: "접영의 기본 동작 이해" },
      { week: 8, title: "지구력 향상", content: "여러 영법으로 장거리 수영" }
    ]
  },
  "배드민턴": {
    videoUrl: "https://www.youtube.com/watch?v=EkSiZ-wbLLU",
    curriculum: [
      { week: 1, title: "배드민턴 규칙", content: "경기 방법과 점수 계산" },
      { week: 2, title: "그립과 자세", content: "라켓 잡는 법과 기본 스텐스" },
      { week: 3, title: "언더핸드 스트로크", content: "아래에서 치는 서브와 클리어" },
      { week: 4, title: "오버헤드 스트로크", content: "머리 위로 치는 스매싱" },
      { week: 5, title: "헤어핀과 드롭샷", content: "네트 근처 섬세한 타구" },
      { week: 6, title: "푸시와 드라이브", content: "빠른 공격 타법" },
      { week: 7, title: "복식 전략", content: "파트너와 호흡 맞추기" },
      { week: 8, title: "실전 경기", content: "토너먼트 게임 진행" }
    ]
  },
  "파크골프": {
    videoUrl: "https://www.youtube.com/watch?v=zU5lCht2yl0",
    curriculum: [
      { week: 1, title: "파크골프 소개", content: "규칙과 에티켓, 장비 이해" },
      { week: 2, title: "기본 자세", content: "그립, 스탠스, 어드레스" },
      { week: 3, title: "퍼팅 연습", content: "짧은 거리 정확하게 치기" },
      { week: 4, title: "롱샷", content: "긴 거리 비거리 내기" },
      { week: 5, title: "어프로치", content: "홀 근처 접근 샷" },
      { week: 6, title: "경사와 방향", content: "지형 읽고 방향 조절" },
      { week: 7, title: "18홀 라운딩", content: "코스 완주 경험" },
      { week: 8, title: "친선 대회", content: "조별 경기와 시상" }
    ]
  },
  "태극권": {
    videoUrl: "https://www.youtube.com/watch?v=6w7IS8_UzHY",
    curriculum: [
      { week: 1, title: "태극권 철학", content: "음양의 원리와 태극권의 역사" },
      { week: 2, title: "기본 자세", content: "마보, 궁보 등 기본 스탠스" },
      { week: 3, title: "호흡과 이완", content: "단전호흡과 몸의 긴장 풀기" },
      { week: 4, title: "24식 태극권 1", content: "기본 24동작 중 1-8동작" },
      { week: 5, title: "24식 태극권 2", content: "9-16동작 익히기" },
      { week: 6, title: "24식 태극권 3", content: "17-24동작 완성" },
      { week: 7, title: "연속 동작", content: "24동작 흐름 있게 연결" },
      { week: 8, title: "발표와 시연", content: "배운 태극권 전체 시연" }
    ]
  },
  "볼링": {
    videoUrl: "https://www.youtube.com/watch?v=KT41VS9XvMQ",
    curriculum: [
      { week: 1, title: "볼링 규칙", content: "점수 계산과 경기 방식" },
      { week: 2, title: "공 선택과 그립", content: "자신에게 맞는 공 고르기" },
      { week: 3, title: "어드레스와 스텝", content: "서는 위치와 4스텝 동작" },
      { week: 4, title: "스윙과 릴리스", content: "팔 휘두르기와 공 놓는 타이밍" },
      { week: 5, title: "스페어 처리", content: "남은 핀 쓰러뜨리기" },
      { week: 6, title: "훅볼 배우기", content: "공에 회전 주어 커브 만들기" },
      { week: 7, title: "스트라이크 노리기", content: "정확한 포켓 공략법" },
      { week: 8, title: "리그 게임", content: "팀 대항전 경기 경험" }
    ]
  },
  "게이트볼": {
    videoUrl: "https://www.youtube.com/watch?v=GQ3cGZq8V4M",
    curriculum: [
      { week: 1, title: "게이트볼 규칙", content: "경기 방법과 팀 구성" },
      { week: 2, title: "스틱 사용법", content: "스틱 잡고 공 치는 자세" },
      { week: 3, title: "게이트 통과", content: "문 통과 기술 연습" },
      { week: 4, title: "터치와 스파크", content: "공 맞추고 튕겨내기" },
      { week: 5, title: "전략 이해", content: "팀 작전과 순서 활용" },
      { week: 6, title: "골폴 타격", content: "골대 맞추는 연습" },
      { week: 7, title: "실전 연습", content: "5:5 팀 게임 진행" },
      { week: 8, title: "친선 대회", content: "토너먼트 경기 참가" }
    ]
  },
  "자전거": {
    videoUrl: "https://www.youtube.com/watch?v=lQ_hHJDgDa4",
    curriculum: [
      { week: 1, title: "자전거 점검", content: "안장 높이, 타이어, 브레이크 확인" },
      { week: 2, title: "기본 주행", content: "페달링과 균형 잡기" },
      { week: 3, title: "변속 사용법", content: "기어 변속으로 힘 조절하기" },
      { week: 4, title: "안전 수칙", content: "도로 주행 시 안전 규칙" },
      { week: 5, title: "근교 라이딩", content: "10-20km 짧은 코스 라이딩" },
      { week: 6, title: "체력 향상", content: "언덕길과 긴 거리 주행" },
      { week: 7, title: "자전거 도로", content: "한강이나 자전거 길 투어" },
      { week: 8, title: "장거리 라이딩", content: "50km 이상 코스 완주" }
    ]
  },
  "걷기": {
    videoUrl: "https://www.youtube.com/watch?v=FPqQbftO0ic",
    curriculum: [
      { week: 1, title: "올바른 걷기 자세", content: "자세, 팔 흔들기, 보폭 배우기" },
      { week: 2, title: "준비운동", content: "걷기 전후 스트레칭" },
      { week: 3, title: "하루 30분 걷기", content: "규칙적인 걷기 습관 만들기" },
      { week: 4, title: "빠르게 걷기", content: "속도를 높여 유산소 운동" },
      { week: 5, title: "언덕 걷기", content: "경사로에서 근력 강화" },
      { week: 6, title: "하루 1만보", content: "만보 걷기 도전" },
      { week: 7, title: "둘레길 탐방", content: "서울 성곽길 등 코스 걷기" },
      { week: 8, title: "걷기 대회", content: "단체 걷기 행사 참여" }
    ]
  },
  "명상": {
    videoUrl: "https://www.youtube.com/watch?v=inpok4MKVLM",
    curriculum: [
      { week: 1, title: "명상의 이해", content: "명상의 목적과 효과" },
      { week: 2, title: "호흡 명상", content: "호흡에 집중하는 연습" },
      { week: 3, title: "바디스캔", content: "몸의 감각 알아차리기" },
      { week: 4, title: "마음챙김", content: "현재 순간에 머무르기" },
      { week: 5, title: "자애 명상", content: "자신과 타인에게 사랑 보내기" },
      { week: 6, title: "걷기 명상", content: "걸으며 명상하기" },
      { week: 7, title: "소리 명상", content: "소리에 귀 기울이기" },
      { week: 8, title: "일상 명상", content: "생활 속 명상 습관화" }
    ]
  },
  "필라테스": {
    videoUrl: "https://www.youtube.com/watch?v=K56Z12XqTZI",
    curriculum: [
      { week: 1, title: "필라테스 원리", content: "호흡, 집중, 조절, 정확성" },
      { week: 2, title: "기본 자세", content: "중립 척추와 코어 활성화" },
      { week: 3, title: "매트 운동 1", content: "헌드레드, 롤업 등 기본 동작" },
      { week: 4, title: "매트 운동 2", content: "레그서클, 롤오버 등" },
      { week: 5, title: "코어 강화", content: "복부와 골반 근육 집중 훈련" },
      { week: 6, title: "유연성 향상", content: "스트레칭 중심 동작" },
      { week: 7, title: "소도구 활용", content: "볼, 밴드를 이용한 운동" },
      { week: 8, title: "전신 루틴", content: "50분 풀 루틴 완성" }
    ]
  },
  "스트레칭": {
    videoUrl: "https://www.youtube.com/watch?v=g_tea8ZNk5A",
    curriculum: [
      { week: 1, title: "스트레칭 기초", content: "정적, 동적 스트레칭 이해" },
      { week: 2, title: "목과 어깨", content: "상체 긴장 풀기" },
      { week: 3, title: "허리와 등", content: "척추 유연성 기르기" },
      { week: 4, title: "다리와 엉덩이", content: "하체 근육 이완" },
      { week: 5, title: "전신 스트레칭", content: "전체 근육 풀어주기" },
      { week: 6, title: "아침 루틴", content: "기상 후 스트레칭 습관" },
      { week: 7, title: "취침 전 루틴", content: "잠자기 전 이완 동작" },
      { week: 8, title: "통증 완화", content: "부위별 맞춤 스트레칭" }
    ]
  },
  "경락 마사지": {
    videoUrl: "https://www.youtube.com/watch?v=vVlz1F6UZ7Y",
    curriculum: [
      { week: 1, title: "경락 이론", content: "경락과 경혈의 개념" },
      { week: 2, title: "주요 경혈점", content: "자주 사용하는 혈자리 위치" },
      { week: 3, title: "손 마사지", content: "손과 팔의 경락 자극" },
      { week: 4, title: "발 마사지", content: "발 반사구와 경혈 지압" },
      { week: 5, title: "두피 마사지", content: "머리 경혈로 두통 완화" },
      { week: 6, title: "복부 마사지", content: "배 경락으로 소화 촉진" },
      { week: 7, title: "전신 경락", content: "12경락 전체 흐름 이해" },
      { week: 8, title: "자가 마사지", content: "혼자서 할 수 있는 마사지법" }
    ]
  },
  "아로마테라피": {
    videoUrl: "https://www.youtube.com/watch?v=QRLo1Y1tuUk",
    curriculum: [
      { week: 1, title: "아로마테라피 소개", content: "에센셜 오일의 효능" },
      { week: 2, title: "주요 오일 알기", content: "라벤더, 페퍼민트 등 특성" },
      { week: 3, title: "디퓨저 사용", content: "공기 중으로 향 퍼트리기" },
      { week: 4, title: "블렌딩", content: "오일 혼합하여 맞춤 향 만들기" },
      { week: 5, title: "마사지 오일", content: "캐리어 오일과 혼합하기" },
      { week: 6, title: "목욕 활용", content: "아로마 목욕으로 힐링" },
      { week: 7, title: "룸 스프레이", content: "천연 방향제 만들기" },
      { week: 8, title: "계절별 활용", content: "상황에 맞는 아로마 선택" }
    ]
  },
  "춤": {
    videoUrl: "https://www.youtube.com/watch?v=Z0nfRqhap_Q",
    curriculum: [
      { week: 1, title: "리듬 익히기", content: "음악에 맞춰 박자 타기" },
      { week: 2, title: "기본 스텝", content: "앞뒤좌우 발 움직임" },
      { week: 3, title: "라인댄스", content: "일렬로 같은 동작 추기" },
      { week: 4, title: "지루박", content: "전통 춤사위 배우기" },
      { week: 5, title: "왈츠 기초", content: "3박자에 맞춘 춤" },
      { week: 6, title: "트로트 댄스", content: "트로트 음악에 맞춘 춤" },
      { week: 7, title: "안무 배우기", content: "한 곡 완성하기" },
      { week: 8, title: "공연 발표", content: "무대에서 춤 선보이기" }
    ]
  },
  "단전호흡": {
    videoUrl: "https://www.youtube.com/watch?v=SbuxXL8UAKs",
    curriculum: [
      { week: 1, title: "단전의 이해", content: "단전의 위치와 중요성" },
      { week: 2, title: "복식호흡", content: "배로 숨 쉬는 연습" },
      { week: 3, title: "깊은 호흡", content: "천천히 깊게 들이마시기" },
      { week: 4, title: "호흡 리듬", content: "들숨 날숨 비율 조절" },
      { week: 5, title: "기운 느끼기", content: "단전에 기운 모으기" },
      { week: 6, title: "명상과 결합", content: "호흡하며 명상하기" },
      { week: 7, title: "일상 활용", content: "스트레스 상황에서 호흡법" },
      { week: 8, title: "건강 증진", content: "꾸준한 수련으로 건강 관리" }
    ]
  },
  "텃밭 가꾸기": {
    videoUrl: "https://www.youtube.com/watch?v=eG2qLGSYbYQ",
    curriculum: [
      { week: 1, title: "텃밭 계획", content: "작물 선택과 텃밭 디자인" },
      { week: 2, title: "땅 만들기", content: "흙 고르기와 밭 정리" },
      { week: 3, title: "씨 뿌리기", content: "계절 채소 파종" },
      { week: 4, title: "물주기와 거름", content: "관수와 비료 주기" },
      { week: 5, title: "잡초 제거", content: "잡초 뽑고 흙 북돋기" },
      { week: 6, title: "병충해 관리", content: "친환경 방제 방법" },
      { week: 7, title: "수확하기", content: "상추, 고추 등 채소 수확" },
      { week: 8, title: "다음 작물", content: "윤작과 계절별 재배 계획" }
    ]
  },
  "수경 재배": {
    videoUrl: "https://www.youtube.com/watch?v=mxCR0Frd-Oo",
    curriculum: [
      { week: 1, title: "수경재배 원리", content: "흙 없이 물로 키우는 방법" },
      { week: 2, title: "시스템 구성", content: "용기, 펌프, 배지 준비" },
      { week: 3, title: "영양액 만들기", content: "비료 농도와 pH 조절" },
      { week: 4, title: "씨앗 발아", content: "스펀지에 씨 뿌려 싹 틔우기" },
      { week: 5, title: "모종 이식", content: "수경 재배기로 옮기기" },
      { week: 6, title: "관리와 점검", content: "영양액 교체와 뿌리 확인" },
      { week: 7, title: "상추 키우기", content: "잎채소 재배 실습" },
      { week: 8, title: "수확과 활용", content: "신선한 채소 수확하기" }
    ]
  },
  "분재": {
    videoUrl: "https://www.youtube.com/watch?v=lV4-3gGrEOQ",
    curriculum: [
      { week: 1, title: "분재의 이해", content: "분재의 역사와 미학" },
      { week: 2, title: "나무 선택", content: "초보자에게 맞는 수종" },
      { week: 3, title: "화분과 흙", content: "분에 맞는 용토 고르기" },
      { week: 4, title: "물주기", content: "계절과 나무에 맞는 관수" },
      { week: 5, title: "가지치기", content: "모양 잡기 위한 전지" },
      { week: 6, title: "침엽수 분재", content: "소나무, 향나무 키우기" },
      { week: 7, title: "분갈이", content: "뿌리 정리하고 새 분으로" },
      { week: 8, title: "전시 감상", content: "분재 전시회 관람" }
    ]
  },
  "꽃꽂이": {
    videoUrl: "https://www.youtube.com/watch?v=4kJY1Wo3_0w",
    curriculum: [
      { week: 1, title: "꽃꽂이 기초", content: "도구와 재료 알아보기" },
      { week: 2, title: "꽃 다루기", content: "꽃 자르기와 물올림" },
      { week: 3, title: "기본 삼각형", content: "안정감 있는 구도 만들기" },
      { week: 4, title: "선의 아름다움", content: "가지와 잎으로 선 표현" },
      { week: 5, title: "색 배합", content: "조화로운 색 조합" },
      { week: 6, title: "계절 꽃꽂이", content: "봄, 여름 꽃으로 작품" },
      { week: 7, title: "동양식 꽃꽂이", content: "한국 전통 꽂이" },
      { week: 8, title: "자유 작품", content: "개성 있는 작품 만들기" }
    ]
  },
  "조경": {
    videoUrl: "https://www.youtube.com/watch?v=8lUqM3Z5sYs",
    curriculum: [
      { week: 1, title: "조경 디자인", content: "정원 설계의 기초" },
      { week: 2, title: "식재 계획", content: "나무와 꽃 배치" },
      { week: 3, title: "잔디 관리", content: "잔디 깎기와 시비" },
      { week: 4, title: "관목 전정", content: "나무 가지치기" },
      { week: 5, title: "화단 만들기", content: "테두리와 배수 설치" },
      { week: 6, title: "정원 소품", content: "의자, 조명 등 배치" },
      { week: 7, title: "수목 관리", content: "계절별 나무 돌보기" },
      { week: 8, title: "정원 완성", content: "나만의 정원 가꾸기" }
    ]
  },
  "야생화 관찰": {
    videoUrl: "https://www.youtube.com/watch?v=fT7T6Y1uc8g",
    curriculum: [
      { week: 1, title: "야생화 소개", content: "야생화의 종류와 특징" },
      { week: 2, title: "봄꽃 관찰", content: "진달래, 개나리 등 찾기" },
      { week: 3, title: "여름꽃", content: "원추리, 백합 등 관찰" },
      { week: 4, title: "가을꽃", content: "구절초, 쑥부쟁이 등" },
      { week: 5, title: "꽃 이름 알기", content: "도감 보며 종 동정" },
      { week: 6, title: "사진 촬영", content: "야생화 아름답게 찍기" },
      { week: 7, title: "탐사 여행", content: "야생화 군락지 방문" },
      { week: 8, title: "보호와 보전", content: "자연 보호의 중요성" }
    ]
  },
  "조류 관찰": {
    videoUrl: "https://www.youtube.com/watch?v=KnZUiqG5100",
    curriculum: [
      { week: 1, title: "조류 관찰 입문", content: "쌍안경 사용법과 준비물" },
      { week: 2, title: "텃새 알기", content: "도시 주변 흔한 새" },
      { week: 3, title: "철새 관찰", content: "계절별 찾아오는 새" },
      { week: 4, title: "울음소리", content: "새 소리로 종 구분" },
      { week: 5, title: "둥지와 번식", content: "새의 생태 이해" },
      { week: 6, title: "탐조 여행", content: "습지나 산으로 탐조" },
      { week: 7, title: "사진 촬영", content: "조류 사진 찍기" },
      { week: 8, title: "새 보호", content: "멸종 위기종과 보전" }
    ]
  },
  "낚시": {
    videoUrl: "https://www.youtube.com/watch?v=ZNLmimgW0dE",
    curriculum: [
      { week: 1, title: "낚시 도구", content: "낚싯대, 릴, 미끼 준비" },
      { week: 2, title: "채비 만들기", content: "바늘, 찌, 봉돌 연결" },
      { week: 3, title: "캐스팅 연습", content: "낚싯줄 던지기" },
      { week: 4, title: "붕어낚시", content: "민물낚시 실습" },
      { week: 5, title: "입질 보기", content: "찌의 움직임 읽기" },
      { week: 6, title: "바다낚시", content: "방파제 낚시 체험" },
      { week: 7, title: "손질과 요리", content: "잡은 물고기 손질하기" },
      { week: 8, title: "낚시 여행", content: "유명 낚시터 방문" }
    ]
  },
  "장기": {
    videoUrl: "https://www.youtube.com/watch?v=sMkklWCfXIU",
    curriculum: [
      { week: 1, title: "장기 규칙", content: "말의 종류와 움직임" },
      { week: 2, title: "포진법", content: "개국 시 말 배치" },
      { week: 3, title: "수읽기", content: "몇 수 앞 예측하기" },
      { week: 4, title: "공격 기술", content: "상대 말 잡는 전략" },
      { week: 5, title: "수비 기술", content: "궁 지키기와 방어" },
      { week: 6, title: "정석 배우기", content: "유명한 포진과 정석" },
      { week: 7, title: "실전 대국", content: "시간 제한 두고 두기" },
      { week: 8, title: "장기 대회", content: "토너먼트 참가" }
    ]
  },
  "퍼즐": {
    videoUrl: "https://www.youtube.com/watch?v=iy4oyjMp6jk",
    curriculum: [
      { week: 1, title: "퍼즐 종류", content: "직소, 스도쿠, 낱말 등" },
      { week: 2, title: "직소 퍼즐", content: "그림 맞추기 요령" },
      { week: 3, title: "스도쿠", content: "숫자 논리 퍼즐" },
      { week: 4, title: "낱말 퍼즐", content: "십자말풀이" },
      { week: 5, title: "탱그램", content: "도형 조각 맞추기" },
      { week: 6, title: "큐브 퍼즐", content: "루빅스 큐브 등" },
      { week: 7, title: "고난도 퍼즐", content: "복잡한 퍼즐 도전" },
      { week: 8, title: "퍼즐 대회", content: "속도 경쟁 참가" }
    ]
  },
  "여행": {
    videoUrl: "https://www.youtube.com/watch?v=kZvFGFnLDXE",
    curriculum: [
      { week: 1, title: "여행 계획", content: "목적지 선정과 일정 짜기" },
      { week: 2, title: "국내 여행", content: "경주, 제주 등 명소" },
      { week: 3, title: "문화 탐방", content: "사찰, 궁궐, 고궁 여행" },
      { week: 4, title: "자연 여행", content: "섬, 산, 바다 여행" },
      { week: 5, title: "해외 여행 준비", content: "여권, 환전, 짐 싸기" },
      { week: 6, title: "단체 여행", content: "패키지 투어 경험" },
      { week: 7, title: "여행 사진", content: "추억 남기는 촬영법" },
      { week: 8, title: "여행기 쓰기", content: "여행 기록 정리" }
    ]
  },
  "천체 관측": {
    videoUrl: "https://www.youtube.com/watch?v=kMq59U3kC1k",
    curriculum: [
      { week: 1, title: "별자리 이해", content: "계절별 주요 별자리" },
      { week: 2, title: "육안 관측", content: "망원경 없이 별 보기" },
      { week: 3, title: "망원경 사용", content: "천체 망원경 조작법" },
      { week: 4, title: "달 관측", content: "달의 위상과 표면" },
      { week: 5, title: "행성 관측", content: "금성, 목성, 토성 보기" },
      { week: 6, title: "별 사진", content: "장노출로 별 찍기" },
      { week: 7, title: "천문대 방문", content: "과학관이나 천문대 관람" },
      { week: 8, title: "유성우 관측", content: "별똥별 보러 가기" }
    ]
  },
  "도자기 공예": {
    videoUrl: "https://www.youtube.com/watch?v=dUdR9aI-4vQ",
    curriculum: [
      { week: 1, title: "도자기 역사", content: "도자기의 종류와 기법" },
      { week: 2, title: "물레 익히기", content: "물레 돌리며 센터링" },
      { week: 3, title: "그릇 만들기", content: "컵이나 접시 성형" },
      { week: 4, title: "손으로 빚기", content: "코일이나 판 기법" },
      { week: 5, title: "장식 기법", content: "조각, 음각, 상감" },
      { week: 6, title: "초벌 소성", content: "가마에 넣어 굽기" },
      { week: 7, title: "유약 바르기", content: "색과 광택 입히기" },
      { week: 8, title: "재벌 완성", content: "본 소성 후 작품 완성" }
    ]
  },
  "수묵화": {
    videoUrl: "https://www.youtube.com/watch?v=EYo4eOe0iEc",
    curriculum: [
      { week: 1, title: "문방사우", content: "붓, 먹, 종이, 벼루 이해" },
      { week: 2, title: "먹 갈기", content: "먹 농담 조절하기" },
      { week: 3, title: "사군자 매화", content: "매화 가지와 꽃 그리기" },
      { week: 4, title: "사군자 난", content: "난초 잎과 꽃 표현" },
      { week: 5, title: "사군자 국화", content: "국화 그리기" },
      { week: 6, title: "사군자 대나무", content: "대나무 줄기와 잎" },
      { week: 7, title: "산수화", content: "산과 물 먹으로 표현" },
      { week: 8, title: "작품 낙관", content: "도장 찍고 작품 완성" }
    ]
  },
  "유화": {
    videoUrl: "https://www.youtube.com/watch?v=67J4IWb18iY",
    curriculum: [
      { week: 1, title: "유화 재료", content: "물감, 붓, 캔버스, 오일" },
      { week: 2, title: "색채 혼합", content: "팔레트에서 색 만들기" },
      { week: 3, title: "밑그림", content: "스케치로 구도 잡기" },
      { week: 4, title: "바탕 칠하기", content: "전체 톤 깔기" },
      { week: 5, title: "세부 묘사", content: "형태와 명암 그리기" },
      { week: 6, title: "질감 표현", content: "터치로 질감 살리기" },
      { week: 7, title: "수정과 마무리", content: "세부 보완하기" },
      { week: 8, title: "완성과 건조", content: "바니시 칠하고 보관" }
    ]
  },
  "아크릴화": {
    videoUrl: "https://www.youtube.com/watch?v=CDKBTwBv_0Q",
    curriculum: [
      { week: 1, title: "아크릴 특성", content: "빠른 건조와 발색" },
      { week: 2, title: "기본 기법", content: "평붓, 둥글붓 사용법" },
      { week: 3, title: "그라데이션", content: "색 번짐과 혼합" },
      { week: 4, title: "정물 그리기", content: "과일과 꽃 표현" },
      { week: 5, title: "풍경 그리기", content: "하늘, 나무, 바다" },
      { week: 6, title: "추상 표현", content: "자유로운 색과 형태" },
      { week: 7, title: "혼합 재료", content: "콜라주나 미디엄 활용" },
      { week: 8, title: "개인 작품", content: "자유 주제 완성" }
    ]
  },
  "민화": {
    videoUrl: "https://www.youtube.com/watch?v=0Rk1yQL4Vh0",
    curriculum: [
      { week: 1, title: "민화의 이해", content: "한국 전통 그림의 의미" },
      { week: 2, title: "모본 따라 그리기", content: "밑그림 연습" },
      { week: 3, title: "채색 기법", content: "전통 안료 사용법" },
      { week: 4, title: "까치호랑이", content: "해학적인 민화 그리기" },
      { week: 5, title: "화조도", content: "꽃과 새 그리기" },
      { week: 6, title: "책거리", content: "책과 문방구 배치" },
      { week: 7, title: "십장생", content: "장수를 상징하는 그림" },
      { week: 8, title: "작품 완성", content: "액자나 족자로 마무리" }
    ]
  },
  "색연필화": {
    videoUrl: "https://www.youtube.com/watch?v=tWWNcMOQg3Q",
    curriculum: [
      { week: 1, title: "색연필 종류", content: "유성, 수성 색연필 비교" },
      { week: 2, title: "기본 터치", content: "선 긋기와 면 칠하기" },
      { week: 3, title: "그라데이션", content: "색 변화 자연스럽게" },
      { week: 4, title: "혼색 기법", content: "여러 색 겹쳐 칠하기" },
      { week: 5, title: "정물 스케치", content: "사실적으로 그리기" },
      { week: 6, title: "인물 그리기", content: "얼굴과 피부 표현" },
      { week: 7, title: "풍경 스케치", content: "야외에서 그리기" },
      { week: 8, title: "작품 제작", content: "완성도 높은 그림 완성" }
    ]
  },
  "캘리그라피": {
    videoUrl: "https://www.youtube.com/watch?v=SZa5LNs17J0",
    curriculum: [
      { week: 1, title: "캘리그라피 소개", content: "손글씨의 예술" },
      { week: 2, title: "도구 익히기", content: "붓펜, 먹, 다양한 펜" },
      { week: 3, title: "기본 획", content: "선의 강약과 리듬" },
      { week: 4, title: "한글 쓰기", content: "자음과 모음의 변형" },
      { week: 5, title: "문구 디자인", content: "짧은 문장 멋지게 쓰기" },
      { week: 6, title: "레이아웃", content: "여백과 배치의 미학" },
      { week: 7, title: "카드 만들기", content: "축하 카드 손글씨" },
      { week: 8, title: "작품 제작", content: "액자용 캘리그라피 완성" }
    ]
  },
  "뜨개질": {
    videoUrl: "https://www.youtube.com/watch?v=CIiO3ap56UQ",
    curriculum: [
      { week: 1, title: "뜨개질 도구", content: "바늘과 실 선택" },
      { week: 2, title: "코 만들기", content: "사슬뜨기, 코 늘리기" },
      { week: 3, title: "겉뜨기 안뜨기", content: "기본 뜨기 방법" },
      { week: 4, title: "스카프 만들기", content: "긴 직사각형 뜨기" },
      { week: 5, title: "모자 뜨기", content: "원형으로 모자 제작" },
      { week: 6, title: "코 줄이기", content: "모양 만들기" },
      { week: 7, title: "조끼 만들기", content: "몸판과 어깨 연결" },
      { week: 8, title: "작품 완성", content: "마무리와 단추 달기" }
    ]
  },
  "목공예": {
    videoUrl: "https://www.youtube.com/watch?v=S4oE1qJoWJY",
    curriculum: [
      { week: 1, title: "목공 도구", content: "톱, 망치, 대패 사용법" },
      { week: 2, title: "나무 선택", content: "소나무, 참나무 등 특성" },
      { week: 3, title: "재단하기", content: "직선과 곡선 자르기" },
      { week: 4, title: "조립 기법", content: "못, 나사, 접착제" },
      { week: 5, title: "연필꽂이 만들기", content: "간단한 소품 제작" },
      { week: 6, title: "사포질", content: "표면 매끄럽게 다듬기" },
      { week: 7, title: "도색과 코팅", content: "오일이나 페인트 칠하기" },
      { week: 8, title: "선반 만들기", content: "실용적인 가구 완성" }
    ]
  },
  "한지공예": {
    videoUrl: "https://www.youtube.com/watch?v=Iv0BSpJlZA8",
    curriculum: [
      { week: 1, title: "한지의 특성", content: "전통 종이의 아름다움" },
      { week: 2, title: "한지 염색", content: "자연 염료로 물들이기" },
      { week: 3, title: "지승 꼬기", content: "한지로 노끈 만들기" },
      { week: 4, title: "바구니 만들기", content: "지승으로 엮기" },
      { week: 5, title: "한지 인형", content: "종이 인형 만들기" },
      { week: 6, title: "조명 만들기", content: "한지 갓 제작" },
      { week: 7, title: "한지 액자", content: "그림이나 글 배접하기" },
      { week: 8, title: "작품 전시", content: "완성품 선보이기" }
    ]
  },
  "종이접기": {
    videoUrl: "https://www.youtube.com/watch?v=GL6d6AZHy1w",
    curriculum: [
      { week: 1, title: "기본 기호", content: "접기 기호와 용어" },
      { week: 2, title: "기본 접기", content: "학, 배 등 간단한 작품" },
      { week: 3, title: "동물 접기", content: "강아지, 고양이 등" },
      { week: 4, title: "꽃 접기", content: "장미, 백합 등" },
      { week: 5, title: "상자 만들기", content: "실용적인 소품" },
      { week: 6, title: "복잡한 작품", content: "다단 접기" },
      { week: 7, title: "모듈 오리가미", content: "여러 장 조립하기" },
      { week: 8, title: "작품 전시", content: "완성품 꾸미기" }
    ]
  },
  "퀼트": {
    videoUrl: "https://www.youtube.com/watch?v=y0Z9F8wUDcc",
    curriculum: [
      { week: 1, title: "퀼트 소개", content: "패치워크와 퀼팅" },
      { week: 2, title: "천 자르기", content: "정확한 재단 연습" },
      { week: 3, title: "피스 잇기", content: "천 조각 박음질" },
      { week: 4, title: "기본 블록", content: "사각형, 삼각형 블록" },
      { week: 5, title: "디자인 배치", content: "색과 패턴 조합" },
      { week: 6, title: "퀼팅 기법", content: "누빔 바느질" },
      { week: 7, title: "테이블 러너", content: "실용적인 작품 제작" },
      { week: 8, title: "퀼트 완성", content: "가장자리 마무리" }
    ]
  },
  "자수": {
    videoUrl: "https://www.youtube.com/watch?v=9Y9jE3WoBtM",
    curriculum: [
      { week: 1, title: "자수 도구", content: "바늘, 실, 수틀 준비" },
      { week: 2, title: "기본 스티치", content: "백스티치, 체인스티치 등" },
      { week: 3, title: "도안 옮기기", content: "천에 그림 그리기" },
      { week: 4, title: "꽃 수놓기", content: "간단한 꽃무늬 자수" },
      { week: 5, title: "프랑스 매듭", content: "입체감 있는 기법" },
      { week: 6, title: "레터링 자수", content: "문구 새기기" },
      { week: 7, title: "소품 만들기", content: "손수건이나 파우치 장식" },
      { week: 8, title: "작품 완성", content: "액자 장착하기" }
    ]
  },
  "비누 만들기": {
    videoUrl: "https://www.youtube.com/watch?v=d9ySw5CmLYE",
    curriculum: [
      { week: 1, title: "비누 제작 원리", content: "천연 재료와 첨가물" },
      { week: 2, title: "MP 비누", content: "녹여붓기 방식" },
      { week: 3, title: "색소와 향", content: "천연 색과 에센셜 오일" },
      { week: 4, title: "모양 만들기", content: "몰드 활용" },
      { week: 5, title: "허브 비누", content: "허브 첨가 비누" },
      { week: 6, title: "CP 비누 소개", content: "냉침법 비누 만들기" },
      { week: 7, title: "숙성과 건조", content: "비누 관리하기" },
      { week: 8, title: "포장과 선물", content: "예쁘게 포장하기" }
    ]
  },
  "양초 공예": {
    videoUrl: "https://www.youtube.com/watch?v=EEgTRnBLF6U",
    curriculum: [
      { week: 1, title: "양초 재료", content: "왁스, 심지, 향료 이해" },
      { week: 2, title: "왁스 녹이기", content: "온도 조절하기" },
      { week: 3, title: "컨테이너 캔들", content: "유리병에 양초 붓기" },
      { week: 4, title: "색 입히기", content: "염료로 색상 만들기" },
      { week: 5, title: "향초 만들기", content: "에센셜 오일 첨가" },
      { week: 6, title: "필러 캔들", content: "기둥형 양초 제작" },
      { week: 7, title: "장식 기법", content: "드라이플라워 활용" },
      { week: 8, title: "선물 세트", content: "완성품 포장하기" }
    ]
  },
  "가죽공예": {
    videoUrl: "https://www.youtube.com/watch?v=BWxz_4mNWP8",
    curriculum: [
      { week: 1, title: "가죽 종류", content: "소가죽, 양가죽 등" },
      { week: 2, title: "공구 사용법", content: "커터, 펀치, 망치" },
      { week: 3, title: "재단하기", content: "형지에 맞춰 자르기" },
      { week: 4, title: "코인 지갑", content: "간단한 소품 제작" },
      { week: 5, title: "재봉하기", content: "손바느질과 기계 봉제" },
      { week: 6, title: "카드 지갑", content: "슬롯이 있는 지갑" },
      { week: 7, title: "각인과 염색", content: "가죽에 무늬 새기기" },
      { week: 8, title: "장지갑 완성", content: "실용적인 작품 제작" }
    ]
  },
  "피아노": {
    videoUrl: "https://www.youtube.com/watch?v=sNW6vZcPKZM",
    curriculum: [
      { week: 1, title: "건반 이해", content: "도레미파솔라시도 위치" },
      { week: 2, title: "손가락 번호", content: "올바른 운지법" },
      { week: 3, title: "오른손 멜로디", content: "간단한 곡 연주" },
      { week: 4, title: "왼손 화음", content: "반주 넣기" },
      { week: 5, title: "양손 합주", content: "멜로디와 반주 동시에" },
      { week: 6, title: "리듬 연습", content: "박자 정확하게 치기" },
      { week: 7, title: "쉬운 곡", content: "동요나 가요 1곡 완성" },
      { week: 8, title: "발표 연주", content: "배운 곡 들려주기" }
    ]
  },
  "우쿨렐레": {
    videoUrl: "https://www.youtube.com/watch?v=DQU7nL1NE3Y",
    curriculum: [
      { week: 1, title: "우쿨렐레 구조", content: "악기 부위와 튜닝" },
      { week: 2, title: "기본 자세", content: "안는 자세와 손 위치" },
      { week: 3, title: "3코드", content: "C, F, G7 코드" },
      { week: 4, title: "스트럼 패턴", content: "다운 업 리듬 치기" },
      { week: 5, title: "쉬운 곡 1", content: "동요 연주하기" },
      { week: 6, title: "추가 코드", content: "Am, Dm, Em 등" },
      { week: 7, title: "노래 반주", content: "노래하며 연주하기" },
      { week: 8, title: "발표 공연", content: "배운 곡 선보이기" }
    ]
  },
  "하모니카": {
    videoUrl: "https://www.youtube.com/watch?v=lGS_qZ1o69w",
    curriculum: [
      { week: 1, title: "하모니카 종류", content: "복음, 단음, 크로매틱" },
      { week: 2, title: "입 모양과 호흡", content: "바른 연주법" },
      { week: 3, title: "음계 연습", content: "도레미파솔라시도 불기" },
      { week: 4, title: "단음 내기", content: "한 음만 정확하게" },
      { week: 5, title: "쉬운 멜로디", content: "학교종, 작은별 등" },
      { week: 6, title: "벤딩 기법", content: "음 높이 조절" },
      { week: 7, title: "가요 연주", content: "익숙한 곡 불기" },
      { week: 8, title: "합주와 발표", content: "함께 연주하기" }
    ]
  },
  "오카리나": {
    videoUrl: "https://www.youtube.com/watch?v=I_FN46aMMO8",
    curriculum: [
      { week: 1, title: "오카리나 소개", content: "악기 구조와 종류" },
      { week: 2, title: "입김 조절", content: "바람 세기와 음색" },
      { week: 3, title: "운지법", content: "구멍 막는 손가락" },
      { week: 4, title: "음계 연습", content: "낮은 음부터 높은 음까지" },
      { week: 5, title: "동요 연주", content: "고향의 봄 등" },
      { week: 6, title: "텅잉 기법", content: "또박또박 음 구분" },
      { week: 7, title: "가요 연주", content: "아름다운 곡 연주" },
      { week: 8, title: "합주 경험", content: "여럿이 함께 연주" }
    ]
  },
  "드럼": {
    videoUrl: "https://www.youtube.com/watch?v=lKG8zjMWzXM",
    curriculum: [
      { week: 1, title: "드럼 구성", content: "킥, 스네어, 심벌 등" },
      { week: 2, title: "스틱 잡기", content: "그립과 기본 자세" },
      { week: 3, title: "기본 비트", content: "8비트 리듬" },
      { week: 4, title: "킥 드럼 연습", content: "발로 베이스 드럼 치기" },
      { week: 5, title: "16비트", content: "빠른 리듬 연습" },
      { week: 6, title: "필인", content: "곡의 변화 연결" },
      { week: 7, title: "곡 연주", content: "노래에 맞춰 드럼" },
      { week: 8, title: "밴드 합주", content: "다른 악기와 협연" }
    ]
  },
  "베이킹": {
    videoUrl: "https://www.youtube.com/watch?v=3Aub4eyue0M",
    curriculum: [
      { week: 1, title: "베이킹 기초", content: "계량과 오븐 사용법" },
      { week: 2, title: "쿠키 만들기", content: "버터 쿠키 굽기" },
      { week: 3, title: "머핀", content: "블루베리 머핀 제작" },
      { week: 4, title: "스콘", content: "영국식 스콘 굽기" },
      { week: 5, title: "파운드 케이크", content: "기본 케이크 만들기" },
      { week: 6, title: "빵 반죽", content: "이스트 발효 빵" },
      { week: 7, title: "타르트", content: "과일 타르트 만들기" },
      { week: 8, title: "케이크 데코", content: "생크림 장식하기" }
    ]
  },
  "한식 요리": {
    videoUrl: "https://www.youtube.com/watch?v=pnC-Ga24ZVs",
    curriculum: [
      { week: 1, title: "한식 기초", content: "기본 양념장 만들기" },
      { week: 2, title: "국과 찌개", content: "된장찌개, 김치찌개" },
      { week: 3, title: "나물 반찬", content: "시금치, 콩나물 무치기" },
      { week: 4, title: "조림 요리", content: "감자조림, 두부조림" },
      { week: 5, title: "볶음 요리", content: "제육볶음, 오징어볶음" },
      { week: 6, title: "전 부치기", content: "김치전, 파전 만들기" },
      { week: 7, title: "찜 요리", content: "갈비찜, 생선찜" },
      { week: 8, title: "한상 차리기", content: "밥상 완성하기" }
    ]
  },
  "차 문화": {
    videoUrl: "https://www.youtube.com/watch?v=lqKgdFm0Pmo",
    curriculum: [
      { week: 1, title: "차의 종류", content: "녹차, 홍차, 허브차 등" },
      { week: 2, title: "다구 알기", content: "찻잔, 다관, 다호" },
      { week: 3, title: "물 온도", content: "차에 맞는 적정 온도" },
      { week: 4, title: "우리기", content: "우리는 시간과 횟수" },
      { week: 5, title: "다도 예절", content: "전통 다례 배우기" },
      { week: 6, title: "블렌딩", content: "차 섞어 만들기" },
      { week: 7, title: "페어링", content: "차와 음식 조합" },
      { week: 8, title: "티 타임", content: "다회 개최하기" }
    ]
  },
  "커피 로스팅": {
    videoUrl: "https://www.youtube.com/watch?v=fnbI9S7u3Os",
    curriculum: [
      { week: 1, title: "커피 생두", content: "산지별 특징 이해" },
      { week: 2, title: "로스팅 기초", content: "열과 시간의 관계" },
      { week: 3, title: "로스팅 단계", content: "라이트, 미디엄, 다크" },
      { week: 4, title: "홈 로스팅", content: "팬이나 기계로 볶기" },
      { week: 5, title: "쿨링과 보관", content: "식히고 숙성하기" },
      { week: 6, title: "커핑", content: "맛과 향 평가하기" },
      { week: 7, title: "블렌딩", content: "생두 섞어 볶기" },
      { week: 8, title: "추출하기", content: "다양한 방식으로 내리기" }
    ]
  },
  "발효 음식": {
    videoUrl: "https://www.youtube.com/watch?v=2C3Ie3mf-K8",
    curriculum: [
      { week: 1, title: "발효의 원리", content: "미생물과 발효 과정" },
      { week: 2, title: "김치 담그기", content: "배추김치 만들기" },
      { week: 3, title: "장 담그기", content: "된장, 고추장 이해" },
      { week: 4, title: "요거트", content: "유산균 배양하기" },
      { week: 5, title: "피클", content: "채소 절임 만들기" },
      { week: 6, title: "효소", content: "과일 효소 담그기" },
      { week: 7, title: "식초 만들기", content: "천연 발효 식초" },
      { week: 8, title: "발효 활용", content: "발효 음식 요리하기" }
    ]
  },
  "컴퓨터 활용": {
    videoUrl: "https://www.youtube.com/watch?v=9O0b4u0pY1Y",
    curriculum: [
      { week: 1, title: "컴퓨터 기초", content: "키보드, 마우스 사용법" },
      { week: 2, title: "인터넷 검색", content: "포털 사이트 활용" },
      { week: 3, title: "이메일", content: "메일 보내고 받기" },
      { week: 4, title: "문서 작성", content: "워드프로세서 사용" },
      { week: 5, title: "엑셀 기초", content: "표와 간단한 계산" },
      { week: 6, title: "사진 편집", content: "사진 자르고 보정하기" },
      { week: 7, title: "파일 관리", content: "폴더 정리와 백업" },
      { week: 8, title: "온라인 뱅킹", content: "안전한 인터넷 거래" }
    ]
  },
  "스마트폰 활용": {
    videoUrl: "https://www.youtube.com/watch?v=DUVxhPH-yj4",
    curriculum: [
      { week: 1, title: "기본 기능", content: "전화, 문자, 연락처" },
      { week: 2, title: "설정 이해", content: "와이파이, 소리, 화면" },
      { week: 3, title: "카카오톡", content: "대화방과 사진 보내기" },
      { week: 4, title: "인터넷 검색", content: "모바일 웹 사용법" },
      { week: 5, title: "사진과 동영상", content: "촬영하고 앨범 정리" },
      { week: 6, title: "지도 앱", content: "길 찾기와 내비게이션" },
      { week: 7, title: "유용한 앱", content: "날씨, 뉴스, 쇼핑 앱" },
      { week: 8, title: "보안과 백업", content: "안전하게 사용하기" }
    ]
  },
  "블로그 운영": {
    videoUrl: "https://www.youtube.com/watch?v=G2RwSEYZa4U",
    curriculum: [
      { week: 1, title: "블로그 시작", content: "플랫폼 선택과 개설" },
      { week: 2, title: "글쓰기 기초", content: "제목과 본문 작성법" },
      { week: 3, title: "사진 올리기", content: "이미지 편집과 업로드" },
      { week: 4, title: "카테고리 분류", content: "주제별 정리하기" },
      { week: 5, title: "방문자 늘리기", content: "검색 최적화" },
      { week: 6, title: "댓글 소통", content: "이웃과 교류하기" },
      { week: 7, title: "블로그 꾸미기", content: "레이아웃과 디자인" },
      { week: 8, title: "꾸준한 운영", content: "정기 포스팅 습관" }
    ]
  },
  "영상 편집": {
    videoUrl: "https://www.youtube.com/watch?v=Zod9-fJw78E",
    curriculum: [
      { week: 1, title: "편집 프로그램", content: "기본 인터페이스 익히기" },
      { week: 2, title: "영상 자르기", content: "트리밍과 분할" },
      { week: 3, title: "영상 이어붙이기", content: "클립 연결과 전환" },
      { week: 4, title: "자막 넣기", content: "텍스트 삽입과 타이밍" },
      { week: 5, title: "음악 삽입", content: "배경 음악과 효과음" },
      { week: 6, title: "색보정", content: "밝기, 대비, 채도 조절" },
      { week: 7, title: "내보내기", content: "최종 영상 저장하기" },
      { week: 8, title: "유튜브 업로드", content: "영상 공유하기" }
    ]
  },
  "영어 회화": {
    videoUrl: "https://www.youtube.com/watch?v=MxKoiYaGESw",
    curriculum: [
      { week: 1, title: "기본 인사", content: "Hello, How are you 등" },
      { week: 2, title: "자기소개", content: "이름, 나이, 직업 말하기" },
      { week: 3, title: "일상 표현", content: "감사, 사과, 부탁 등" },
      { week: 4, title: "쇼핑 영어", content: "가격 묻고 물건 사기" },
      { week: 5, title: "레스토랑", content: "주문하고 계산하기" },
      { week: 6, title: "길 묻기", content: "방향과 위치 표현" },
      { week: 7, title: "전화 영어", content: "전화로 대화하기" },
      { week: 8, title: "자유 대화", content: "관심사 이야기하기" }
    ]
  },
  "중국어": {
    videoUrl: "https://www.youtube.com/watch?v=gNXWsQG3L2Q",
    curriculum: [
      { week: 1, title: "발음 기초", content: "성조와 병음 익히기" },
      { week: 2, title: "기본 인사", content: "你好, 谢谢 등" },
      { week: 3, title: "자기소개", content: "나를 소개하는 문장" },
      { week: 4, title: "숫자와 날짜", content: "시간 말하기" },
      { week: 5, title: "쇼핑 표현", content: "얼마예요? 깎아주세요" },
      { week: 6, title: "음식 주문", content: "식당에서 사용하는 중국어" },
      { week: 7, title: "방향과 교통", content: "길 묻고 답하기" },
      { week: 8, title: "간단한 대화", content: "일상 회화 연습" }
    ]
  },
  "일본어": {
    videoUrl: "https://www.youtube.com/watch?v=NG5hDnGfPq0",
    curriculum: [
      { week: 1, title: "히라가나", content: "あいうえお 50음" },
      { week: 2, title: "카타카나", content: "アイウエオ 외래어" },
      { week: 3, title: "기본 인사", content: "こんにちは 등" },
      { week: 4, title: "자기소개", content: "나는 ~입니다" },
      { week: 5, title: "기본 문법", content: "조사와 동사 활용" },
      { week: 6, title: "쇼핑 회화", content: "これください 등" },
      { week: 7, title: "여행 일본어", content: "관광지에서 사용" },
      { week: 8, title: "일상 회화", content: "간단한 대화 연습" }
    ]
  },
  "독서 지도": {
    videoUrl: "https://www.youtube.com/watch?v=BWV37BewS0o",
    curriculum: [
      { week: 1, title: "독서 지도 개요", content: "아이들과 책 읽기의 중요성" },
      { week: 2, title: "책 선정", content: "연령별 추천 도서" },
      { week: 3, title: "읽어주기", content: "효과적인 낭독 방법" },
      { week: 4, title: "질문하기", content: "생각을 키우는 질문법" },
      { week: 5, title: "독후 활동", content: "그림 그리기, 글쓰기" },
      { week: 6, title: "토론 유도", content: "책 내용 나누기" },
      { week: 7, title: "습관 만들기", content: "규칙적인 독서 시간" },
      { week: 8, title: "도서관 활용", content: "함께 도서관 가기" }
    ]
  },
  "멘토링": {
    videoUrl: "https://www.youtube.com/watch?v=ZLp6Ptd2-nQ",
    curriculum: [
      { week: 1, title: "멘토의 역할", content: "경험 나누고 조언하기" },
      { week: 2, title: "경청 기술", content: "상대방 이야기 듣기" },
      { week: 3, title: "질문 기법", content: "생각 이끌어내는 질문" },
      { week: 4, title: "목표 설정", content: "멘티와 함께 계획 세우기" },
      { week: 5, title: "피드백", content: "건설적인 조언 주기" },
      { week: 6, title: "동기 부여", content: "격려와 칭찬" },
      { week: 7, title: "문제 해결", content: "어려움 함께 극복하기" },
      { week: 8, title: "장기 관계", content: "지속적인 멘토링" }
    ]
  },
  "환경 보호": {
    videoUrl: "https://www.youtube.com/watch?v=G4H1N_yXBiA",
    curriculum: [
      { week: 1, title: "환경 문제 인식", content: "기후변화와 오염 이해" },
      { week: 2, title: "분리수거", content: "올바른 재활용 방법" },
      { week: 3, title: "플라스틱 줄이기", content: "일회용품 대체하기" },
      { week: 4, title: "에너지 절약", content: "전기, 물 아끼기" },
      { week: 5, title: "친환경 제품", content: "지속 가능한 소비" },
      { week: 6, title: "캠페인 참여", content: "환경 운동 동참" },
      { week: 7, title: "정화 활동", content: "쓰레기 줍기, 하천 정화" },
      { week: 8, title: "실천 습관", content: "일상 속 환경 보호" }
    ]
  },
  "사진": {
    videoUrl: "https://www.youtube.com/watch?v=V7z7BAZdt2M",
    curriculum: [
      { week: 1, title: "카메라 기초", content: "조리개, 셔터속도, ISO" },
      { week: 2, title: "구도와 프레이밍", content: "3분할 법칙 활용" },
      { week: 3, title: "빛의 이해", content: "자연광 활용법" },
      { week: 4, title: "인물 사진", content: "표정과 각도 포착" },
      { week: 5, title: "풍경 사진", content: "원근감 살리기" },
      { week: 6, title: "접사 촬영", content: "작은 피사체 클로즈업" },
      { week: 7, title: "보정 기초", content: "사진 편집하기" },
      { week: 8, title: "포트폴리오", content: "주제별 사진 시리즈" }
    ]
  }
};

async function updateAllHobbies() {
  try {
    const allHobbies = await db.select().from(hobbies);
    console.log(`총 ${allHobbies.length}개의 취미를 업데이트합니다...\n`);

    let updated = 0;
    for (const hobby of allHobbies) {
      const data = hobbyData[hobby.name];
      if (data) {
        await db
          .update(hobbies)
          .set({
            videoUrl: data.videoUrl,
            curriculum: data.curriculum,
          })
          .where(eq(hobbies.id, hobby.id));

        updated++;
        console.log(`✅ ${updated}/${Object.keys(hobbyData).length} - ${hobby.name} 업데이트 완료`);
      }
    }

    console.log(`\n✨ 총 ${updated}개 취미의 커리큘럼과 유튜브 영상이 업데이트되었습니다!`);
    process.exit(0);
  } catch (error) {
    console.error("❌ 오류 발생:", error);
    process.exit(1);
  }
}

updateAllHobbies();
