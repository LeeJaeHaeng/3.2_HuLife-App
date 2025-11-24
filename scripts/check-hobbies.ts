/**
 * 취미 및 갤러리 데이터 확인 스크립트
 */

import { db } from '../lib/db';
import { hobbies, galleryItems } from '../lib/db/schema';

async function checkData() {
  try {
    console.log('🔍 데이터 확인 시작...\n');

    // 1. 취미 데이터 확인
    const allHobbies = await db.query.hobbies.findMany();
    console.log(`📚 취미 데이터: ${allHobbies.length}개`);

    if (allHobbies.length > 0) {
      const firstHobby = allHobbies[0];
      console.log('\n첫 번째 취미 샘플:');
      console.log('  - 이름:', firstHobby.name);
      console.log('  - 카테고리:', firstHobby.category);
      console.log('  - 난이도:', firstHobby.difficulty);
      console.log('  - 실내/실외:', firstHobby.indoorOutdoor);
      console.log('  - 사회성:', firstHobby.socialIndividual);
    }

    // 2. 갤러리 데이터 확인
    const allGalleryItems = await db.query.galleryItems.findMany();
    console.log(`\n🎨 갤러리 데이터: ${allGalleryItems.length}개`);

    if (allGalleryItems.length > 0) {
      const firstItem = allGalleryItems[0];
      console.log('\n첫 번째 갤러리 아이템 샘플:');
      console.log('  - 제목:', firstItem.title);
      console.log('  - 작성자:', firstItem.userName);
      console.log('  - 취미명:', firstItem.hobbyName);
      console.log('  - 이미지 타입:', typeof firstItem.image);
      console.log('  - 이미지 존재:', firstItem.image ? 'O' : 'X');

      if (firstItem.image) {
        const imagePreview = firstItem.image.substring(0, 100);
        console.log('  - 이미지 미리보기:', imagePreview + '...');
        console.log('  - 이미지 길이:', firstItem.image.length, 'bytes');
        console.log('  - Base64 시작 여부:', firstItem.image.startsWith('data:image/') ? 'O' : 'X');
      }
    }

    console.log('\n✅ 데이터 확인 완료!');
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
  process.exit(0);
}

checkData();
