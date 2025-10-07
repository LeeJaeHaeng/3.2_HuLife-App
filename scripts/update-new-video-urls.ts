import { db } from '../lib/db';
import { hobbies } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * 전체 취미 목록 비디오 URL 업데이트 스크립트
 *
 * 사용법:
 * 1. 아래 videoUrlMapping에서 URL이 빈 문자열('')인 항목에 유튜브 링크를 입력하세요
 * 2. 터미널에서 실행: pnpm tsx scripts/update-new-video-urls.ts
 *
 * 주의사항:
 * - 🔴 표시가 있는 항목들은 현재 중복된 URL을 사용 중입니다 (확인 필요)
 */

const videoUrlMapping: Record<string, string> = {
  // ===== 이미 업데이트 완료된 취미들 =====

  '수채화': 'https://youtu.be/-DxZ0lf5cFQ?si=7AMObrbLv6cjwbAp',
  '수영': 'https://youtu.be/DC8MYG6uzSs?si=FwreV7jXE1Ie-QP1',
  '수묵화': 'https://youtu.be/_NOMkv08Kak?si=Zfx78sB29BfEasz0',
  '수경 재배': 'https://youtu.be/HJHmkSUg1As?si=Jm_rCk106g9jx4sO',
  '스마트폰 활용': 'https://youtu.be/V4hNBU2UEgc?si=8Rf-ViVEE9TQ0esv',
  '스트레칭': 'https://youtu.be/7gR50n00rQ4?si=mWb09ph9kzR4Q3Rj',
  '시 쓰기': 'https://youtu.be/1a4cSitXpUA?si=Lud2Va4W-ta_bx2h',
  '아로마테라피': 'https://youtu.be/YdDtf6oa25U?si=oNz1IkkHlNA9EhFG',
  '아크릴화': 'https://youtu.be/xNRbp0rcRAA?si=viy6EbsNdOkAb198',
  '야생화 관찰': 'https://youtu.be/xG4MRYHaV1s?si=JmIB56BNcxVZje_M',
  '양초 공예': 'https://youtu.be/cqD3DOSPygI?si=myjjeQudnhehjHuZ',
  '여행': 'https://youtu.be/tdXCTsDpzB8?si=n6ruzcQiHe8ij1mb',
  '역사 공부': 'https://youtu.be/CaG7fR0q-4A?si=QAlzoFFDR5Af0_Rn',
  '영상 편집': 'https://youtu.be/lxoKHcalhp4?si=mtzBK5U28_alXOlq',
  '영어 회화': 'https://youtu.be/TFnThlz9gaQ?si=0ga1u65bnP6avb6m',
  '영화 감상': 'https://youtu.be/0pmUjkZr8mQ?si=qeV3WwCRZxhaCuBE',
  '오카리나': 'https://youtu.be/Ynw6xloIf08?si=CoDyF0o0ea0ktBvv',
  '요가': 'https://youtu.be/OBTl49bVk94?si=-VZucAG0n0ZkUTIx',
  '우쿨렐레': 'https://youtu.be/_KkD3Ivc1sA?si=adwk8gDxXyLUhlfO',
  '유화': 'https://youtu.be/BCKcKsCWooQ?si=qpOJP36RLAlcjh65',
  '일본어': 'https://youtu.be/T9EQsOqhLqs?si=iwuBHKxzyG3mlMfk',
  '자수': 'https://youtu.be/3brFkrxUFo4?si=8ldK1wHNW7VqbQ9Q',
  '자전거': 'https://youtu.be/Zuveh98J9a8?si=ZEX3aqTCyb-GtJ-M',
  '장기': 'https://youtu.be/RVVYOlqgvmA?si=qMmMMoyfXVf6k8yI',
  '조경': 'https://youtu.be/l-I4YecXWV4?si=T2WgqmGnS8ZACP-X',
  '조류 관찰': 'https://youtu.be/aL960sxUJ0E?si=M6EcEXgJ6g6kvd5r',
  '종이접기': 'https://youtu.be/JacQYzrkp4A?si=_2ZDUNKo0CzcLhum',
  '중국어': 'https://youtu.be/vorPfGrDzWA?si=QB6EZunI3rPuEho5',
  '차 문화': 'https://youtu.be/uow0kT-UJJY?si=v0B57zQOeQczqu9S',
  '천체 관측': 'https://youtu.be/KHFF6ql9qpE?si=eYNKUekPy5d9xANQ',
  '춤': 'https://youtu.be/cqkIJRxXPEE?si=xo70MS3wOLYev4pC',
  '캘리그라피': 'https://youtu.be/RyzlWSFMK4k?si=44pzT6mWwYdFLU3i',
  '커피 로스팅': 'https://youtu.be/r2HKT-o5DE0?si=H-gNkBEKRjPsbU3M',
  '컴퓨터 활용': 'https://youtu.be/4l30CXjJgyU?si=cp4ZiUcDF12llwD2',
  '퀼트': 'https://youtu.be/m2gZb7iHRCs?si=vS2Y8i9h0ZsYwF_u',
  '탁구': 'https://youtu.be/71HK3HfJmNY?si=vL2gu6FQMgvNhY1g',
  '태극권': 'https://youtu.be/uT9h2WOICUc?si=Qi0ccCEi0IGjo0CL',
  '텃밭 가꾸기': 'https://youtu.be/0I6p_cHqI9o?si=3b7a5j5Ho7EsIpk-',
  '파크골프': 'https://youtu.be/bFhNCmapzcM?si=gLJ66h6kZiS3EQas',
  '퍼즐': 'https://youtu.be/1FzurKEYtS8?si=4iUtpRojnxAkFBNx',
  '피아노': 'https://youtu.be/yHj_4mDUFq8?si=0YYFo9C6VsW23Grh',
  '필라테스': 'https://youtu.be/ZRWSc-Uc7-c?si=d9u74ufjIuxI1aBl',
  '하모니카': 'https://youtu.be/_822V_i9FIQ?si=oowHfWCF24HVs9ov',
  '한문 공부': 'https://youtu.be/eqi-jDQF9lA?si=U39IzI2JhlpF7qF-',
  '한식 요리': 'https://youtu.be/uzsqVvwHloA?si=1kF5YHw0_FB3wWvR',
  '한지공예': 'https://youtu.be/MXCBe8obnUM?si=-cPiopOgisl6y_o4',
  '합창': 'https://youtu.be/KAXxSu_Slyw?si=RsmvoBlByA6KynnS',
  '환경 보호': 'https://youtu.be/qRjbcRuEYBQ?si=Cxo2w9nEgrIGiTBq',

  // ===== 🔴 중복된 URL 사용 중 - 확인 및 개별 링크 입력 필요 =====
  // 현재 모두 같은 URL (https://youtu.be/nMhL8VUcCeM?si=MreDyWXg3f_x0jYN)을 사용 중입니다

  '가죽공예': 'https://youtu.be/g0s61ohm4GA?si=i7x2kCuayGB8VR1j', // 🔴 중복 URL
  '걷기': 'https://youtu.be/kghyht4dBys?si=sqgztWdcSNTW6Gwl', // 🔴 중복 URL
  '게이트볼': 'https://youtu.be/sTBIxlfYAXU?si=m2iJ8rQeVUIN8KgI', // 🔴 중복 URL
  '경락 마사지': 'https://youtu.be/zvoyEFZXHq8?si=5VcT-2KgepmogzKU', // 🔴 중복 URL
  '국악': 'https://youtu.be/bJS8C5XLBy8?si=yPPQ_9hIrLvsr7Gc', // 🔴 중복 URL
  '기타': 'https://youtu.be/CcQYe39RqS8?si=8iSWkhLGnmN1NxRw', // 🔴 중복 URL
  '꽃꽂이': 'https://youtu.be/Rm4l8ld3AHI?si=uCk-UayrCLd47ipe', // 🔴 중복 URL
  '낚시': 'https://youtu.be/aY9rH4gZ0UQ?si=6V7AqcI-k20LQ1xN', // 🔴 중복 URL
  '노래교실': 'https://youtu.be/C67qarY7xzY?si=bQ6Rio3fCwFUkfj6', // 🔴 중복 URL
  '단전호흡': 'https://youtu.be/WymrfA20VRk?si=NuguWRneYrlHol-1', // 🔴 중복 URL
  '도자기 공예': 'https://youtu.be/Dj3nIVP37Sw?si=euPldKBrIVXwya99', // 🔴 중복 URL
  '독서 지도': 'https://youtu.be/PiAJEYClBtE?si=2gPePoPlYqFDYuwm', // 🔴 중복 URL
  '독서토론': 'https://youtu.be/7hqDzvXf1FE?si=eyobGOQUhKQSYPQn', // 🔴 중복 URL
  '드럼': 'https://youtu.be/ipfa_NUdaNY?si=-Q7JviQ6jfiPo85i', // 🔴 중복 URL
  '등산': 'https://youtu.be/Q-dcjX6xkeE?si=NSxrmJXwkq-4m9kw', // 🔴 중복 URL
  '뜨개질': 'https://youtu.be/G17milU0gSI?si=baBSSpcJrYcud9oc', // 🔴 중복 URL
  '멘토링': 'https://youtu.be/ZqE-pbja0lc?si=CypYAZmqcJA4UyA-', // 🔴 중복 URL
  '명상': 'https://youtu.be/yiysD0Jl2Wo?si=mvKdttLsiaZcoiAL', // 🔴 중복 URL
  '목공예': 'https://youtu.be/4YoASyLgKQM?si=dNsGokmI4JRSwptf', // 🔴 중복 URL
  '민화': 'https://youtu.be/HeVd1UvsFQM?si=0f4P0VhYHNLPeuoK', // 🔴 중복 URL
  '바둑': 'https://youtu.be/TEp_hxTHbV0?si=Uko6Rrq14hXhoMco', // 🔴 중복 URL
  '박물관 탐방': 'https://youtu.be/ZScev_uALro?si=QI1TvIuM3gSvfocB', // 🔴 중복 URL
  '발효 음식': 'https://youtu.be/J-akDmUfCs8?si=YtaKBT0LSClHcuBx', // 🔴 중복 URL
  '배드민턴': 'https://youtu.be/JZOeAeIkrgY?si=2BHeHFdysZQNWKED', // 🔴 중복 URL
  '버섯 재배': 'https://youtu.be/Svf2jZGAuZA?si=9ujUfKaJ2zk3uJ09', // 🔴 중복 URL
  '베이킹': 'https://youtu.be/vnfAmqrrppQ?si=srmPzKgDJZh2QLny', // 🔴 중복 URL
  '볼링': 'https://youtu.be/Aw7YX_fep-Y?si=XbCWbhkvxA6UJXA-', // 🔴 중복 URL
  '분재': 'https://youtu.be/2oc9nAfmsUk?si=xHoMH0dUK4ZAUpYd', // 🔴 중복 URL
  '블로그 운영': 'https://youtu.be/nz_6Il-l4Rw?si=7FYbNQ76h01Mssrq', // 🔴 중복 URL
  '비누 만들기': 'https://youtu.be/eWGwM_rdHXM?si=4yQe7lyfkfXn4NGG', // 🔴 중복 URL
  '사진': 'https://youtu.be/khOBEmvGz3A?si=FQofBTGBT0cS-tjI', // 🔴 중복 URL
  '사진 촬영': 'https://youtu.be/khOBEmvGz3A?si=FQofBTGBT0cS-tjI', // 🔴 중복 URL
  '색연필화': 'https://youtu.be/zGxghHW8IPA?si=piy0iERqrU6zcExZ', // 🔴 중복 URL
  '서예': 'https://youtu.be/UCr0xxcTy9E?si=MViJtZM-3xj9WofO', // 🔴 중복 URL
};

async function updateVideoUrls() {
  try {
    console.log('비디오 URL 업데이트 시작...\n');

    let updated = 0;
    let skipped = 0;
    let errors = 0;
    let empty = 0;

    for (const [hobbyName, videoUrl] of Object.entries(videoUrlMapping)) {
      try {
        // URL이 비어있으면 스킵
        if (!videoUrl || videoUrl.trim() === '') {
          empty++;
          continue;
        }

        // 해당 취미 찾기
        const hobby = await db.query.hobbies.findFirst({
          where: eq(hobbies.name, hobbyName),
        });

        if (!hobby) {
          console.log(`⚠️  "${hobbyName}" 취미를 찾을 수 없습니다.`);
          skipped++;
          continue;
        }

        // 이미 같은 URL이면 스킵
        if (hobby.videoUrl === videoUrl) {
          console.log(`➡️  "${hobbyName}" - 이미 동일한 URL`);
          skipped++;
          continue;
        }

        // 비디오 URL 업데이트
        await db
          .update(hobbies)
          .set({ videoUrl })
          .where(eq(hobbies.id, hobby.id));

        console.log(`✅ "${hobbyName}" - 업데이트 완료`);
        updated++;
      } catch (error) {
        console.error(`❌ "${hobbyName}" - 에러:`, error);
        errors++;
      }
    }

    console.log(`\n📊 결과:`);
    console.log(`   업데이트: ${updated}개`);
    console.log(`   스킵 (이미 동일): ${skipped}개`);
    console.log(`   URL 미입력: ${empty}개`);
    console.log(`   에러: ${errors}개`);

    if (empty > 0) {
      console.log(`\n💡 팁: URL 미입력 항목(${empty}개)에 유튜브 링크를 입력하고 다시 실행하세요.`);
    }

  } catch (error) {
    console.error('에러 발생:', error);
    process.exit(1);
  }

  process.exit(0);
}

updateVideoUrls();
