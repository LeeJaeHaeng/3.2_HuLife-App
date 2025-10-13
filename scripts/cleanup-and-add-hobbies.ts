import { db } from '../lib/db';
import { hobbies } from '../lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { randomUUID } from 'crypto';

async function cleanupAndAddHobbies() {
  try {
    console.log("=== Step 1: Checking Existing Hobbies ===\n");

    // 기존 취미 목록 가져오기
    const allHobbies = await db.select().from(hobbies);
    const existingHobbyNames = new Set(allHobbies.map(h => h.name));

    // 중복된 취미들 확인 (삭제는 하지 않음)
    const hobbyNames = new Map<string, number>();
    allHobbies.forEach(hobby => {
      hobbyNames.set(hobby.name, (hobbyNames.get(hobby.name) || 0) + 1);
    });

    console.log("⚠️  Duplicate hobbies found (not deleted due to foreign key constraints):");
    for (const [name, count] of hobbyNames.entries()) {
      if (count > 1) {
        console.log(`  - ${name} (${count} entries)`);
      }
    }

    console.log("\n=== Step 2: Adding New Hobbies ===\n");

    const newHobbies = [
      // 음악
      {
        id: randomUUID(),
        name: "색소폰",
        category: "음악",
        description: "부드럽고 감미로운 소리를 내는 관악기. 재즈와 클래식을 연주하며 음악적 감성을 키울 수 있습니다.",
        difficulty: 4,
        indoorOutdoor: "indoor" as const,
        socialIndividual: "both" as const,
        budget: "high" as const,
        imageUrl: "/saxophone.jpg",
        videoUrl: null,
        benefits: ["음악 감성", "폐활량 증가", "집중력", "표현력"],
        requirements: ["색소폰", "리드", "악보", "스탠드"],
        curriculum: [
          { week: 1, title: "악기 구조", content: "색소폰의 부분과 조립법" },
          { week: 2, title: "호흡과 소리", content: "입모양과 호흡법" },
          { week: 3, title: "음계 연습", content: "도레미파솔라시도" },
          { week: 4, title: "간단한 곡", content: "쉬운 멜로디 연주" },
        ],
      },
      {
        id: randomUUID(),
        name: "바이올린",
        category: "음악",
        description: "아름다운 선율을 만드는 현악기. 클래식 음악의 정수를 느끼며 예술적 감각을 기를 수 있습니다.",
        difficulty: 5,
        indoorOutdoor: "indoor" as const,
        socialIndividual: "both" as const,
        budget: "high" as const,
        imageUrl: "/violin.jpg",
        videoUrl: null,
        benefits: ["음악성", "집중력", "손가락 민첩성", "예술 감각"],
        requirements: ["바이올린", "활", "송진", "어깨받침"],
        curriculum: [
          { week: 1, title: "바이올린 잡기", content: "악기와 활 잡는 법" },
          { week: 2, title: "활 긋기", content: "활로 줄 긋는 연습" },
          { week: 3, title: "음정 익히기", content: "손가락 위치" },
          { week: 4, title: "스케일 연습", content: "음계 연주" },
        ],
      },
      {
        id: randomUUID(),
        name: "첼로",
        category: "음악",
        description: "깊고 풍부한 음색의 현악기. 오케스트라의 중저음을 담당하며 감동적인 선율을 연주합니다.",
        difficulty: 5,
        indoorOutdoor: "indoor" as const,
        socialIndividual: "both" as const,
        budget: "high" as const,
        imageUrl: "/cello.jpg",
        videoUrl: null,
        benefits: ["음악 감성", "자세 교정", "집중력", "정서적 안정"],
        requirements: ["첼로", "활", "송진", "첼로 스탠드"],
        curriculum: null,
      },
      {
        id: randomUUID(),
        name: "플루트",
        category: "음악",
        description: "맑고 청아한 소리의 관악기. 휴대가 간편하고 아름다운 선율을 연주할 수 있습니다.",
        difficulty: 3,
        indoorOutdoor: "indoor" as const,
        socialIndividual: "both" as const,
        budget: "medium" as const,
        imageUrl: "/flute.jpg",
        videoUrl: null,
        benefits: ["폐활량", "집중력", "음악성", "호흡 조절"],
        requirements: ["플루트", "청소 도구", "악보"],
        curriculum: null,
      },
      // 공예
      {
        id: randomUUID(),
        name: "도예",
        category: "공예",
        description: "흙으로 그릇과 작품을 만드는 전통 공예. 창의력과 집중력을 키우며 실용적인 작품을 만들 수 있습니다.",
        difficulty: 4,
        indoorOutdoor: "indoor" as const,
        socialIndividual: "both" as const,
        budget: "medium" as const,
        imageUrl: "/pottery.jpg",
        videoUrl: null,
        benefits: ["창의력", "집중력", "손재주", "성취감"],
        requirements: ["물레", "흙", "가마", "도구"],
        curriculum: [
          { week: 1, title: "흙 다루기", content: "흙 치대기와 준비" },
          { week: 2, title: "물레 돌리기", content: "물레 사용법" },
          { week: 3, title: "그릇 만들기", content: "간단한 접시 제작" },
          { week: 4, title: "유약과 굽기", content: "색칠하고 구워내기" },
        ],
      },
      {
        id: randomUUID(),
        name: "염색",
        category: "공예",
        description: "천에 다양한 무늬와 색을 입히는 예술. 전통 기법을 배우며 창의적인 작품을 만들 수 있습니다.",
        difficulty: 3,
        indoorOutdoor: "indoor" as const,
        socialIndividual: "both" as const,
        budget: "medium" as const,
        imageUrl: "/dyeing.jpg",
        videoUrl: null,
        benefits: ["창의력", "전통 계승", "미적 감각", "색감"],
        requirements: ["천", "염료", "고무줄", "장갑"],
        curriculum: null,
      },
      {
        id: randomUUID(),
        name: "매듭공예",
        category: "공예",
        description: "끈으로 아름다운 매듭을 만드는 전통 공예. 정교한 손기술과 인내심을 기를 수 있습니다.",
        difficulty: 3,
        indoorOutdoor: "indoor" as const,
        socialIndividual: "individual" as const,
        budget: "low" as const,
        imageUrl: "/macrame.jpg",
        videoUrl: null,
        benefits: ["손재주", "집중력", "전통 계승", "인내심"],
        requirements: ["매듭끈", "바늘", "참고서"],
        curriculum: null,
      },
      {
        id: randomUUID(),
        name: "유리공예",
        category: "공예",
        description: "유리를 녹여 다양한 작품을 만드는 예술. 창의적이고 독특한 장식품을 제작할 수 있습니다.",
        difficulty: 5,
        indoorOutdoor: "indoor" as const,
        socialIndividual: "individual" as const,
        budget: "high" as const,
        imageUrl: "/glass-art.jpg",
        videoUrl: null,
        benefits: ["창의력", "예술성", "집중력", "독창성"],
        requirements: ["유리", "토치", "안전 장비", "작업대"],
        curriculum: null,
      },
      // 문화/전통
      {
        id: randomUUID(),
        name: "다도",
        category: "문화",
        description: "차를 우려 마시는 전통 예절. 마음의 평화와 예의범절을 배울 수 있습니다.",
        difficulty: 2,
        indoorOutdoor: "indoor" as const,
        socialIndividual: "both" as const,
        budget: "medium" as const,
        imageUrl: "/tea-ceremony.jpg",
        videoUrl: null,
        benefits: ["마음의 평화", "예절", "집중력", "전통 계승"],
        requirements: ["다기", "차", "다석", "다포"],
        curriculum: null,
      },
      {
        id: randomUUID(),
        name: "전통춤",
        category: "문화",
        description: "한국 전통 춤을 배우고 연습하는 활동. 우아한 동작으로 전통 문화를 계승할 수 있습니다.",
        difficulty: 3,
        indoorOutdoor: "indoor" as const,
        socialIndividual: "both" as const,
        budget: "low" as const,
        imageUrl: "/traditional-dance.jpg",
        videoUrl: null,
        benefits: ["유연성", "전통 계승", "표현력", "문화 이해"],
        requirements: ["한복", "부채", "연습 공간"],
        curriculum: null,
      },
      {
        id: randomUUID(),
        name: "판소리",
        category: "문화",
        description: "소리와 이야기로 전하는 전통 예술. 발성과 표현력을 키우며 전통 문화를 배울 수 있습니다.",
        difficulty: 4,
        indoorOutdoor: "indoor" as const,
        socialIndividual: "both" as const,
        budget: "low" as const,
        imageUrl: "/pansori.jpg",
        videoUrl: null,
        benefits: ["발성", "표현력", "전통 계승", "폐활량"],
        requirements: ["부채", "악보", "북"],
        curriculum: null,
      },
      // 건강/운동
      {
        id: randomUUID(),
        name: "기공",
        category: "건강",
        description: "호흡과 동작으로 기를 다스리는 건강법. 심신의 균형과 건강을 증진할 수 있습니다.",
        difficulty: 2,
        indoorOutdoor: "both" as const,
        socialIndividual: "both" as const,
        budget: "low" as const,
        imageUrl: "/qigong.jpg",
        videoUrl: null,
        benefits: ["건강 증진", "스트레스 해소", "균형감", "집중력"],
        requirements: ["편한 옷", "운동화"],
        curriculum: null,
      },
      {
        id: randomUUID(),
        name: "헬스",
        category: "건강",
        description: "기구를 이용한 근력 운동. 체력과 근력을 키우며 건강한 몸을 만들 수 있습니다.",
        difficulty: 2,
        indoorOutdoor: "indoor" as const,
        socialIndividual: "both" as const,
        budget: "medium" as const,
        imageUrl: "/fitness.jpg",
        videoUrl: null,
        benefits: ["근력 강화", "체력 증진", "건강", "자신감"],
        requirements: ["운동복", "운동화", "헬스장 등록"],
        curriculum: [
          { week: 1, title: "기구 사용법", content: "안전한 운동 방법" },
          { week: 2, title: "상체 운동", content: "가슴, 어깨, 팔 운동" },
          { week: 3, title: "하체 운동", content: "다리, 엉덩이 운동" },
          { week: 4, title: "코어 운동", content: "복근과 허리 운동" },
        ],
      },
      {
        id: randomUUID(),
        name: "에어로빅",
        category: "건강",
        description: "음악에 맞춰 움직이는 유산소 운동. 체력을 키우고 스트레스를 해소할 수 있습니다.",
        difficulty: 2,
        indoorOutdoor: "indoor" as const,
        socialIndividual: "social" as const,
        budget: "low" as const,
        imageUrl: "/aerobics.jpg",
        videoUrl: null,
        benefits: ["심폐 지구력", "체중 관리", "스트레스 해소", "협동심"],
        requirements: ["운동복", "운동화"],
        curriculum: null,
      },
      // 기술
      {
        id: randomUUID(),
        name: "드론 조종",
        category: "기술",
        description: "드론을 조종하며 항공 촬영을 즐기는 활동. 새로운 기술을 배우며 창의적인 영상을 만들 수 있습니다.",
        difficulty: 3,
        indoorOutdoor: "outdoor" as const,
        socialIndividual: "individual" as const,
        budget: "high" as const,
        imageUrl: "/drone.jpg",
        videoUrl: null,
        benefits: ["기술 습득", "창의력", "공간 지각력", "집중력"],
        requirements: ["드론", "조종기", "배터리", "메모리 카드"],
        curriculum: [
          { week: 1, title: "드론 기초", content: "드론의 구조와 원리" },
          { week: 2, title: "조종 연습", content: "이륙과 착륙" },
          { week: 3, title: "비행 기술", content: "전진, 후진, 회전" },
          { week: 4, title: "촬영 기법", content: "항공 사진과 영상" },
        ],
      },
      {
        id: randomUUID(),
        name: "앱 개발",
        category: "기술",
        description: "스마트폰 애플리케이션을 만드는 활동. 프로그래밍 능력을 키우며 실용적인 앱을 제작할 수 있습니다.",
        difficulty: 5,
        indoorOutdoor: "indoor" as const,
        socialIndividual: "individual" as const,
        budget: "low" as const,
        imageUrl: "/app-development.jpg",
        videoUrl: null,
        benefits: ["논리적 사고", "창의력", "문제 해결", "기술 습득"],
        requirements: ["컴퓨터", "개발 도구", "인터넷"],
        curriculum: null,
      },
      // 요리
      {
        id: randomUUID(),
        name: "제빵",
        category: "요리",
        description: "빵을 만드는 활동. 다양한 빵을 직접 구우며 성취감과 즐거움을 느낄 수 있습니다.",
        difficulty: 3,
        indoorOutdoor: "indoor" as const,
        socialIndividual: "individual" as const,
        budget: "medium" as const,
        imageUrl: "/bread-making.jpg",
        videoUrl: null,
        benefits: ["성취감", "창의력", "집중력", "실용성"],
        requirements: ["오븐", "믹서", "재료", "베이킹 도구"],
        curriculum: [
          { week: 1, title: "빵의 기초", content: "재료와 발효 원리" },
          { week: 2, title: "반죽하기", content: "손 반죽 기술" },
          { week: 3, title: "식빵 만들기", content: "기본 식빵 제작" },
          { week: 4, title: "다양한 빵", content: "크루아상, 바게트" },
        ],
      },
      {
        id: randomUUID(),
        name: "케이크 데코",
        category: "요리",
        description: "케이크를 아름답게 장식하는 기술. 예술적 감각과 창의력을 발휘할 수 있습니다.",
        difficulty: 4,
        indoorOutdoor: "indoor" as const,
        socialIndividual: "individual" as const,
        budget: "medium" as const,
        imageUrl: "/cake-decoration.jpg",
        videoUrl: null,
        benefits: ["창의력", "미적 감각", "손재주", "성취감"],
        requirements: ["케이크", "크림", "장식 도구", "색소"],
        curriculum: null,
      },
      {
        id: randomUUID(),
        name: "중식 요리",
        category: "요리",
        description: "중국 요리를 배우고 만드는 활동. 다양한 조리법과 맛을 경험할 수 있습니다.",
        difficulty: 3,
        indoorOutdoor: "indoor" as const,
        socialIndividual: "both" as const,
        budget: "medium" as const,
        imageUrl: "/chinese-cooking.jpg",
        videoUrl: null,
        benefits: ["요리 실력", "문화 이해", "창의력", "실용성"],
        requirements: ["웨팍", "칼", "재료", "조리 도구"],
        curriculum: null,
      },
      {
        id: randomUUID(),
        name: "일식 요리",
        category: "요리",
        description: "일본 요리를 배우고 만드는 활동. 섬세한 조리법과 플레이팅을 배울 수 있습니다.",
        difficulty: 4,
        indoorOutdoor: "indoor" as const,
        socialIndividual: "both" as const,
        budget: "medium" as const,
        imageUrl: "/japanese-cooking.jpg",
        videoUrl: null,
        benefits: ["요리 실력", "미적 감각", "문화 이해", "정교함"],
        requirements: ["칼", "재료", "조리 도구", "식기"],
        curriculum: null,
      },
      {
        id: randomUUID(),
        name: "양식 요리",
        category: "요리",
        description: "서양 요리를 배우고 만드는 활동. 다양한 코스 요리를 마스터할 수 있습니다.",
        difficulty: 3,
        indoorOutdoor: "indoor" as const,
        socialIndividual: "both" as const,
        budget: "medium" as const,
        imageUrl: "/western-cooking.jpg",
        videoUrl: null,
        benefits: ["요리 실력", "창의력", "문화 이해", "실용성"],
        requirements: ["팬", "칼", "재료", "조리 도구"],
        curriculum: null,
      },
      // 봉사
      {
        id: randomUUID(),
        name: "재능 기부",
        category: "봉사",
        description: "자신의 재능을 나누는 봉사 활동. 타인을 돕고 보람을 느낄 수 있습니다.",
        difficulty: 2,
        indoorOutdoor: "both" as const,
        socialIndividual: "both" as const,
        budget: "low" as const,
        imageUrl: "/volunteer-talent.jpg",
        videoUrl: null,
        benefits: ["보람", "사회 공헌", "인간관계", "자존감"],
        requirements: ["자신의 재능", "시간"],
        curriculum: null,
      },
      {
        id: randomUUID(),
        name: "어린이 교육",
        category: "봉사",
        description: "아이들에게 지식과 경험을 전달하는 봉사. 세대 간 소통과 보람을 느낄 수 있습니다.",
        difficulty: 2,
        indoorOutdoor: "indoor" as const,
        socialIndividual: "social" as const,
        budget: "low" as const,
        imageUrl: "/children-education.jpg",
        videoUrl: null,
        benefits: ["보람", "세대 교류", "지식 전달", "사회 공헌"],
        requirements: ["교육 자료", "시간", "인내심"],
        curriculum: null,
      },
      // 수집
      {
        id: randomUUID(),
        name: "모형 제작",
        category: "수집",
        description: "프라모델이나 미니어처를 조립하는 취미. 정교한 손기술과 집중력을 키울 수 있습니다.",
        difficulty: 3,
        indoorOutdoor: "indoor" as const,
        socialIndividual: "individual" as const,
        budget: "medium" as const,
        imageUrl: "/model-making.jpg",
        videoUrl: null,
        benefits: ["집중력", "손재주", "성취감", "인내심"],
        requirements: ["모형 키트", "접착제", "도구", "도료"],
        curriculum: null,
      },
      {
        id: randomUUID(),
        name: "레고",
        category: "수집",
        description: "레고 블록으로 다양한 작품을 만드는 활동. 창의력과 공간 지각력을 키울 수 있습니다.",
        difficulty: 2,
        indoorOutdoor: "indoor" as const,
        socialIndividual: "both" as const,
        budget: "medium" as const,
        imageUrl: "/lego.jpg",
        videoUrl: null,
        benefits: ["창의력", "공간 지각력", "집중력", "재미"],
        requirements: ["레고 세트", "보관함"],
        curriculum: null,
      },
    ];

    let addedCount = 0;
    let skippedCount = 0;

    for (const hobby of newHobbies) {
      if (existingHobbyNames.has(hobby.name)) {
        console.log(`⊘ Skipped (already exists): ${hobby.name}`);
        skippedCount++;
        continue;
      }

      await db.insert(hobbies).values(hobby);
      console.log(`✓ Added: ${hobby.name} (${hobby.category})`);
      addedCount++;
    }

    console.log("\n=== Summary ===");
    console.log(`✅ Successfully added: ${addedCount}`);
    console.log(`⊘ Skipped (already exists): ${skippedCount}`);
    console.log(`Total attempted: ${newHobbies.length}`);

    const finalCount = await db.select().from(hobbies);
    console.log(`\nTotal hobbies in database: ${finalCount.length}`);

  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
  process.exit(0);
}

cleanupAndAddHobbies();
