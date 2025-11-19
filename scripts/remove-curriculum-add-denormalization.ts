import { db } from '../lib/db';
import { sql } from 'drizzle-orm';

async function migrateDatabaseSchema() {
  try {
    console.log('🔧 Starting database migration...\n');

    // Step 1: hobbies 테이블에서 curriculum 컬럼 제거
    console.log('1️⃣ Removing curriculum column from hobbies table...');
    try {
      await db.execute(sql`
        ALTER TABLE hobbies
        DROP COLUMN curriculum
      `);
      console.log('✅ curriculum column removed successfully!\n');
    } catch (error: any) {
      if (error.message?.includes("doesn't exist") || error.message?.includes("check that it exists")) {
        console.log('⚠️  curriculum column already removed, skipping...\n');
      } else {
        throw error;
      }
    }

    // Step 2: userHobbies 테이블에 비정규화 필드 추가
    console.log('2️⃣ Adding denormalized fields to user_hobbies table...');

    // hobby_name 추가
    try {
      await db.execute(sql`
        ALTER TABLE user_hobbies
        ADD COLUMN hobby_name VARCHAR(255) NOT NULL DEFAULT ''
      `);
      console.log('   ✅ hobby_name column added');
    } catch (error: any) {
      if (error.message?.includes('Duplicate column')) {
        console.log('   ⚠️  hobby_name column already exists');
      } else {
        throw error;
      }
    }

    // hobby_category 추가
    try {
      await db.execute(sql`
        ALTER TABLE user_hobbies
        ADD COLUMN hobby_category VARCHAR(255) NOT NULL DEFAULT ''
      `);
      console.log('   ✅ hobby_category column added');
    } catch (error: any) {
      if (error.message?.includes('Duplicate column')) {
        console.log('   ⚠️  hobby_category column already exists');
      } else {
        throw error;
      }
    }

    // hobby_description 추가
    try {
      await db.execute(sql`
        ALTER TABLE user_hobbies
        ADD COLUMN hobby_description TEXT NOT NULL
      `);
      console.log('   ✅ hobby_description column added');
    } catch (error: any) {
      if (error.message?.includes('Duplicate column')) {
        console.log('   ⚠️  hobby_description column already exists');
      } else {
        throw error;
      }
    }

    // hobby_image 추가
    try {
      await db.execute(sql`
        ALTER TABLE user_hobbies
        ADD COLUMN hobby_image VARCHAR(255) NOT NULL DEFAULT ''
      `);
      console.log('   ✅ hobby_image column added');
    } catch (error: any) {
      if (error.message?.includes('Duplicate column')) {
        console.log('   ⚠️  hobby_image column already exists');
      } else {
        throw error;
      }
    }

    console.log('\n3️⃣ Populating denormalized fields from hobbies table...');

    // 기존 데이터가 있다면 hobbies 테이블에서 정보를 가져와 채우기
    await db.execute(sql`
      UPDATE user_hobbies uh
      INNER JOIN hobbies h ON uh.hobby_id = h.id
      SET
        uh.hobby_name = h.name,
        uh.hobby_category = h.category,
        uh.hobby_description = h.description,
        uh.hobby_image = h.image_url
      WHERE uh.hobby_name = '' OR uh.hobby_category = '' OR uh.hobby_image = ''
    `);
    console.log('✅ Denormalized fields populated from hobbies table!\n');

    console.log('🎉 Database migration completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Removed: hobbies.curriculum');
    console.log('   ✅ Added: user_hobbies.hobby_name');
    console.log('   ✅ Added: user_hobbies.hobby_category');
    console.log('   ✅ Added: user_hobbies.hobby_description');
    console.log('   ✅ Added: user_hobbies.hobby_image');
    console.log('   ✅ Populated existing user_hobbies records with hobby data');

  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  }
}

migrateDatabaseSchema()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
