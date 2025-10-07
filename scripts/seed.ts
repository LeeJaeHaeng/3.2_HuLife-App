import { db } from '../lib/db';
import { hobbies } from '../lib/db/schema';
import { randomUUID } from 'crypto';

const sampleHobbies = [
  {
    id: randomUUID(),
    name: "수채화",
    category: "미술",
    description: "물감과 붓을 이용한 아름다운 그림 그리기. 초보자도 쉽게 시작할 수 있으며, 창의력과 집중력을 향상시킵니다.",
    difficulty: 2,
    indoorOutdoor: "indoor" as const,
    socialIndividual: "both" as const,
    budget: "medium" as const,
    imageUrl: "/watercolor-painting-hobby-for-seniors.jpg",
    videoUrl: null,
    benefits: ["창의력 향상", "스트레스 해소", "집중력 개선", "소근육 발달"],
    requirements: ["수채화 물감 세트", "붓", "수채화 종이", "물통"],
    curriculum: [
      { week: 1, title: "기초 도구 사용법", content: "붓 잡는 법, 물감 섞기, 종이 선택하기" },
      { week: 2, title: "기본 기법 익히기", content: "번지기, 그라데이션, 레이어링 기법" },
      { week: 3, title: "간단한 풍경화", content: "하늘, 나무, 산 그리기" },
      { week: 4, title: "정물화 그리기", content: "과일, 꽃 등 정물 표현하기" },
    ],
  },
  {
    id: randomUUID(),
    name: "등산",
    category: "스포츠",
    description: "자연 속에서 즐기는 건강한 운동. 심폐 기능 향상과 함께 아름다운 경치를 감상할 수 있습니다.",
    difficulty: 3,
    indoorOutdoor: "outdoor" as const,
    socialIndividual: "both" as const,
    budget: "low" as const,
    imageUrl: "/senior-hiking-group-mountain.jpg",
    videoUrl: null,
    benefits: ["심폐 기능 향상", "근력 강화", "자연 치유", "사회적 교류"],
    requirements: ["등산화", "등산복", "배낭", "등산 스틱"],
    curriculum: [
      { week: 1, title: "등산 기초", content: "장비 선택, 안전 수칙, 스트레칭" },
      { week: 2, title: "초급 코스 도전", content: "낮은 산 등반, 호흡법 익히기" },
      { week: 3, title: "중급 코스 도전", content: "중급 산 등반, 체력 관리" },
      { week: 4, title: "고급 기술", content: "긴 코스 등반, 날씨 대응법" },
    ],
  },
  {
    id: randomUUID(),
    name: "서예",
    category: "문화",
    description: "붓과 먹으로 아름다운 글씨를 쓰는 전통 예술. 마음의 평화와 집중력을 기를 수 있습니다.",
    difficulty: 3,
    indoorOutdoor: "indoor" as const,
    socialIndividual: "individual" as const,
    budget: "medium" as const,
    imageUrl: "/korean-calligraphy-senior-hobby.jpg",
    videoUrl: null,
    benefits: ["집중력 향상", "마음의 평화", "전통 문화 이해", "손글씨 개선"],
    requirements: ["붓", "먹", "벼루", "한지"],
    curriculum: null,
  },
  {
    id: randomUUID(),
    name: "요가",
    category: "건강",
    description: "몸과 마음의 균형을 찾는 운동. 유연성과 근력을 동시에 기를 수 있습니다.",
    difficulty: 2,
    indoorOutdoor: "indoor" as const,
    socialIndividual: "both" as const,
    budget: "low" as const,
    imageUrl: "/senior-yoga-class-peaceful.jpg",
    videoUrl: null,
    benefits: ["유연성 향상", "근력 강화", "스트레스 해소", "균형감각 개선"],
    requirements: ["요가 매트", "편한 운동복", "요가 블록"],
    curriculum: null,
  },
  {
    id: randomUUID(),
    name: "사진",
    category: "예술",
    description: "카메라로 순간을 포착하는 예술. 세상을 새로운 시각으로 바라보는 법을 배웁니다.",
    difficulty: 3,
    indoorOutdoor: "both" as const,
    socialIndividual: "individual" as const,
    budget: "high" as const,
    imageUrl: "/senior-photography-hobby-camera.jpg",
    videoUrl: null,
    benefits: ["관찰력 향상", "창의력 개발", "추억 기록", "예술적 감각"],
    requirements: ["카메라", "렌즈", "삼각대", "메모리 카드"],
    curriculum: null,
  },
  {
    id: randomUUID(),
    name: "원예",
    category: "자연",
    description: "식물을 키우며 자연과 교감하는 활동. 정서적 안정과 성취감을 느낄 수 있습니다.",
    difficulty: 2,
    indoorOutdoor: "outdoor" as const,
    socialIndividual: "individual" as const,
    budget: "medium" as const,
    imageUrl: "/senior-gardening-community.jpg",
    videoUrl: null,
    benefits: ["정서적 안정", "성취감", "신체 활동", "자연 교감"],
    requirements: ["화분", "흙", "씨앗/모종", "원예 도구"],
    curriculum: null,
  },
];

async function seed() {
  try {
    console.log("Seeding database with sample hobbies...");

    // Check if hobbies already exist
    const existingHobbies = await db.query.hobbies.findMany();
    if (existingHobbies.length > 0) {
      console.log(`Database already has ${existingHobbies.length} hobbies. Skipping seed.`);
      return;
    }

    // Insert sample hobbies
    await db.insert(hobbies).values(sampleHobbies);

    console.log(`Successfully seeded ${sampleHobbies.length} hobbies!`);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
  process.exit(0);
}

seed();
