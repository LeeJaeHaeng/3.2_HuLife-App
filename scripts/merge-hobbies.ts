import { db } from '../lib/db';
import { hobbies, userHobbies, communities } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

async function mergeHobbies() {
  try {
    console.log('=== 파크골프를 게이트볼로 통합 ===\n');

    // 1. 두 취미 정보 가져오기
    const parkGolf = await db.query.hobbies.findFirst({
      where: eq(hobbies.name, '파크골프')
    });

    const gateball = await db.query.hobbies.findFirst({
      where: eq(hobbies.name, '게이트볼')
    });

    if (!parkGolf) {
      console.log('❌ 파크골프를 찾을 수 없습니다.');
      process.exit(1);
    }

    if (!gateball) {
      console.log('❌ 게이트볼을 찾을 수 없습니다.');
      process.exit(1);
    }

    console.log(`📋 파크골프 ID: ${parkGolf.id}`);
    console.log(`📋 게이트볼 ID: ${gateball.id}\n`);

    // 2. 파크골프를 선택한 사용자들을 게이트볼로 이동
    const parkGolfUsers = await db.select().from(userHobbies).where(
      eq(userHobbies.hobbyId, parkGolf.id)
    );

    console.log(`👥 파크골프를 선택한 사용자: ${parkGolfUsers.length}명`);

    if (parkGolfUsers.length > 0) {
      for (const userHobby of parkGolfUsers) {
        // 이미 게이트볼을 선택한 사용자인지 확인
        const existing = await db.query.userHobbies.findFirst({
          where: (uh, { and, eq }) => and(
            eq(uh.userId, userHobby.userId),
            eq(uh.hobbyId, gateball.id)
          )
        });

        if (!existing) {
          await db.update(userHobbies)
            .set({ hobbyId: gateball.id })
            .where(eq(userHobbies.id, userHobby.id));
          console.log(`  ✓ 사용자 ${userHobby.userId} 이동`);
        } else {
          // 중복이면 그냥 삭제
          await db.delete(userHobbies).where(eq(userHobbies.id, userHobby.id));
          console.log(`  ✓ 사용자 ${userHobby.userId} 중복 제거`);
        }
      }
    }

    // 3. 파크골프 커뮤니티를 게이트볼로 이동
    const parkGolfCommunities = await db.select().from(communities).where(
      eq(communities.hobbyId, parkGolf.id)
    );

    console.log(`\n🏘️  파크골프 커뮤니티: ${parkGolfCommunities.length}개`);

    if (parkGolfCommunities.length > 0) {
      await db.update(communities)
        .set({ hobbyId: gateball.id })
        .where(eq(communities.hobbyId, parkGolf.id));
      console.log(`  ✓ 모든 커뮤니티를 게이트볼로 이동`);
    }

    // 4. 파크골프 취미 삭제
    await db.delete(hobbies).where(eq(hobbies.id, parkGolf.id));
    console.log(`\n🗑️  파크골프 취미 삭제 완료`);

    // 5. 최종 확인
    const finalCount = await db.select().from(hobbies);
    console.log(`\n✅ 통합 완료! 총 취미 수: ${finalCount.length}개`);

  } catch (error) {
    console.error('❌ 에러 발생:', error);
    process.exit(1);
  }
  process.exit(0);
}

mergeHobbies();
