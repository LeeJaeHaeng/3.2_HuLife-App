import { db } from '../lib/db';
import { hobbies } from '../lib/db/schema';
import { sql } from 'drizzle-orm';

async function cleanupDuplicates() {
  try {
    console.log('=== 중복 취미 확인 및 정리 ===\n');

    // 중복 취미 찾기
    const allHobbies = await db.select().from(hobbies);

    const hobbyGroups = new Map<string, typeof allHobbies>();

    allHobbies.forEach(hobby => {
      if (!hobbyGroups.has(hobby.name)) {
        hobbyGroups.set(hobby.name, []);
      }
      hobbyGroups.get(hobby.name)!.push(hobby);
    });

    const duplicates = Array.from(hobbyGroups.entries())
      .filter(([_, hobbies]) => hobbies.length > 1);

    if (duplicates.length === 0) {
      console.log('✅ 중복된 취미가 없습니다.');
      process.exit(0);
    }

    console.log(`⚠️  중복된 취미 발견: ${duplicates.length}개\n`);

    for (const [name, dupes] of duplicates) {
      console.log(`📋 "${name}" - ${dupes.length}개 중복`);
      dupes.forEach((hobby, index) => {
        console.log(`   ${index + 1}. ID: ${hobby.id}`);
      });

      // 첫 번째 항목만 남기고 나머지 삭제
      const toKeep = dupes[0];
      const toDelete = dupes.slice(1);

      for (const hobby of toDelete) {
        console.log(`   🔄 참조 이동: ${hobby.id} -> ${toKeep.id}`);

        // user_hobbies의 참조를 유지할 ID로 변경
        await db.execute(sql`
          UPDATE user_hobbies
          SET hobby_id = ${toKeep.id}
          WHERE hobby_id = ${hobby.id}
        `);

        // communities의 참조를 유지할 ID로 변경
        await db.execute(sql`
          UPDATE communities
          SET hobby_id = ${toKeep.id}
          WHERE hobby_id = ${hobby.id}
        `);

        console.log(`   🗑️  삭제: ${hobby.id}`);
        await db.delete(hobbies).where(sql`${hobbies.id} = ${hobby.id}`);
      }
      console.log(`   ✅ "${name}" - ${toKeep.id} 유지\n`);
    }

    const finalCount = await db.select().from(hobbies);
    console.log(`\n✅ 정리 완료! 총 ${finalCount.length}개 취미`);

  } catch (error) {
    console.error('에러 발생:', error);
    process.exit(1);
  }
  process.exit(0);
}

cleanupDuplicates();
