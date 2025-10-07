import { db } from '../lib/db';
import { hobbies } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

// 취미 이름과 이미지 파일명 매핑
const imageMapping: Record<string, string> = {
  // 미술
  "수채화": "/수채화.png",
  "유화": "/유화.png",
  "아크릴화": "/아크릴화.png",
  "색연필화": "/색연필화.png",
  "수묵화": "/수묵화.png",
  "민화": "/민화.png",
  "도자기 공예": "/도자기공예.png",
  "캘리그라피": "/캘리그라피.png",

  // 스포츠
  "등산": "/등산.png",
  "게이트볼": "/게이트볼.png",
  "파크골프": "/파크골프.png",
  "탁구": "/탁구.png",
  "배드민턴": "/배드민턴.png",
  "수영": "/수영.png",
  "자전거": "/자전거.png",
  "볼링": "/볼링.png",
  "태극권": "/태극권.png",
  "걷기": "/걷기.png",

  // 문화
  "서예": "/서예(중복).png",
  "한문 공부": "/한문공부.png",
  "시 쓰기": "/시쓰기.png",
  "독서토론": "/독서토론.png",
  "역사 공부": "/역사공부.png",
  "영화 감상": "/영화감상.png",
  "국악": "/국악.png",
  "합창": "/합창.png",
  "사진 촬영": "/사진촬영.png",
  "박물관 탐방": "/박물관탐방.png",

  // 건강
  "요가": "/요가.png",
  "필라테스": "/필라테스.png",
  "스트레칭": "/스트레칭.png",
  "명상": "/명상.png",
  "단전호흡": "/단전호흡.png",
  "경락 마사지": "/경락마사지.png",
  "아로마테라피": "/아로마테라피.png",
  "춤": "/춤.png",

  // 자연
  "원예": "/원예.png",
  "텃밭 가꾸기": "/텃밭가꾸기.png",
  "분재": "/분재.png",
  "꽃꽂이": "/꽃꽂이.png",
  "버섯 재배": "/버섯재배.png",
  "수경 재배": "/수경재배.png",
  "조경": "/조경.png",
  "야생화 관찰": "/야생화관찰.png",

  // 음악
  "피아노": "/피아노.png",
  "기타": "/기타.png",
  "우쿨렐레": "/우쿨렐레.png",
  "하모니카": "/하모니카.png",
  "오카리나": "/오카리나.png",
  "노래교실": "/노래교실.png",
  "드럼": "/드럼.png",

  // 공예
  "뜨개질": "/뜨개질.png",
  "자수": "/자수.png",
  "퀼트": "/퀄트.png",
  "비누 만들기": "/비누만들기.png",
  "양초 공예": "/양초공예.png",
  "가죽공예": "/가죽공예.png",
  "목공예": "/목공예.png",
  "종이접기": "/종이접기.png",
  "한지공예": "/한지공예.png",

  // 요리
  "베이킹": "/베이킹.png",
  "한식 요리": "/한식요리.png",
  "발효 음식": "/발표음식.png",
  "커피 로스팅": "/커피로스팅.png",
  "차 문화": "/차문화.png",

  // 기술
  "컴퓨터 활용": "/컴퓨터활용.png",
  "스마트폰 활용": "/스마트폰활용.png",
  "영상 편집": "/영상편집.png",
  "블로그 운영": "/블로그운영.png",

  // 언어
  "영어 회화": "/영어회화.png",
  "중국어": "/중국어.png",
  "일본어": "/일본어.png",

  // 여가
  "바둑": "/바둑.png",
  "장기": "/장기.png",
  "퍼즐": "/퍼즐.png",
  "낚시": "/낚시.png",
  "여행": "/여행.png",
  "천체 관측": "/천체관측.png",
  "조류 관찰": "/조류관찰.png",

  // 봉사
  "독서 지도": "/독서지도.png",
  "멘토링": "/멘토링.png",
  "환경 보호": "/환경보호.png",
};

async function updateImageUrls() {
  try {
    console.log("이미지 URL 업데이트 시작...");

    // 모든 취미 데이터 가져오기
    const allHobbies = await db.query.hobbies.findMany();

    let updated = 0;
    let notFound = 0;

    for (const hobby of allHobbies) {
      const imageUrl = imageMapping[hobby.name];

      if (imageUrl) {
        // 이미지 URL 업데이트
        await db
          .update(hobbies)
          .set({ imageUrl })
          .where(eq(hobbies.id, hobby.id));

        console.log(`✓ ${hobby.name} → ${imageUrl}`);
        updated++;
      } else {
        console.log(`✗ ${hobby.name} - 이미지 파일 없음`);
        notFound++;
      }
    }

    console.log(`\n✅ 완료!`);
    console.log(`   업데이트됨: ${updated}개`);
    console.log(`   매핑 없음: ${notFound}개`);

  } catch (error) {
    console.error("에러 발생:", error);
    process.exit(1);
  }

  process.exit(0);
}

updateImageUrls();
