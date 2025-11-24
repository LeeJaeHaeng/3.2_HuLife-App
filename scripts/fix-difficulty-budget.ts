import { db } from '../lib/db';
import { hobbies } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

async function fixData() {
  try {
    console.log('데이터 수정 시작...\n');

    const allHobbies = await db.query.hobbies.findMany();
    console.log(`총 ${allHobbies.length}개 취미 확인 중...\n`);

    let fixCount = 0;

    for (const hobby of allHobbies) {
      let needsUpdate = false;
      const updates: any = {};

      // 난이도 수정: 1-3 범위로 제한
      if (hobby.difficulty > 3) {
        updates.difficulty = 3;
        needsUpdate = true;
        console.log(`수정: ${hobby.name} - difficulty ${hobby.difficulty} → 3`);
      } else if (hobby.difficulty < 1) {
        updates.difficulty = 1;
        needsUpdate = true;
        console.log(`수정: ${hobby.name} - difficulty ${hobby.difficulty} → 1`);
      }

      // 예산 수정
      if (!hobby.budget || !['low', 'medium', 'high'].includes(hobby.budget)) {
        updates.budget = 'medium';
        needsUpdate = true;
        console.log(`수정: ${hobby.name} - budget ${hobby.budget} → medium`);
      }

      if (needsUpdate) {
        await db.update(hobbies)
          .set(updates)
          .where(eq(hobbies.id, hobby.id));
        fixCount++;
      }
    }

    console.log(`\n✅ 총 ${fixCount}개 취미 데이터 수정 완료!`);
  } catch (error) {
    console.error('❌ 오류:', error);
    process.exit(1);
  }
  process.exit(0);
}

fixData();
