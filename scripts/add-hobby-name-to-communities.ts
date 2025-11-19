import { db } from '../lib/db';
import { sql } from 'drizzle-orm';

async function addHobbyNameToCommunities() {
  try {
    console.log('🔧 Starting communities table migration...\n');

    // Step 1: hobby_name 컬럼 추가
    console.log('1️⃣ Adding hobby_name column to communities table...');
    try {
      await db.execute(sql`
        ALTER TABLE communities
        ADD COLUMN hobby_name VARCHAR(255) NOT NULL DEFAULT ''
      `);
      console.log('✅ hobby_name column added successfully!\n');
    } catch (error: any) {
      if (error.message?.includes('Duplicate column')) {
        console.log('⚠️  hobby_name column already exists, skipping...\n');
      } else {
        throw error;
      }
    }

    // Step 2: 기존 데이터의 hobby_name 필드를 hobbies 테이블에서 채우기
    console.log('2️⃣ Populating hobby_name from hobbies table...');
    await db.execute(sql`
      UPDATE communities c
      INNER JOIN hobbies h ON c.hobby_id = h.id
      SET c.hobby_name = h.name
      WHERE c.hobby_name = '' OR c.hobby_name IS NULL
    `);
    console.log('✅ hobby_name populated successfully!\n');

    // Step 3: 검증 - 모든 커뮤니티의 hobby_name 확인
    console.log('3️⃣ Verifying migration...');
    const result = await db.execute(sql`
      SELECT id, name, hobby_id, hobby_name
      FROM communities
    `);

    console.log(`\n총 ${result.rows.length}개 커뮤니티 확인:`);
    for (const row: any of result.rows) {
      console.log(`  - ${row.name}: hobby_name = "${row.hobby_name}"`);
    }

    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Added: communities.hobby_name VARCHAR(255)');
    console.log('   ✅ Populated existing records with hobby names');

  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  }
}

addHobbyNameToCommunities()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
