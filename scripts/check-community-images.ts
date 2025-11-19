import { db } from '../lib/db';
import { communities, hobbies } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

async function checkCommunityImages() {
  try {
    console.log('📊 커뮤니티 이미지 현황 분석\n');

    // 모든 커뮤니티 조회
    const allCommunities = await db.query.communities.findMany({
      with: {
        hobby: true
      }
    });

    console.log(`총 ${allCommunities.length}개 커뮤니티 발견\n`);
    console.log('=' .repeat(80));

    for (const community of allCommunities) {
      console.log(`\n커뮤니티: ${community.name}`);
      console.log(`  ID: ${community.id}`);
      console.log(`  취미 ID: ${community.hobbyId}`);
      console.log(`  취미 이름: ${community.hobby?.name || '없음'}`);
      console.log(`  이미지 URL: ${community.imageUrl}`);

      // hobbyImages.js에서 사용할 키 확인
      if (community.hobby) {
        console.log(`  🔍 hobbyImages 키: '${community.hobby.name}'`);
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('\n📋 취미 이름 목록 (hobbyImages.js 키로 사용됨):');

    const uniqueHobbies = new Set(allCommunities.map(c => c.hobby?.name).filter(Boolean));
    uniqueHobbies.forEach(name => {
      console.log(`  - '${name}'`);
    });

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

checkCommunityImages()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
