/**
 * 데이터 손실 없이 스키마 마이그레이션
 * communities와 userHobbies 테이블의 default 값 제거 문제 해결
 */

import { createClient } from '@libsql/client';
import 'dotenv/config';

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function migrateSchema() {
  console.log('🔧 스키마 마이그레이션 시작...\n');

  try {
    // 1. communities 테이블의 hobby_name 컬럼 업데이트
    console.log('1️⃣ communities.hobby_name 컬럼 업데이트 중...');

    // hobby_name이 비어있거나 default 값인 레코드 확인
    const communitiesCheck = await client.execute(`
      SELECT id, name, hobby_id, hobby_name
      FROM communities
      WHERE hobby_name = '' OR hobby_name IS NULL
    `);

    if (communitiesCheck.rows.length > 0) {
      console.log(`   ⚠️ hobby_name이 비어있는 레코드 ${communitiesCheck.rows.length}개 발견`);

      // hobbies 테이블에서 hobby_name 가져와서 업데이트
      await client.execute(`
        UPDATE communities
        SET hobby_name = (
          SELECT name FROM hobbies WHERE hobbies.id = communities.hobby_id
        )
        WHERE hobby_name = '' OR hobby_name IS NULL
      `);

      console.log('   ✅ communities.hobby_name 업데이트 완료');
    } else {
      console.log('   ✅ communities.hobby_name 이미 정상 상태');
    }

    // 2. userHobbies 테이블의 컬럼 업데이트
    console.log('\n2️⃣ userHobbies 테이블 컬럼 업데이트 중...');

    const userHobbiesCheck = await client.execute(`
      SELECT id, hobby_id, hobby_name, hobby_category, hobby_image
      FROM user_hobbies
      WHERE hobby_name = '' OR hobby_name IS NULL
         OR hobby_category = '' OR hobby_category IS NULL
         OR hobby_image = '' OR hobby_image IS NULL
    `);

    if (userHobbiesCheck.rows.length > 0) {
      console.log(`   ⚠️ 비어있는 컬럼이 있는 레코드 ${userHobbiesCheck.rows.length}개 발견`);

      // hobbies 테이블에서 정보 가져와서 업데이트
      await client.execute(`
        UPDATE user_hobbies
        SET
          hobby_name = (SELECT name FROM hobbies WHERE hobbies.id = user_hobbies.hobby_id),
          hobby_category = (SELECT category FROM hobbies WHERE hobbies.id = user_hobbies.hobby_id),
          hobby_description = (SELECT description FROM hobbies WHERE hobbies.id = user_hobbies.hobby_id),
          hobby_image = (SELECT image_url FROM hobbies WHERE hobbies.id = user_hobbies.hobby_id)
        WHERE hobby_name = '' OR hobby_name IS NULL
           OR hobby_category = '' OR hobby_category IS NULL
           OR hobby_image = '' OR hobby_image IS NULL
      `);

      console.log('   ✅ userHobbies 테이블 업데이트 완료');
    } else {
      console.log('   ✅ userHobbies 테이블 이미 정상 상태');
    }

    console.log('\n✅ 스키마 마이그레이션 완료!');
    console.log('이제 안전하게 "npx drizzle-kit push"를 실행할 수 있습니다.');

  } catch (error) {
    console.error('❌ 마이그레이션 오류:', error);
    process.exit(1);
  }
}

migrateSchema();
