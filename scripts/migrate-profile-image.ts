import { connection } from '../lib/db';
import * as fs from 'fs';
import * as path from 'path';

async function migrate() {
  try {
    console.log('🔄 마이그레이션 시작: profile_image를 TEXT로 변경...');

    const sql = fs.readFileSync(
      path.join(__dirname, '../lib/db/migrations/0002_update_profile_image_to_text.sql'),
      'utf8'
    );

    await connection.query(sql);

    console.log('✅ 마이그레이션 완료!');
    console.log('📊 users 테이블의 profile_image 컬럼이 TEXT 타입으로 변경되었습니다.');

    process.exit(0);
  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error);
    process.exit(1);
  }
}

migrate();
