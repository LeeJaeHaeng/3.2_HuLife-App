import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

// ⚠️ 로컬 MySQL 비밀번호를 꼭 입력하세요!
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "0000", // <-- 여기에 비밀번호 입력
  database: "hobby_app",     // <-- 로컬 DB 이름 입력
};

async function exportData() {
  const connection = await mysql.createConnection(dbConfig);
  const dataDir = path.join(process.cwd(), "data_backup");

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  console.log("🚀 MySQL 데이터 추출 시작...");

  // 제공해주신 모든 테이블 목록
  const tables = [
    "users",
    "hobbies",
    "communities",
    "posts",
    "gallery_items",
    "chat_rooms",
    "chat_messages",
    "community_members",
    "gallery_comments",
    "gallery_likes",
    "join_requests",
    "post_comments",
    "post_likes",
    "reviews",
    "schedules",
    "survey_responses",
    "user_activities",
    "user_hobbies"
  ];

  for (const table of tables) {
    try {
      const [rows] = await connection.query(`SELECT * FROM ${table}`);
      fs.writeFileSync(
        path.join(dataDir, `${table}.json`), 
        JSON.stringify(rows, null, 2)
      );
      console.log(`✅ ${table} 추출 완료 (${(rows as any[]).length}건)`);
    } catch (error) {
      console.error(`⚠️ ${table} 추출 실패 (테이블이 비었거나 없음):`, error);
    }
  }

  await connection.end();
  console.log("🎉 모든 데이터 추출 완료! (data_backup 폴더 확인)");
}

exportData();