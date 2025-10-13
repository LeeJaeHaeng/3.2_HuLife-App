import { db } from '../lib/db';
import { hobbies } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

// 취미 이름과 이미지 파일명 매핑
const imageMapping: Record<string, string> = {
  "가죽공예": "/가죽공예.png",
  "수경 재배": "/수경재배.png",
  "암벽등반": "/암벽등반.png",
  "마술": "/마술.png",
  "수상스키": "/수상스키.png",
  "명상": "/명상.png",
  "스트레칭": "/스트레칭.png",
  "한문 공부": "/한문공부.png",
  "서핑": "/서핑.png",
  "독서 지도": "/독서지도.png",
  "박물관 탐방": "/박물관탐방.png",
  "태극권": "/태극권.png",
  "테니스": "/테니스.png",
  "요트": "/요트.png",
  "합창": "/합창.png",
  "장기": "/장기.png",
  "캘리그라피": "/캘리그라피.png",
  "족구": "/족구.png",
  "배구": "/배구.png",
  "철학 독서": "/철학독서.png",
  "아로마테라피": "/아로마테라피.png",
  "오카리나": "/오카리나.png",
  "매듭공예": "/매듭공예.png",
  "경락 마사지": "/경락마사지.png",
  "텃밭 가꾸기": "/텃밭가꾸기.png",
  "에어로빅": "/에어로빅.png",
  "버섯 재배": "/버섯재배.png",
  "우표 수집": "/우표수집.png",
  "다도": "/다도.png",
  "유화": "/유화.png",
  "체스": "/체스.png",
  "수채화": "/수채화.png",
  "양초 공예": "/양초공예.png",
  "드론 조종": "/드론조종.png",
  "모형 제작": "/모형제작.png",
  "컴퓨터 활용": "/컴퓨터활용.png",
  "일본어": "/일본어.png",
  "스키": "/스키.png",
  "요가": "/요가.png",
  "탁구": "/탁구.png",
  "분재": "/분재.png",
  "유리공예": "/유리공예.png",
  "기타": "/기타.png",
  "수영": "/수영.png",
  "낚시": "/낚시.png",
  "플루트": "/플루트.png",
  "일식 요리": "/일식요리.png",
  "춤": "/춤.png",
  "궁도": "/궁도.png",
  "중국어": "/중국어.png",
  "노래교실": "/노래교실.png",
  "독서토론": "/독서토론.png",
  "중식 요리": "/중식요리.png",
  "야생화 관찰": "/야생화관찰.png",
  "블로그 운영": "/블로그운영.png",
  "영화 감상": "/영화감상.png",
  "퍼즐": "/퍼즐.png",
  "뜨개질": "/뜨개질.png",
  "인라인 스케이트": "/인라인스케이트.png",
  "영어 회화": "/영어회화.png",
  "한지공예": "/한지공예.png",
  "스쿼시": "/스쿼시.png",
  "3D 프린팅": "/3d프린팅.png",
  "판소리": "/판소리.png",
  "바둑": "/바둑.png",
  "영상 편집": "/영상편집.png",
  "배드민턴": "/배드민턴.png",
  "드럼": "/드럼.png",
  "필라테스": "/필라테스.png",
  "종이접기": "/종이접기.png",
  "퀼트": "/퀄트.png",
  "국악": "/국악.png",
  "걷기": "/걷기.png",
  "승마": "/승마.png",
  "양식 요리": "/양식요리.png",
  "천문학": "/천문학.png",
  "아크릴화": "/아크릴화.png",
  "발효 음식": "/발표음식.png",
  "단전호흡": "/단전호흡.png",
  "조류 관찰": "/조류관찰.png",
  "차 문화": "/차문화.png",
  "커피 로스팅": "/커피로스팅.png",
  "등산": "/등산.png",
  "한식 요리": "/한식요리.png",
  "조깅": "/조깅.png",
  "꽃꽂이": "/꽃꽂이.png",
  "골프": "/골프.png",
  "카약": "/카약.png",
  "연극": "/연극.png",
  "재능 기부": "/재능기부.png",
  "헬스": "/헬스.png",
  "사진": "/사진촬영.png",
  "도예": "/도예.png",
  "반려견 훈련": "/반려견훈련.png",
  "캠핑": "/캠핑.png",
  "목공예": "/목공예.png",
  "역사 공부": "/역사공부.png",
  "도자기 공예": "/도자기공예.png",
  "하모니카": "/하모니카.png",
  "조경": "/조경.png",
  "레고": "/레고.png",
  "베이킹": "/베이킹.png",
  "민화": "/민화.png",
  "검도": "/검도.png",
  "게이트볼": "/게이트볼.png",
  "여행": "/여행.png",
  "환경 보호": "/환경보호.png",
  "비누 만들기": "/비누만들기.png",
  "자전거": "/자전거.png",
  "천체 관측": "/천체관측.png",
  "골동품 감정": "/골동품감정.png",
  "어린이 교육": "/어린이교육.png",
  "볼링": "/볼링.png",
  "멘토링": "/멘토링.png",
  "색소폰": "/색소폰.png",
  "피아노": "/피아노.png",
  "자수": "/자수.png",
  "첼로": "/첼로.png",
  "서예": "/서예(중복).png",
  "우쿨렐레": "/우쿨렐레.png",
  "시 쓰기": "/시쓰기.png",
  "바이올린": "/바이올린.png",
  "코딩": "/코딩.png"
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
