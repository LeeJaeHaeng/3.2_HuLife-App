import { db } from '../lib/db';
import { hobbies } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * 취미 비디오 URL 업데이트 스크립트
 *
 * 사용법:
 * 1. 아래 "추가 필요" 섹션에 새로운 취미 이름과 유튜브 링크를 입력하세요
 * 2. 터미널에서 실행: pnpm tsx scripts/update-new-video-urls.ts
 *
 * 참고:
 * - 이미 DB에 등록된 취미들은 모두 유튜브 링크가 적용되어 있습니다 (125개)
 * - 새로운 취미를 추가할 때만 이 스크립트를 사용하세요
 */

const videoUrlMapping: Record<string, string> = {
  // ===== ⬇️ 새로운 취미 추가 시 아래에 입력하세요 ⬇️ =====
  // 예시:
  // '새로운취미이름': 'https://youtu.be/VIDEO_ID',

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
