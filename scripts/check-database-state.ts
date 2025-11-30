import { db } from "../lib/db";
import { users, reviews, joinRequests, communities } from "../lib/db/schema";

async function checkDatabaseState() {
  try {
    console.log("📊 데이터베이스 상태 확인...\n");

    // 모든 사용자 조회
    const allUsers = await db.select().from(users);
    console.log(`👥 총 사용자 수: ${allUsers.length}`);
    allUsers.forEach(user => {
      console.log(`  - ${user.name} (${user.email})`);
    });

    // 모든 리뷰 조회
    const allReviews = await db.select().from(reviews);
    console.log(`\n⭐ 총 리뷰 수: ${allReviews.length}`);
    if (allReviews.length > 0) {
      allReviews.forEach(review => {
        console.log(`  - 사용자 ID: ${review.userId}, 취미 ID: ${review.hobbyId}, 평점: ${review.rating}`);
      });
    }

    // 모든 가입 신청 조회
    const allJoinRequests = await db.select().from(joinRequests);
    console.log(`\n📬 총 가입 신청 수: ${allJoinRequests.length}`);
    if (allJoinRequests.length > 0) {
      allJoinRequests.forEach(req => {
        console.log(`  - 사용자 ID: ${req.userId}, 커뮤니티 ID: ${req.communityId}, 상태: ${req.status}`);
      });
    }

    // 모든 커뮤니티 조회
    const allCommunities = await db.select().from(communities);
    console.log(`\n👥 총 커뮤니티 수: ${allCommunities.length}`);
    allCommunities.forEach(community => {
      console.log(`  - ${community.name} (멤버: ${community.memberCount}/${community.maxMembers})`);
    });

    console.log("\n✅ 데이터베이스 상태 확인 완료!");
  } catch (error) {
    console.error("❌ 오류:", error);
    throw error;
  } finally {
    process.exit(0);
  }
}

checkDatabaseState();
