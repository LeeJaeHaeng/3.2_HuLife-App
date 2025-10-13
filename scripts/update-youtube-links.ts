import { db } from '../lib/db';
import { hobbies } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * 유튜브 링크를 업데이트하는 스크립트
 *
 * 사용법:
 * 1. 아래 youtubeLinkUpdates 배열에 취미 이름과 유튜브 링크를 추가
 * 2. pnpm tsx scripts/update-youtube-links.ts 실행
 */

// 여기에 업데이트할 취미의 이름과 유튜브 링크를 추가하세요
const youtubeLinkUpdates: { hobbyName: string; youtubeUrl: string }[] = [
  // 예시:
  // { hobbyName: "수채화", youtubeUrl: "https://youtu.be/example1" },
  // { hobbyName: "등산", youtubeUrl: "https://youtu.be/example2" },

  // 아래에 추가하세요
  { hobbyName: "태극권", youtubeUrl: "https://youtu.be/QmKHmzTKTpo" },
  { hobbyName: "요가", youtubeUrl: "https://youtu.be/v7AYKMP6rOE" },
  { hobbyName: "서예", youtubeUrl: "https://youtu.be/YdQhGCXAADw" },
];

async function updateYoutubeLinks() {
  try {
    console.log("=== Updating YouTube Links ===\n");

    let successCount = 0;
    let notFoundCount = 0;

    for (const { hobbyName, youtubeUrl } of youtubeLinkUpdates) {
      // 취미 이름으로 찾기
      const hobbyList = await db.select().from(hobbies).where(eq(hobbies.name, hobbyName));

      if (hobbyList.length === 0) {
        console.log(`❌ Not found: ${hobbyName}`);
        notFoundCount++;
        continue;
      }

      // 유튜브 링크 업데이트
      await db.update(hobbies)
        .set({ videoUrl: youtubeUrl })
        .where(eq(hobbies.name, hobbyName));

      console.log(`✓ Updated: ${hobbyName}`);
      console.log(`  YouTube: ${youtubeUrl}\n`);
      successCount++;
    }

    console.log("=== Summary ===");
    console.log(`✅ Successfully updated: ${successCount}`);
    console.log(`❌ Not found: ${notFoundCount}`);
    console.log(`Total attempted: ${youtubeLinkUpdates.length}`);

  } catch (error) {
    console.error("Error updating YouTube links:", error);
    process.exit(1);
  }
  process.exit(0);
}

updateYoutubeLinks();
