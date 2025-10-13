import { db } from '../lib/db';
import { hobbies } from '../lib/db/schema';
import { eq } from 'drizzle-orm';
import { readdirSync } from 'fs';
import { join } from 'path';

async function updateHobbyImages() {
  try {
    console.log('=== 취미 이미지 업데이트 ===\n');

    // 1. public 폴더의 모든 이미지 파일 가져오기
    const publicDir = join(process.cwd(), 'public');
    const imageFiles = readdirSync(publicDir)
      .filter(file => /\.(png|jpg|jpeg|webp)$/i.test(file))
      .filter(file => file !== '휴라이프_로고.png'); // 로고 제외

    console.log(`📁 public 폴더의 이미지: ${imageFiles.length}개\n`);

    // 2. DB에서 모든 취미 가져오기
    const allHobbies = await db.select().from(hobbies);
    console.log(`📊 DB의 취미: ${allHobbies.length}개\n`);

    let updated = 0;
    let notFound = 0;
    let alreadySet = 0;

    // 3. 각 취미에 대해 이미지 매칭
    for (const hobby of allHobbies) {
      const hobbyName = hobby.name;

      // 이미지 파일명 변형들 시도
      const possibleNames = [
        `${hobbyName}.png`,
        `${hobbyName}.jpg`,
        `${hobbyName}.jpeg`,
        `${hobbyName}.webp`,
        `${hobbyName.replace(/\s+/g, '')}.png`, // 공백 제거
        `${hobbyName.replace(/\s+/g, '')}.jpg`,
      ];

      let foundImage = null;
      for (const name of possibleNames) {
        if (imageFiles.includes(name)) {
          foundImage = `/${name}`;
          break;
        }
      }

      if (foundImage) {
        // 이미 같은 이미지 URL이면 스킵
        if (hobby.imageUrl === foundImage) {
          console.log(`➡️  ${hobbyName} - 이미 설정됨`);
          alreadySet++;
          continue;
        }

        // 이미지 URL 업데이트
        await db
          .update(hobbies)
          .set({ imageUrl: foundImage })
          .where(eq(hobbies.id, hobby.id));

        console.log(`✅ ${hobbyName} -> ${foundImage}`);
        updated++;
      } else {
        console.log(`❌ ${hobbyName} - 이미지 없음`);
        notFound++;
      }
    }

    console.log(`\n📊 결과:`);
    console.log(`   업데이트: ${updated}개`);
    console.log(`   이미 설정됨: ${alreadySet}개`);
    console.log(`   이미지 없음: ${notFound}개`);

    if (notFound > 0) {
      console.log(`\n⚠️  이미지가 없는 취미들이 있습니다.`);
    }

  } catch (error) {
    console.error('❌ 에러 발생:', error);
    process.exit(1);
  }
  process.exit(0);
}

updateHobbyImages();
