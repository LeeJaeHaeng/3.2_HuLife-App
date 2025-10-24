import { connection } from '../lib/db';
import * as fs from 'fs';
import * as path from 'path';

async function migrate() {
  try {
    console.log('🔄 마이그레이션 시작: posts 테이블에 images 컬럼 추가...');

    const sql = fs.readFileSync(
      path.join(__dirname, '../lib/db/migrations/0004_add_images_to_posts.sql'),
      'utf8'
    );

    await connection.query(sql);

    console.log('✅ 마이그레이션 완료!');
    console.log('📊 posts 테이블에 images 컬럼(LONGTEXT)이 추가되었습니다.');
    console.log('🎉 이제 게시글에 대용량 이미지를 업로드할 수 있습니다!');

    // 변경 확인
    const [rows]: any = await connection.query('DESCRIBE posts');
    const imagesColumn = rows.find((row: any) => row.Field === 'images');

    if (imagesColumn) {
      console.log('\n✅ 확인된 컬럼:', imagesColumn.Field, '/', imagesColumn.Type);
    }

    process.exit(0);
  } catch (error: any) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('ℹ️  images 컬럼이 이미 존재합니다. 스킵합니다.');
      process.exit(0);
    }
    console.error('❌ 마이그레이션 실패:', error);
    process.exit(1);
  }
}

migrate();
