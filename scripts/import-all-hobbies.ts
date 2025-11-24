/**
 * 🎯 전체 취미 데이터 임포트 스크립트
 *
 * hobbies-clean.json 파일에서 모든 취미 데이터를 읽어서
 * 데이터베이스에 삽입합니다.
 */

import { db } from '../lib/db';
import { hobbies } from '../lib/db/schema';
import * as fs from 'fs';
import * as path from 'path';

async function importAllHobbies() {
  try {
    console.log('🔍 취미 데이터 파일 읽기 중...');

    // JSON 파일 읽기
    const filePath = path.join(process.cwd(), 'hobbies-clean.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const hobbiesData = JSON.parse(fileContent);

    console.log(`📊 총 ${hobbiesData.length}개의 취미 데이터 발견\n`);

    // 카테고리별 통계
    const categoryStats: { [key: string]: number } = {};
    hobbiesData.forEach((hobby: any) => {
      categoryStats[hobby.category] = (categoryStats[hobby.category] || 0) + 1;
    });

    console.log('📋 카테고리별 분포:');
    Object.entries(categoryStats).forEach(([category, count]) => {
      console.log(`   ${category}: ${count}개`);
    });
    console.log('');

    // 기존 취미 확인
    console.log('🔍 기존 취미 데이터 확인 중...');
    const existingHobbies = await db.query.hobbies.findMany();
    console.log(`   현재 DB에 ${existingHobbies.length}개의 취미 존재\n`);

    if (existingHobbies.length > 0) {
      console.log('⚠️  기존 데이터가 존재합니다.');
      console.log('   데이터를 삭제하고 새로 삽입합니다...\n');

      // 기존 데이터 삭제 (외래 키 제약 조건 때문에 순서 중요)
      console.log('🗑️  기존 취미 데이터 삭제 중...');
      await db.delete(hobbies);
      console.log('   ✅ 기존 데이터 삭제 완료\n');
    }

    // 새 데이터 삽입
    console.log('💾 새로운 취미 데이터 삽입 중...');
    let insertedCount = 0;
    const batchSize = 10; // 10개씩 배치 삽입

    for (let i = 0; i < hobbiesData.length; i += batchSize) {
      const batch = hobbiesData.slice(i, i + batchSize);

      // curriculum 필드 제거 (스키마에서 삭제됨)
      const processedBatch = batch.map((hobby: any) => {
        const { curriculum, ...rest } = hobby;
        return rest;
      });

      await db.insert(hobbies).values(processedBatch);
      insertedCount += processedBatch.length;

      // 진행 상황 표시
      const progress = ((insertedCount / hobbiesData.length) * 100).toFixed(0);
      process.stdout.write(`\r   진행: ${insertedCount}/${hobbiesData.length} (${progress}%)   `);
    }

    console.log('\n   ✅ 모든 데이터 삽입 완료\n');

    // 최종 확인
    const finalCount = await db.query.hobbies.findMany();
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 취미 데이터 임포트 완료!\n');
    console.log(`📊 최종 결과:`);
    console.log(`   총 ${finalCount.length}개의 취미 데이터`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ 취미 데이터 임포트 오류:', error);
    process.exit(1);
  }
  process.exit(0);
}

importAllHobbies();
