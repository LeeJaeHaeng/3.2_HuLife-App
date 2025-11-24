/**
 * 🎯 HuLife 종합 샘플 데이터 생성 스크립트
 *
 * 모든 기능을 테스트할 수 있도록 다음 데이터를 생성합니다:
 * - 사용자 10명
 * - 취미 30개 (카테고리별)
 * - 커뮤니티 15개
 * - 게시글 30개 + 댓글
 * - 리뷰 50개
 * - 갤러리 작품 20개 + 댓글
 * - 일정 샘플
 * - 채팅 메시지
 */

import { db } from '../lib/db';
import {
  users,
  hobbies,
  communities,
  communityMembers,
  chatRooms,
  chatMessages,
  posts,
  postComments,
  postLikes,
  reviews,
  galleryItems,
  galleryComments,
  galleryLikes,
  userHobbies,
  schedules,
  surveyResponses,
} from '../lib/db/schema';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';

// ===== 1. 사용자 데이터 =====
const sampleUsers = [
  { email: 'test@hulife.com', password: 'test1234', name: '테스트 유저', age: 30, location: '서울' },
  { email: 'kim@hulife.com', password: 'test1234', name: '김영희', age: 45, location: '부산' },
  { email: 'lee@hulife.com', password: 'test1234', name: '이철수', age: 52, location: '인천' },
  { email: 'park@hulife.com', password: 'test1234', name: '박민수', age: 38, location: '대구' },
  { email: 'choi@hulife.com', password: 'test1234', name: '최수진', age: 41, location: '광주' },
  { email: 'jung@hulife.com', password: 'test1234', name: '정다은', age: 35, location: '대전' },
  { email: 'kang@hulife.com', password: 'test1234', name: '강호동', age: 48, location: '울산' },
  { email: 'yoon@hulife.com', password: 'test1234', name: '윤서연', age: 33, location: '세종' },
  { email: 'jang@hulife.com', password: 'test1234', name: '장미란', age: 50, location: '제주' },
  { email: 'shin@hulife.com', password: 'test1234', name: '신동엽', age: 44, location: '수원' },
];

// ===== 2. 취미 데이터 (30개) =====
const sampleHobbies = [
  // 운동/스포츠 (7개)
  { name: '요가', category: '운동/스포츠', description: '몸과 마음의 균형을 찾는 운동. 유연성과 근력을 동시에 기를 수 있습니다.', difficulty: 2, indoorOutdoor: 'indoor' as const, socialIndividual: 'both' as const, budget: 'low' as const, imageUrl: '/senior-yoga-class-peaceful.jpg', benefits: ['유연성 향상', '근력 강화', '스트레스 해소'], requirements: ['요가 매트', '편한 운동복'] },
  { name: '등산', category: '운동/스포츠', description: '자연 속에서 즐기는 건강한 운동. 심폐 기능 향상과 함께 아름다운 경치를 감상할 수 있습니다.', difficulty: 3, indoorOutdoor: 'outdoor' as const, socialIndividual: 'both' as const, budget: 'low' as const, imageUrl: '/senior-hiking-group-mountain.jpg', benefits: ['심폐 기능 향상', '근력 강화', '자연 치유'], requirements: ['등산화', '등산복', '배낭'] },
  { name: '수영', category: '운동/스포츠', description: '관절에 무리 없는 전신 운동. 여름철 시원하게 즐길 수 있습니다.', difficulty: 3, indoorOutdoor: 'indoor' as const, socialIndividual: 'individual' as const, budget: 'medium' as const, imageUrl: '/swimming.jpg', benefits: ['전신 근력', '심폐 지구력', '관절 보호'], requirements: ['수영복', '수영모', '물안경'] },
  { name: '자전거', category: '운동/스포츠', description: '야외에서 즐기는 유산소 운동. 경치를 감상하며 건강을 챙길 수 있습니다.', difficulty: 2, indoorOutdoor: 'outdoor' as const, socialIndividual: 'both' as const, budget: 'high' as const, imageUrl: '/cycling.jpg', benefits: ['하체 근력', '심폐 기능', '스트레스 해소'], requirements: ['자전거', '헬멧', '장갑'] },
  { name: '탁구', category: '운동/스포츠', description: '반사신경과 민첩성을 기르는 실내 운동. 친구들과 함께 즐길 수 있습니다.', difficulty: 2, indoorOutdoor: 'indoor' as const, socialIndividual: 'social' as const, budget: 'low' as const, imageUrl: '/table-tennis.jpg', benefits: ['반사신경', '집중력', '사회적 교류'], requirements: ['라켓', '운동화'] },
  { name: '게이트볼', category: '운동/스포츠', description: '팀워크와 전략이 필요한 야외 스포츠. 시니어들에게 인기가 많습니다.', difficulty: 1, indoorOutdoor: 'outdoor' as const, socialIndividual: 'social' as const, budget: 'low' as const, imageUrl: '/gateball.jpg', benefits: ['팀워크', '전략적 사고', '가벼운 운동'], requirements: ['게이트볼 세트', '편한 신발'] },
  { name: '태극권', category: '운동/스포츠', description: '느린 동작으로 몸의 균형과 집중력을 기르는 전통 무술. 명상 효과도 있습니다.', difficulty: 2, indoorOutdoor: 'both' as const, socialIndividual: 'both' as const, budget: 'low' as const, imageUrl: '/tai-chi.jpg', benefits: ['균형감각', '집중력', '명상'], requirements: ['편한 운동복'] },

  // 예술/창작 (7개)
  { name: '수채화', category: '예술/창작', description: '물감과 붓을 이용한 아름다운 그림 그리기. 초보자도 쉽게 시작할 수 있습니다.', difficulty: 2, indoorOutdoor: 'indoor' as const, socialIndividual: 'both' as const, budget: 'medium' as const, imageUrl: '/watercolor-painting-hobby-for-seniors.jpg', benefits: ['창의력 향상', '스트레스 해소', '집중력 개선'], requirements: ['수채화 물감 세트', '붓', '수채화 종이'] },
  { name: '사진', category: '예술/창작', description: '카메라로 순간을 포착하는 예술. 세상을 새로운 시각으로 바라보는 법을 배웁니다.', difficulty: 3, indoorOutdoor: 'both' as const, socialIndividual: 'individual' as const, budget: 'high' as const, imageUrl: '/senior-photography-hobby-camera.jpg', benefits: ['관찰력 향상', '창의력 개발', '추억 기록'], requirements: ['카메라', '렌즈', '삼각대'] },
  { name: '도자기', category: '예술/창작', description: '흙을 빚어 나만의 작품을 만드는 도예. 집중력과 인내심을 기를 수 있습니다.', difficulty: 4, indoorOutdoor: 'indoor' as const, socialIndividual: 'individual' as const, budget: 'high' as const, imageUrl: '/pottery.jpg', benefits: ['집중력', '창의력', '소근육 발달'], requirements: ['물레', '흙', '도구 세트'] },
  { name: '캘리그라피', category: '예술/창작', description: '붓으로 아름다운 글씨를 쓰는 예술. 마음의 평화를 찾을 수 있습니다.', difficulty: 3, indoorOutdoor: 'indoor' as const, socialIndividual: 'individual' as const, budget: 'medium' as const, imageUrl: '/calligraphy.jpg', benefits: ['집중력', '마음의 평화', '손글씨 개선'], requirements: ['붓', '먹', '한지'] },
  { name: '뜨개질', category: '예술/창작', description: '털실로 옷이나 소품을 만드는 수공예. 실용적이면서도 창의적인 취미입니다.', difficulty: 2, indoorOutdoor: 'indoor' as const, socialIndividual: 'both' as const, budget: 'low' as const, imageUrl: '/knitting.jpg', benefits: ['집중력', '소근육 발달', '실용성'], requirements: ['뜨개바늘', '털실'] },
  { name: '목공예', category: '예술/창작', description: '나무를 다듬어 가구나 소품을 만드는 공예. 성취감이 큰 취미입니다.', difficulty: 4, indoorOutdoor: 'indoor' as const, socialIndividual: 'individual' as const, budget: 'high' as const, imageUrl: '/woodwork.jpg', benefits: ['창의력', '집중력', '성취감'], requirements: ['목공 도구', '나무재료'] },
  { name: '종이접기', category: '예술/창작', description: '종이로 다양한 작품을 만드는 공예. 손쉽게 시작할 수 있습니다.', difficulty: 1, indoorOutdoor: 'indoor' as const, socialIndividual: 'both' as const, budget: 'low' as const, imageUrl: '/origami.jpg', benefits: ['소근육 발달', '집중력', '창의력'], requirements: ['색종이'] },

  // 문화/학습 (7개)
  { name: '서예', category: '문화/학습', description: '붓과 먹으로 아름다운 글씨를 쓰는 전통 예술. 마음의 평화와 집중력을 기를 수 있습니다.', difficulty: 3, indoorOutdoor: 'indoor' as const, socialIndividual: 'individual' as const, budget: 'medium' as const, imageUrl: '/korean-calligraphy-senior-hobby.jpg', benefits: ['집중력 향상', '마음의 평화', '전통 문화 이해'], requirements: ['붓', '먹', '벼루', '한지'] },
  { name: '영어 회화', category: '문화/학습', description: '외국어를 배워 새로운 세계와 소통하기. 두뇌 활동에 좋습니다.', difficulty: 3, indoorOutdoor: 'indoor' as const, socialIndividual: 'social' as const, budget: 'medium' as const, imageUrl: '/english.jpg', benefits: ['두뇌 활동', '사회적 교류', '자신감'], requirements: ['교재', '노트'] },
  { name: '한문 공부', category: '문화/학습', description: '한자와 한문 고전을 배우는 학습. 전통 문화에 대한 이해를 높일 수 있습니다.', difficulty: 4, indoorOutdoor: 'indoor' as const, socialIndividual: 'both' as const, budget: 'low' as const, imageUrl: '/chinese-classics.jpg', benefits: ['전통 문화 이해', '두뇌 활동', '집중력'], requirements: ['교재', '사전'] },
  { name: '역사 공부', category: '문화/학습', description: '우리나라와 세계의 역사를 배우는 학습. 교양을 쌓을 수 있습니다.', difficulty: 2, indoorOutdoor: 'indoor' as const, socialIndividual: 'both' as const, budget: 'low' as const, imageUrl: '/history.jpg', benefits: ['교양', '두뇌 활동', '대화 소재'], requirements: ['책', '노트'] },
  { name: '컴퓨터', category: '문화/학습', description: '디지털 세상과 소통하는 법을 배우기. 실생활에 유용합니다.', difficulty: 3, indoorOutdoor: 'indoor' as const, socialIndividual: 'both' as const, budget: 'high' as const, imageUrl: '/computer.jpg', benefits: ['디지털 문해력', '실용성', '소통'], requirements: ['컴퓨터', '인터넷'] },
  { name: '바둑', category: '문화/학습', description: '전략과 집중력이 필요한 두뇌 스포츠. 치매 예방에 좋습니다.', difficulty: 4, indoorOutdoor: 'indoor' as const, socialIndividual: 'social' as const, budget: 'low' as const, imageUrl: '/go.jpg', benefits: ['전략적 사고', '집중력', '사회적 교류'], requirements: ['바둑판', '바둑돌'] },
  { name: '장기', category: '문화/학습', description: '한국 전통 보드게임. 논리적 사고력을 키울 수 있습니다.', difficulty: 3, indoorOutdoor: 'indoor' as const, socialIndividual: 'social' as const, budget: 'low' as const, imageUrl: '/janggi.jpg', benefits: ['논리적 사고', '집중력', '전통 문화'], requirements: ['장기판', '장기알'] },

  // 음악/공연 (4개)
  { name: '노래교실', category: '음악/공연', description: '노래를 배우고 함께 부르는 즐거움. 스트레스 해소에 좋습니다.', difficulty: 1, indoorOutdoor: 'indoor' as const, socialIndividual: 'social' as const, budget: 'low' as const, imageUrl: '/singing.jpg', benefits: ['스트레스 해소', '폐활량', '사회적 교류'], requirements: ['악보', '마이크'] },
  { name: '악기 연주', category: '음악/공연', description: '피아노, 기타 등 악기를 배우는 음악 활동. 두뇌 발달에 좋습니다.', difficulty: 4, indoorOutdoor: 'indoor' as const, socialIndividual: 'individual' as const, budget: 'high' as const, imageUrl: '/instrument.jpg', benefits: ['두뇌 활동', '집중력', '성취감'], requirements: ['악기', '악보', '교재'] },
  { name: '국악', category: '음악/공연', description: '우리 전통 음악을 배우고 즐기기. 문화유산을 보존하는 의미도 있습니다.', difficulty: 4, indoorOutdoor: 'indoor' as const, socialIndividual: 'both' as const, budget: 'high' as const, imageUrl: '/korean-music.jpg', benefits: ['전통 문화', '예술성', '집중력'], requirements: ['악기', '한복'] },
  { name: '댄스', category: '음악/공연', description: '라인댄스, 사교댄스 등 음악에 맞춰 춤추기. 즐겁게 운동할 수 있습니다.', difficulty: 2, indoorOutdoor: 'indoor' as const, socialIndividual: 'social' as const, budget: 'low' as const, imageUrl: '/dance.jpg', benefits: ['운동', '사회적 교류', '스트레스 해소'], requirements: ['편한 신발', '운동복'] },

  // 자연/원예 (3개)
  { name: '원예', category: '자연/원예', description: '식물을 키우며 자연과 교감하는 활동. 정서적 안정과 성취감을 느낄 수 있습니다.', difficulty: 2, indoorOutdoor: 'outdoor' as const, socialIndividual: 'individual' as const, budget: 'medium' as const, imageUrl: '/senior-gardening-community.jpg', benefits: ['정서적 안정', '성취감', '신체 활동'], requirements: ['화분', '흙', '씨앗/모종', '원예 도구'] },
  { name: '낚시', category: '자연/원예', description: '호수나 바다에서 즐기는 여유로운 취미. 인내심을 기를 수 있습니다.', difficulty: 2, indoorOutdoor: 'outdoor' as const, socialIndividual: 'both' as const, budget: 'medium' as const, imageUrl: '/fishing.jpg', benefits: ['인내심', '자연 교감', '스트레스 해소'], requirements: ['낚싯대', '미끼', '의자'] },
  { name: '숲 체험', category: '자연/원예', description: '숲을 걸으며 자연을 느끼는 힐링 활동. 피톤치드로 건강도 챙길 수 있습니다.', difficulty: 1, indoorOutdoor: 'outdoor' as const, socialIndividual: 'both' as const, budget: 'low' as const, imageUrl: '/forest.jpg', benefits: ['자연 치유', '스트레스 해소', '가벼운 운동'], requirements: ['편한 신발', '물'] },

  // 요리/음식 (2개)
  { name: '요리', category: '요리/음식', description: '다양한 요리를 배우고 만드는 즐거움. 가족과 나눌 수 있습니다.', difficulty: 2, indoorOutdoor: 'indoor' as const, socialIndividual: 'both' as const, budget: 'medium' as const, imageUrl: '/cooking.jpg', benefits: ['실용성', '창의력', '가족 유대'], requirements: ['조리 도구', '재료'] },
  { name: '차 문화', category: '요리/음식', description: '다도를 배우고 차를 즐기는 여유로운 취미. 마음의 평화를 찾을 수 있습니다.', difficulty: 2, indoorOutdoor: 'indoor' as const, socialIndividual: 'both' as const, budget: 'medium' as const, imageUrl: '/tea-ceremony.jpg', benefits: ['마음의 평화', '전통 문화', '집중력'], requirements: ['다기', '차'] },
];

// ===== 3. 커뮤니티 데이터 (15개) =====
const communitiesData = [
  { name: '서울 요가 모임', hobbyName: '요가', description: '매주 토요일 아침에 함께 요가를 하는 모임입니다.', location: '서울 강남구', schedule: '매주 토요일 오전 10시', maxMembers: 20 },
  { name: '부산 등산 클럽', hobbyName: '등산', description: '주말마다 부산 근교 산을 등산하는 모임입니다.', location: '부산 해운대', schedule: '매주 일요일 오전 8시', maxMembers: 25 },
  { name: '수채화 동호회', hobbyName: '수채화', description: '수채화를 함께 배우고 작품을 공유하는 모임입니다.', location: '서울 종로구', schedule: '매주 수요일 오후 2시', maxMembers: 15 },
  { name: '인천 사진 클럽', hobbyName: '사진', description: '사진 출사를 다니며 실력을 키우는 모임입니다.', location: '인천 송도', schedule: '격주 토요일 오전 9시', maxMembers: 20 },
  { name: '대구 서예 모임', hobbyName: '서예', description: '전통 서예를 배우고 작품을 전시하는 모임입니다.', location: '대구 중구', schedule: '매주 목요일 오후 3시', maxMembers: 12 },
  { name: '광주 원예 클럽', hobbyName: '원예', description: '식물을 키우고 원예 지식을 나누는 모임입니다.', location: '광주 서구', schedule: '매주 화요일 오전 10시', maxMembers: 18 },
  { name: '대전 탁구 동호회', hobbyName: '탁구', description: '탁구를 즐기며 건강을 챙기는 모임입니다.', location: '대전 유성구', schedule: '매주 금요일 오후 4시', maxMembers: 16 },
  { name: '제주 자전거 클럽', hobbyName: '자전거', description: '제주 올레길을 자전거로 달리는 모임입니다.', location: '제주시', schedule: '격주 일요일 오전 7시', maxMembers: 20 },
  { name: '수원 노래교실', hobbyName: '노래교실', description: '함께 노래를 배우고 부르는 즐거운 모임입니다.', location: '수원 팔달구', schedule: '매주 월요일 오후 2시', maxMembers: 30 },
  { name: '울산 낚시 동호회', hobbyName: '낚시', description: '바다낚시를 즐기는 시니어 모임입니다.', location: '울산 동구', schedule: '매주 토요일 오전 5시', maxMembers: 15 },
  { name: '세종 바둑 클럽', hobbyName: '바둑', description: '바둑을 두며 친목을 다지는 모임입니다.', location: '세종시', schedule: '매주 화, 목요일 오후 3시', maxMembers: 20 },
  { name: '서울 댄스 모임', hobbyName: '댄스', description: '라인댄스를 배우고 공연하는 활동적인 모임입니다.', location: '서울 마포구', schedule: '매주 수요일 오전 11시', maxMembers: 25 },
  { name: '부산 요리 클럽', hobbyName: '요리', description: '매주 새로운 요리를 배우고 함께 나누는 모임입니다.', location: '부산 남구', schedule: '매주 목요일 오전 10시', maxMembers: 12 },
  { name: '인천 차 문화 모임', hobbyName: '차 문화', description: '다도를 배우고 차를 즐기는 여유로운 모임입니다.', location: '인천 중구', schedule: '격주 금요일 오후 2시', maxMembers: 10 },
  { name: '대구 컴퓨터 교실', hobbyName: '컴퓨터', description: '컴퓨터와 스마트폰 사용법을 배우는 모임입니다.', location: '대구 달서구', schedule: '매주 화, 목요일 오후 2시', maxMembers: 20 },
];

// ===== 4. 게시글 샘플 데이터 =====
const postSamples = [
  { category: '자유게시판', title: '오늘 등산 너무 좋았어요!', content: '날씨도 좋고 공기도 맑아서 정말 행복한 하루였습니다. 다음 주에도 함께해요!' },
  { category: '질문/답변', title: '수채화 붓 추천 부탁드려요', content: '초보자가 사용하기 좋은 수채화 붓이 있을까요? 추천 부탁드립니다.' },
  { category: '정보공유', title: '요가 호흡법 정리', content: '요가할 때 도움되는 호흡법을 정리해봤습니다. 참고하세요!' },
  { category: '자유게시판', title: '서예 작품 공유합니다', content: '오늘 연습한 서예 작품입니다. 피드백 부탁드려요.' },
  { category: '질문/답변', title: '원예 초보 질문있어요', content: '처음 화분을 키우는데 물은 얼마나 자주 줘야하나요?' },
];

// ===== 메인 함수 =====
async function seedAll() {
  console.log('🌱 HuLife 종합 샘플 데이터 생성 시작...\n');

  try {
    // 1. 사용자 생성
    console.log('👤 1. 사용자 확인 및 생성 중...');
    const createdUsers: any[] = [];
    for (const user of sampleUsers) {
      // 기존 사용자 확인
      const existingUser = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, user.email),
      });

      if (existingUser) {
        console.log(`   ⏭️  ${user.email} - 이미 존재 (재사용)`);
        createdUsers.push({ ...user, id: existingUser.id });
      } else {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const userId = randomUUID();
        await db.insert(users).values({
          id: userId,
          email: user.email,
          password: hashedPassword,
          name: user.name,
          age: user.age,
          location: user.location,
          phone: null,
          profileImage: null,
          createdAt: new Date(),
        });
        console.log(`   ✅ ${user.email} - 새로 생성`);
        createdUsers.push({ ...user, id: userId });
      }
    }
    console.log(`\n   ✅ 총 ${createdUsers.length}명의 사용자 준비 완료\n`);

    // 2. 기존 취미 데이터 사용
    console.log('🎨 2. 취미 데이터 로드 중...');
    const createdHobbies = await db.query.hobbies.findMany();
    console.log(`   ✅ ${createdHobbies.length}개의 취미 데이터 로드 완료\n`);

    // 3. 커뮤니티 생성
    console.log('👥 3. 커뮤니티 생성 중...');
    const createdCommunities: any[] = [];
    for (let i = 0; i < communitiesData.length; i++) {
      const communityData = communitiesData[i];
      const hobby = createdHobbies.find(h => h.name === communityData.hobbyName);
      if (!hobby) continue;

      const leader = createdUsers[i % createdUsers.length];
      const communityId = randomUUID();

      await db.insert(communities).values({
        id: communityId,
        name: communityData.name,
        hobbyId: hobby.id,
        hobbyName: hobby.name,
        description: communityData.description,
        location: communityData.location,
        schedule: communityData.schedule,
        memberCount: 1,
        maxMembers: communityData.maxMembers,
        imageUrl: hobby.imageUrl,
        leaderId: leader.id,
        createdAt: new Date(),
      });

      // 리더를 멤버로 추가
      await db.insert(communityMembers).values({
        id: randomUUID(),
        communityId,
        userId: leader.id,
        joinedAt: new Date(),
        role: 'leader',
      });

      // 채팅방 생성
      const chatRoomId = randomUUID();
      await db.insert(chatRooms).values({
        id: chatRoomId,
        communityId,
        createdAt: new Date(),
      });

      createdCommunities.push({ ...communityData, id: communityId, leaderId: leader.id, chatRoomId, hobbyId: hobby.id });
    }
    console.log(`   ✅ ${createdCommunities.length}개의 커뮤니티 생성 완료\n`);

    // 4. 커뮤니티 멤버 추가 (각 커뮤니티에 2-5명 추가)
    console.log('🤝 4. 커뮤니티 멤버 추가 중...');
    let totalMembers = 0;
    for (const community of createdCommunities) {
      const memberCount = 2 + Math.floor(Math.random() * 4); // 2-5명
      for (let i = 0; i < memberCount; i++) {
        const member = createdUsers[(totalMembers + i) % createdUsers.length];
        if (member.id === community.leaderId) continue; // 리더는 제외

        await db.insert(communityMembers).values({
          id: randomUUID(),
          communityId: community.id,
          userId: member.id,
          joinedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // 최근 30일 내
          role: 'member',
        });
        totalMembers++;
      }
    }
    console.log(`   ✅ ${totalMembers}명의 커뮤니티 멤버 추가 완료\n`);

    // 5. 채팅 메시지 생성 (각 커뮤니티에 3-7개)
    console.log('💬 5. 채팅 메시지 생성 중...');
    let totalMessages = 0;
    const chatSamples = [
      '안녕하세요! 처음 참여합니다.',
      '다음 모임 언제인가요?',
      '오늘 너무 즐거웠어요!',
      '질문있는데 도와주실 수 있나요?',
      '다음 주에도 참석할게요!',
      '날씨가 좋네요. 야외 활동하기 딱이에요!',
      '감사합니다!',
    ];
    for (const community of createdCommunities) {
      const messageCount = 3 + Math.floor(Math.random() * 5);
      for (let i = 0; i < messageCount; i++) {
        const sender = createdUsers[i % createdUsers.length];
        await db.insert(chatMessages).values({
          id: randomUUID(),
          chatRoomId: community.chatRoomId,
          userId: sender.id,
          userName: sender.name,
          userImage: null,
          message: chatSamples[i % chatSamples.length],
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // 최근 7일 내
        });
        totalMessages++;
      }
    }
    console.log(`   ✅ ${totalMessages}개의 채팅 메시지 생성 완료\n`);

    // 6. 게시글 생성 (30개)
    console.log('📰 6. 게시글 생성 중...');
    const createdPosts: any[] = [];
    for (let i = 0; i < 30; i++) {
      const author = createdUsers[i % createdUsers.length];
      const postSample = postSamples[i % postSamples.length];
      const postId = randomUUID();

      await db.insert(posts).values({
        id: postId,
        userId: author.id,
        userName: author.name,
        userImage: null,
        title: `${postSample.title} (${i + 1})`,
        content: postSample.content,
        category: postSample.category,
        images: null,
        likes: Math.floor(Math.random() * 20),
        comments: 0, // 댓글 생성 후 업데이트
        views: Math.floor(Math.random() * 100),
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      });
      createdPosts.push({ id: postId, authorId: author.id });
    }
    console.log(`   ✅ ${createdPosts.length}개의 게시글 생성 완료\n`);

    // 7. 게시글 댓글 생성 (각 게시글에 1-5개)
    console.log('💬 7. 게시글 댓글 생성 중...');
    let totalComments = 0;
    const commentSamples = [
      '좋은 정보 감사합니다!',
      '저도 동감이에요!',
      '다음에 같이 해요!',
      '질문있어요!',
      '정말 유익하네요.',
    ];
    for (const post of createdPosts) {
      const commentCount = 1 + Math.floor(Math.random() * 5);
      for (let i = 0; i < commentCount; i++) {
        const commenter = createdUsers[i % createdUsers.length];
        await db.insert(postComments).values({
          id: randomUUID(),
          postId: post.id,
          userId: commenter.id,
          userName: commenter.name,
          userImage: null,
          content: commentSamples[i % commentSamples.length],
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        });
        totalComments++;
      }
    }
    console.log(`   ✅ ${totalComments}개의 댓글 생성 완료\n`);

    // 8. 리뷰 생성 (50개)
    console.log('⭐ 8. 리뷰 생성 중...');
    const reviewSamples = [
      '정말 좋은 취미입니다! 추천해요.',
      '시작하기 어려울 줄 알았는데 생각보다 쉬워요.',
      '건강도 좋아지고 기분도 좋아졌어요.',
      '초보자에게 완벽한 취미입니다.',
      '친구들과 함께 하니 더 재미있어요!',
    ];
    for (let i = 0; i < 50; i++) {
      const reviewer = createdUsers[i % createdUsers.length];
      const hobby = createdHobbies[i % createdHobbies.length];

      await db.insert(reviews).values({
        id: randomUUID(),
        userId: reviewer.id,
        userName: reviewer.name,
        hobbyId: hobby.id,
        rating: 3 + Math.floor(Math.random() * 3), // 3-5점
        comment: reviewSamples[i % reviewSamples.length],
        createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
      });
    }
    console.log(`   ✅ 50개의 리뷰 생성 완료\n`);

    // 9. 갤러리 작품 생성 (20개)
    console.log('🎨 9. 갤러리 작품 생성 중...');
    const createdGalleryItems: any[] = [];
    const galleryTitles = [
      '첫 작품입니다!',
      '연습 중입니다',
      '오늘의 성과',
      '열심히 만들었어요',
      '피드백 부탁드립니다',
    ];
    // Placeholder 이미지 (600x800 회색 그라데이션 JPG, 약 2KB Base64)
    const placeholderImages = [
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCADIAJYDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlbaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//Z',
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCADIAJYDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlbaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//Z',
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCADIAJYDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlbaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//Z',
    ];
    for (let i = 0; i < 20; i++) {
      const artist = createdUsers[i % createdUsers.length];
      const hobby = createdHobbies[i % createdHobbies.length];
      const galleryItemId = randomUUID();

      await db.insert(galleryItems).values({
        id: galleryItemId,
        userId: artist.id,
        userName: artist.name,
        userImage: null,
        hobbyId: hobby.id,
        hobbyName: hobby.name,
        title: `${galleryTitles[i % galleryTitles.length]} - ${hobby.name}`,
        description: `${hobby.name} 활동 결과물입니다. 많은 응원 부탁드려요!`,
        image: placeholderImages[i % placeholderImages.length], // ✅ Placeholder 이미지 추가
        videoUrl: null,
        videoThumbnail: null,
        likes: Math.floor(Math.random() * 50),
        views: Math.floor(Math.random() * 200),
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      });
      createdGalleryItems.push({ id: galleryItemId, artistId: artist.id });
    }
    console.log(`   ✅ ${createdGalleryItems.length}개의 갤러리 작품 생성 완료\n`);

    // 10. 갤러리 댓글 생성
    console.log('💬 10. 갤러리 댓글 생성 중...');
    let totalGalleryComments = 0;
    const galleryCommentSamples = [
      '정말 멋지네요!',
      '대단하세요!',
      '저도 도전해볼게요!',
      '훌륭한 작품이에요!',
      '계속 응원할게요!',
    ];
    for (const item of createdGalleryItems) {
      const commentCount = 1 + Math.floor(Math.random() * 4);
      for (let i = 0; i < commentCount; i++) {
        const commenter = createdUsers[i % createdUsers.length];
        await db.insert(galleryComments).values({
          id: randomUUID(),
          galleryItemId: item.id,
          userId: commenter.id,
          userName: commenter.name,
          userImage: null,
          content: galleryCommentSamples[i % galleryCommentSamples.length],
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        });
        totalGalleryComments++;
      }
    }
    console.log(`   ✅ ${totalGalleryComments}개의 갤러리 댓글 생성 완료\n`);

    // 11. 사용자 관심 취미 추가
    console.log('❤️ 11. 사용자 관심 취미 추가 중...');
    let totalUserHobbies = 0;
    for (const user of createdUsers) {
      const hobbyCount = 2 + Math.floor(Math.random() * 4); // 2-5개
      for (let i = 0; i < hobbyCount; i++) {
        const hobby = createdHobbies[(totalUserHobbies + i) % createdHobbies.length];
        await db.insert(userHobbies).values({
          id: randomUUID(),
          userId: user.id,
          hobbyId: hobby.id,
          hobbyName: hobby.name,
          hobbyCategory: hobby.category,
          hobbyDescription: hobby.description,
          hobbyImage: hobby.imageUrl,
          status: ['interested', 'learning', 'completed'][Math.floor(Math.random() * 3)] as any,
          progress: Math.floor(Math.random() * 101),
          startedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
          completedAt: null,
        });
        totalUserHobbies++;
      }
    }
    console.log(`   ✅ ${totalUserHobbies}개의 관심 취미 추가 완료\n`);

    // 12. 일정 생성
    console.log('📅 12. 일정 생성 중...');
    let totalSchedules = 0;
    const scheduleTypes = ['class', 'practice', 'meeting', 'event'] as const;
    for (const user of createdUsers) {
      const scheduleCount = 2 + Math.floor(Math.random() * 4);
      for (let i = 0; i < scheduleCount; i++) {
        const hobby = createdHobbies[i % createdHobbies.length];
        const daysFromNow = Math.floor(Math.random() * 30) - 15; // -15일 ~ +15일

        await db.insert(schedules).values({
          id: randomUUID(),
          userId: user.id,
          title: `${hobby.name} ${scheduleTypes[i % scheduleTypes.length]}`,
          hobbyId: hobby.id,
          date: new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000),
          time: `${10 + Math.floor(Math.random() * 8)}:00`,
          location: user.location,
          type: scheduleTypes[i % scheduleTypes.length],
        });
        totalSchedules++;
      }
    }
    console.log(`   ✅ ${totalSchedules}개의 일정 생성 완료\n`);

    // 13. 설문 응답 생성 (5명)
    console.log('📋 13. 설문 응답 생성 중...');
    for (let i = 0; i < 5; i++) {
      const user = createdUsers[i];
      await db.insert(surveyResponses).values({
        id: randomUUID(),
        userId: user.id,
        responses: {
          '1': Math.floor(Math.random() * 5) + 1,
          '2': Math.floor(Math.random() * 5) + 1,
          '3': Math.floor(Math.random() * 5) + 1,
          '4': Math.floor(Math.random() * 5) + 1,
          '5': Math.floor(Math.random() * 5) + 1,
          '6': Math.floor(Math.random() * 5) + 1,
          '7': Math.floor(Math.random() * 5) + 1,
          '8': Math.floor(Math.random() * 5) + 1,
        },
        completedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      });
    }
    console.log(`   ✅ 5개의 설문 응답 생성 완료\n`);

    // 완료 메시지
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 샘플 데이터 생성 완료!\n');
    console.log('📊 생성된 데이터 요약:');
    console.log(`   👤 사용자: ${createdUsers.length}명`);
    console.log(`   🎨 취미: ${createdHobbies.length}개`);
    console.log(`   👥 커뮤니티: ${createdCommunities.length}개`);
    console.log(`   🤝 커뮤니티 멤버: ${totalMembers}명`);
    console.log(`   💬 채팅 메시지: ${totalMessages}개`);
    console.log(`   📰 게시글: ${createdPosts.length}개`);
    console.log(`   💬 게시글 댓글: ${totalComments}개`);
    console.log(`   ⭐ 리뷰: 50개`);
    console.log(`   🎨 갤러리 작품: ${createdGalleryItems.length}개`);
    console.log(`   💬 갤러리 댓글: ${totalGalleryComments}개`);
    console.log(`   ❤️ 관심 취미: ${totalUserHobbies}개`);
    console.log(`   📅 일정: ${totalSchedules}개`);
    console.log(`   📋 설문 응답: 5개`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('💡 로그인 정보:');
    console.log('   📧 이메일: test@hulife.com');
    console.log('   🔑 비밀번호: test1234');
    console.log('\n   (다른 계정도 동일한 비밀번호 사용)\n');

  } catch (error) {
    console.error('❌ 샘플 데이터 생성 오류:', error);
    process.exit(1);
  }
  process.exit(0);
}

seedAll();
