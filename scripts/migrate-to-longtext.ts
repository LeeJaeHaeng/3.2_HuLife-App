import { connection } from '../lib/db';
import * as fs from 'fs';
import * as path from 'path';

async function migrate() {
  try {
    console.log('🔄 마이그레이션 시작: profile_image를 LONGTEXT로 변경...');
    console.log('📊 TEXT는 최대 65KB만 저장 가능');
    console.log('📊 LONGTEXT는 최대 4GB 저장 가능');
    console.log('');

    const sql = fs.readFileSync(
      path.join(__dirname, '../lib/db/migrations/0003_update_profile_image_to_longtext.sql'),
      'utf8'
    );

    await connection.query(sql);

    console.log('✅ 마이그레이션 완료!');
    console.log('📊 users 테이블의 profile_image 컬럼이 LONGTEXT 타입으로 변경되었습니다.');
    console.log('🎉 이제 대용량 이미지도 업로드 가능합니다!');

    // 변경 확인
    const [rows]: any = await connection.query('DESCRIBE users');
    const profileImageColumn = rows.find((row: any) => row.Field === 'profile_image');

    console.log('\n✅ 확인된 타입:', profileImageColumn.Type);

    process.exit(0);
  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error);
    process.exit(1);
  }
}

migrate();
