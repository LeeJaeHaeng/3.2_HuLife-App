import { db } from "../lib/db";
import { reviews, joinRequests, users } from "../lib/db/schema";
import { eq } from "drizzle-orm";

async function cleanupTestUserData() {
  try {
    console.log("🧹 테스트 사용자 데이터 정리 시작...\n");

    // test@hulife.com 사용자 찾기
    const testUser = await db
      .select()
      .from(users)
      .where(eq(users.email, "test@hulife.com"))
      .then((results) => results[0]);

    if (!testUser) {
      console.log("⚠️ test@hulife.com 사용자를 찾을 수 없습니다.");
      return;
    }

    console.log(`✅ 사용자 발견: ${testUser.name} (${testUser.email})\n`);

    // 기존 리뷰 삭제
    const deletedReviews = await db
      .delete(reviews)
      .where(eq(reviews.userId, testUser.id));

    console.log(`✅ 리뷰 ${deletedReviews.rowsAffected || 0}개 삭제됨`);

    // 기존 가입 신청 삭제
    const deletedJoinRequests = await db
      .delete(joinRequests)
      .where(eq(joinRequests.userId, testUser.id));

    console.log(`✅ 가입 신청 ${deletedJoinRequests.rowsAffected || 0}개 삭제됨`);

    console.log("\n🎉 테스트 사용자 데이터 정리 완료!");
  } catch (error) {
    console.error("❌ 데이터 정리 오류:", error);
    throw error;
  } finally {
    process.exit(0);
  }
}

cleanupTestUserData();
