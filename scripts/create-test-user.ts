/**
 * 테스트 사용자 계정 생성 스크립트
 *
 * 생성되는 계정 정보:
 * - 이메일: test@hulife.com
 * - 비밀번호: test1234
 * - 이름: 테스트 유저
 */

import { db } from '../lib/db';
import { users } from '../lib/db/schema';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

const TEST_USER = {
  email: 'test@hulife.com',
  password: 'test1234',
  name: '테스트 유저',
  age: 30,
  location: '서울',
};

async function createTestUser() {
  try {
    console.log('🔍 테스트 사용자 존재 여부 확인...');

    // 기존 테스트 유저 확인
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, TEST_USER.email),
    });

    if (existingUser) {
      console.log('✅ 테스트 사용자가 이미 존재합니다.');
      console.log(`   - 이메일: ${TEST_USER.email}`);
      console.log(`   - 비밀번호: ${TEST_USER.password}`);
      return;
    }

    console.log('👤 테스트 사용자 생성 중...');

    // 비밀번호 해시
    const hashedPassword = await bcrypt.hash(TEST_USER.password, 10);

    // 사용자 생성
    await db.insert(users).values({
      id: randomUUID(),
      email: TEST_USER.email,
      password: hashedPassword,
      name: TEST_USER.name,
      age: TEST_USER.age,
      location: TEST_USER.location,
      phone: null,
      profileImage: null,
      createdAt: new Date(),
    });

    console.log('\n✅ 테스트 사용자 생성 완료!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 이메일:', TEST_USER.email);
    console.log('🔑 비밀번호:', TEST_USER.password);
    console.log('👤 이름:', TEST_USER.name);
    console.log('📍 위치:', TEST_USER.location);
    console.log('🎂 나이:', TEST_USER.age);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n💡 모바일 앱에서 위 정보로 로그인하세요!');
  } catch (error) {
    console.error('❌ 테스트 사용자 생성 오류:', error);
    process.exit(1);
  }
  process.exit(0);
}

createTestUser();
