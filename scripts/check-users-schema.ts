import { connection } from '../lib/db';

async function checkSchema() {
  try {
    console.log('🔍 users 테이블 스키마 확인 중...\n');

    const [rows]: any = await connection.query(`
      DESCRIBE users
    `);

    console.log('📊 users 테이블 구조:');
    console.table(rows);

    const profileImageColumn = rows.find((row: any) => row.Field === 'profile_image');

    if (profileImageColumn) {
      console.log('\n✅ profile_image 컬럼 정보:');
      console.log('  - Type:', profileImageColumn.Type);
      console.log('  - Null:', profileImageColumn.Null);
      console.log('  - Default:', profileImageColumn.Default);

      if (profileImageColumn.Type === 'text') {
        console.log('\n✅ profile_image가 TEXT 타입으로 정상 변경되었습니다!');
      } else {
        console.log('\n❌ profile_image가 아직', profileImageColumn.Type, '타입입니다.');
        console.log('   마이그레이션을 다시 실행해주세요.');
      }
    } else {
      console.log('\n❌ profile_image 컬럼을 찾을 수 없습니다.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ 스키마 확인 실패:', error);
    process.exit(1);
  }
}

checkSchema();
