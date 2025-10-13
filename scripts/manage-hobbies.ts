import { db } from '../lib/db';
import { hobbies } from '../lib/db/schema';
import { eq, or } from 'drizzle-orm';
import { randomUUID } from 'crypto';

async function manageHobbies() {
  try {
    console.log("=== Managing Hobbies ===\n");

    // 1. 중복 취미 삭제
    console.log("Step 1: Removing duplicate/similar hobbies...\n");

    const hobbiestoDelete = [
      '사진 촬영', // '사진'과 중복
      '수묵화', // 유사 미술 통합
      '색연필화', // 유사 미술 통합
      '스마트폰 활용', // '컴퓨터 활용'과 통합
    ];

    for (const hobbyName of hobbiestoDelete) {
      const deleted = await db.delete(hobbies).where(eq(hobbies.name, hobbyName));
      console.log(`✓ Deleted: ${hobbyName}`);
    }

    console.log("\nStep 2: Adding new diverse hobbies...\n");

    // 2. 새로운 유형의 취미 추가
    const newHobbies = [
      {
        id: randomUUID(),
        name: "3D 프린팅",
        category: "기술",
        description: "3D 모델링과 프린팅을 통해 창의적인 작품을 만드는 활동. 현대 기술을 배우며 실용적인 물건을 제작할 수 있습니다.",
        difficulty: 3,
        indoorOutdoor: "indoor" as const,
        socialIndividual: "individual" as const,
        budget: "high" as const,
        imageUrl: "/3d-printing.jpg",
        videoUrl: null,
        benefits: ["창의력 향상", "기술 습득", "실용적 제작", "문제 해결력"],
        requirements: ["3D 프린터", "모델링 소프트웨어", "필라멘트", "컴퓨터"],
        curriculum: [
          { week: 1, title: "3D 프린팅 기초", content: "3D 프린터 작동 원리와 종류" },
          { week: 2, title: "모델링 소프트웨어", content: "Tinkercad 기초 사용법" },
          { week: 3, title: "첫 작품 출력", content: "간단한 소품 디자인하고 출력하기" },
          { week: 4, title: "실용품 제작", content: "생활용품 디자인 및 제작" },
        ],
      },
      {
        id: randomUUID(),
        name: "우표 수집",
        category: "수집",
        description: "세계 각국의 우표를 수집하고 정리하는 취미. 역사와 문화를 배우며 가치 있는 컬렉션을 만들 수 있습니다.",
        difficulty: 1,
        indoorOutdoor: "indoor" as const,
        socialIndividual: "individual" as const,
        budget: "low" as const,
        imageUrl: "/stamp-collecting.jpg",
        videoUrl: null,
        benefits: ["역사 학습", "문화 이해", "정리 능력", "가치 발견"],
        requirements: ["우표 앨범", "핀셋", "돋보기", "보관함"],
        curriculum: null,
      },
      {
        id: randomUUID(),
        name: "검도",
        category: "스포츠",
        description: "일본 전통 검술을 스포츠화한 무도. 예의와 집중력을 기르며 심신을 단련할 수 있습니다.",
        difficulty: 4,
        indoorOutdoor: "indoor" as const,
        socialIndividual: "social" as const,
        budget: "medium" as const,
        imageUrl: "/kendo.jpg",
        videoUrl: null,
        benefits: ["체력 향상", "집중력", "예의범절", "스트레스 해소"],
        requirements: ["죽도", "호구", "도복", "도장 등록"],
        curriculum: [
          { week: 1, title: "검도 기본 예절", content: "인사와 기본 자세" },
          { week: 2, title: "기본 동작", content: "죽도 잡기와 기본 베기" },
          { week: 3, title: "발 동작", content: "이동과 공격 자세" },
          { week: 4, title: "기본 타격", content: "머리, 손목, 허리 타격 연습" },
        ],
      },
      {
        id: randomUUID(),
        name: "체스",
        category: "여가",
        description: "전략적 사고를 요구하는 보드게임. 두뇌 활동을 촉진하고 논리적 사고력을 키울 수 있습니다.",
        difficulty: 3,
        indoorOutdoor: "indoor" as const,
        socialIndividual: "both" as const,
        budget: "low" as const,
        imageUrl: "/chess.jpg",
        videoUrl: null,
        benefits: ["전략적 사고", "집중력", "기억력 향상", "인지 능력"],
        requirements: ["체스판", "체스말"],
        curriculum: [
          { week: 1, title: "체스 기초", content: "말의 움직임과 기본 규칙" },
          { week: 2, title: "오프닝 전략", content: "게임 시작 전략" },
          { week: 3, title: "중반 전술", content: "공격과 방어 기술" },
          { week: 4, title: "엔드게임", content: "게임 마무리 전략" },
        ],
      },
      {
        id: randomUUID(),
        name: "캠핑",
        category: "여가",
        description: "자연 속에서 하루를 보내는 야외 활동. 가족, 친구와 함께 자연을 즐기며 휴식을 취할 수 있습니다.",
        difficulty: 2,
        indoorOutdoor: "outdoor" as const,
        socialIndividual: "both" as const,
        budget: "medium" as const,
        imageUrl: "/camping.jpg",
        videoUrl: null,
        benefits: ["자연 교감", "스트레스 해소", "사회적 교류", "신체 활동"],
        requirements: ["텐트", "침낭", "버너", "랜턴", "의자"],
        curriculum: null,
      },
      {
        id: randomUUID(),
        name: "마술",
        category: "문화",
        description: "손재주와 연출로 관객을 놀라게 하는 예술. 창의력과 손기술을 키우며 즐거움을 선사할 수 있습니다.",
        difficulty: 3,
        indoorOutdoor: "indoor" as const,
        socialIndividual: "both" as const,
        budget: "medium" as const,
        imageUrl: "/magic.jpg",
        videoUrl: null,
        benefits: ["손재주", "창의력", "자신감", "소통 능력"],
        requirements: ["마술 도구", "연습용 카드", "거울"],
        curriculum: [
          { week: 1, title: "카드 마술 기초", content: "기본 카드 조작법" },
          { week: 2, title: "코인 마술", content: "코인 사라지기" },
          { week: 3, title: "로프 마술", content: "로프 자르기와 복원" },
          { week: 4, title: "무대 연출", content: "관객과 소통하는 법" },
        ],
      },
      {
        id: randomUUID(),
        name: "골동품 감정",
        category: "수집",
        description: "오래된 물건의 가치를 판단하고 수집하는 활동. 역사와 예술에 대한 안목을 키울 수 있습니다.",
        difficulty: 4,
        indoorOutdoor: "both" as const,
        socialIndividual: "individual" as const,
        budget: "high" as const,
        imageUrl: "/antique.jpg",
        videoUrl: null,
        benefits: ["역사 지식", "감정 능력", "투자 가치", "문화 이해"],
        requirements: ["돋보기", "참고서적", "보관 도구"],
        curriculum: null,
      },
      {
        id: randomUUID(),
        name: "궁도",
        category: "스포츠",
        description: "전통 활쏘기를 통해 심신을 수련하는 한국 전통 무예. 집중력과 인내심을 기를 수 있습니다.",
        difficulty: 3,
        indoorOutdoor: "outdoor" as const,
        socialIndividual: "both" as const,
        budget: "medium" as const,
        imageUrl: "/archery.jpg",
        videoUrl: null,
        benefits: ["집중력", "인내심", "전통 계승", "심신 단련"],
        requirements: ["활", "화살", "각궁", "보호 장비"],
        curriculum: [
          { week: 1, title: "궁도 예절", content: "활터 예절과 기본 자세" },
          { week: 2, title: "시위 걸기", content: "화살 거는 법" },
          { week: 3, title: "조준법", content: "과녁 조준 기술" },
          { week: 4, title: "시사", content: "화살 쏘는 연습" },
        ],
      },
      {
        id: randomUUID(),
        name: "카약",
        category: "스포츠",
        description: "작은 배를 타고 물 위를 이동하는 수상 스포츠. 상체 근력과 균형감각을 기를 수 있습니다.",
        difficulty: 3,
        indoorOutdoor: "outdoor" as const,
        socialIndividual: "both" as const,
        budget: "high" as const,
        imageUrl: "/kayaking.jpg",
        videoUrl: null,
        benefits: ["상체 근력", "균형감각", "자연 감상", "모험심"],
        requirements: ["카약", "패들", "구명조끼", "헬멧"],
        curriculum: null,
      },
      {
        id: randomUUID(),
        name: "천문학",
        category: "과학",
        description: "별과 우주를 관찰하고 연구하는 학문. 우주의 신비를 탐구하며 지적 호기심을 충족할 수 있습니다.",
        difficulty: 3,
        indoorOutdoor: "outdoor" as const,
        socialIndividual: "both" as const,
        budget: "high" as const,
        imageUrl: "/astronomy.jpg",
        videoUrl: null,
        benefits: ["지적 호기심", "과학 지식", "관찰력", "사색"],
        requirements: ["망원경", "성도", "쌍안경", "천문 앱"],
        curriculum: [
          { week: 1, title: "천문학 기초", content: "별자리와 행성" },
          { week: 2, title: "망원경 사용법", content: "망원경 조작과 관측" },
          { week: 3, title: "달 관측", content: "달의 위상 관찰" },
          { week: 4, title: "행성 찾기", content: "화성, 목성 관측" },
        ],
      },
      {
        id: randomUUID(),
        name: "반려견 훈련",
        category: "반려동물",
        description: "반려견의 행동을 교정하고 훈련하는 활동. 반려견과의 유대감을 높이고 책임감을 기를 수 있습니다.",
        difficulty: 2,
        indoorOutdoor: "both" as const,
        socialIndividual: "individual" as const,
        budget: "medium" as const,
        imageUrl: "/dog-training.jpg",
        videoUrl: null,
        benefits: ["유대감", "책임감", "인내심", "소통 능력"],
        requirements: ["간식", "클리커", "목줄", "훈련 도구"],
        curriculum: [
          { week: 1, title: "기본 명령어", content: "앉아, 기다려, 이리와" },
          { week: 2, title: "산책 훈련", content: "줄 당기지 않기" },
          { week: 3, title: "사회화", content: "다른 강아지와 교류" },
          { week: 4, title: "응용 훈련", content: "손 터치, 돌기" },
        ],
      },
      {
        id: randomUUID(),
        name: "철학 독서",
        category: "문화",
        description: "철학 서적을 읽고 사유하는 활동. 삶의 의미를 탐구하고 깊은 사고력을 기를 수 있습니다.",
        difficulty: 4,
        indoorOutdoor: "indoor" as const,
        socialIndividual: "both" as const,
        budget: "low" as const,
        imageUrl: "/philosophy.jpg",
        videoUrl: null,
        benefits: ["사고력", "통찰력", "삶의 지혜", "토론 능력"],
        requirements: ["철학 서적", "노트", "필기구"],
        curriculum: null,
      },
      {
        id: randomUUID(),
        name: "암벽등반",
        category: "스포츠",
        description: "인공 또는 자연 암벽을 오르는 익스트림 스포츠. 전신 근력과 문제 해결 능력을 키울 수 있습니다.",
        difficulty: 5,
        indoorOutdoor: "both" as const,
        socialIndividual: "both" as const,
        budget: "medium" as const,
        imageUrl: "/rock-climbing.jpg",
        videoUrl: null,
        benefits: ["전신 근력", "문제 해결", "도전 정신", "집중력"],
        requirements: ["암벽화", "하네스", "초크", "헬멧"],
        curriculum: [
          { week: 1, title: "안전 교육", content: "장비 사용법과 안전 수칙" },
          { week: 2, title: "기본 동작", content: "손잡이와 발판 사용" },
          { week: 3, title: "초급 코스", content: "쉬운 벽 오르기" },
          { week: 4, title: "중급 기술", content: "루트 읽기와 전략" },
        ],
      },
      {
        id: randomUUID(),
        name: "연극",
        category: "문화",
        description: "무대에서 배역을 연기하는 예술 활동. 표현력과 자신감을 키우며 팀워크를 배울 수 있습니다.",
        difficulty: 3,
        indoorOutdoor: "indoor" as const,
        socialIndividual: "social" as const,
        budget: "low" as const,
        imageUrl: "/theater.jpg",
        videoUrl: null,
        benefits: ["표현력", "자신감", "협동심", "창의력"],
        requirements: ["대본", "의상", "연습 공간"],
        curriculum: [
          { week: 1, title: "연기 기초", content: "발성과 표정 연습" },
          { week: 2, title: "대본 리딩", content: "대사 읽기와 분석" },
          { week: 3, title: "캐릭터 연구", content: "배역 이해하기" },
          { week: 4, title: "무대 연습", content: "동선과 연기 합치기" },
        ],
      },
      {
        id: randomUUID(),
        name: "코딩",
        category: "기술",
        description: "프로그래밍 언어를 배워 소프트웨어를 만드는 활동. 논리적 사고와 창의력을 키울 수 있습니다.",
        difficulty: 4,
        indoorOutdoor: "indoor" as const,
        socialIndividual: "individual" as const,
        budget: "low" as const,
        imageUrl: "/coding.jpg",
        videoUrl: null,
        benefits: ["논리적 사고", "문제 해결", "창의력", "기술 습득"],
        requirements: ["컴퓨터", "인터넷", "코딩 에디터"],
        curriculum: [
          { week: 1, title: "프로그래밍 기초", content: "변수와 데이터 타입" },
          { week: 2, title: "조건문과 반복문", content: "if문과 for문" },
          { week: 3, title: "함수", content: "함수 만들기와 사용" },
          { week: 4, title: "간단한 프로그램", content: "계산기 만들기" },
        ],
      },
    ];

    for (const hobby of newHobbies) {
      await db.insert(hobbies).values(hobby);
      console.log(`✓ Added: ${hobby.name} (${hobby.category})`);
    }

    console.log("\n=== Summary ===");
    const finalCount = await db.select().from(hobbies);
    console.log(`Total hobbies: ${finalCount.length}`);
    console.log(`Deleted: ${hobbiestoDelete.length}`);
    console.log(`Added: ${newHobbies.length}`);
    console.log("\n✅ Hobby management completed!");

  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
  process.exit(0);
}

manageHobbies();
