import { db } from '../lib/db';
import { hobbies } from '../lib/db/schema';

async function checkVideoUrls() {
  try {
    const allHobbies = await db.select({
      name: hobbies.name,
      videoUrl: hobbies.videoUrl
    }).from(hobbies);

    const withVideo = allHobbies.filter(h => h.videoUrl);
    const withoutVideo = allHobbies.filter(h => !h.videoUrl);

    console.log(`=== 비디오 URL 있음 (${withVideo.length}개) ===`);
    withVideo.sort((a, b) => a.name.localeCompare(b.name)).forEach(h => {
      console.log(`✅ ${h.name}`);
    });

    console.log(`\n=== 비디오 URL 없음 (${withoutVideo.length}개) ===`);
    withoutVideo.sort((a, b) => a.name.localeCompare(b.name)).forEach(h => {
      console.log(`❌ ${h.name}`);
    });

    console.log(`\n총 ${allHobbies.length}개 취미 중 ${withVideo.length}개 완료, ${withoutVideo.length}개 남음`);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
  process.exit(0);
}

checkVideoUrls();
