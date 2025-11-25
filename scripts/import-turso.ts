import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "../lib/db/schema";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const db = drizzle(client, { schema });

// 1. JSON 파일 읽기
function readData(tableName: string) {
  const filePath = path.join(process.cwd(), "data_backup", `${tableName}.json`);
  if (!fs.existsSync(filePath)) {
    // console.log(`⚠️ [${tableName}] 파일이 없어 건너뜁니다.`);
    return [];
  }
  const rawData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(rawData);
}

// 2. 키 변환 함수 (snake_case -> camelCase)
function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => toCamelCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z])/g, (g: string) => g[1].toUpperCase());
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
}

// 3. 데이터 가공 (날짜, JSON 파싱)
function processData(row: any, tableName: string): any {
  const newRow = toCamelCase(row);

  const dateFields = [
    "createdAt", "joinedAt", "completedAt", "startedAt", "respondedAt", "date"
  ];
  dateFields.forEach(field => {
    if (newRow[field]) newRow[field] = new Date(newRow[field]);
  });

  if (tableName === "hobbies") {
    if (typeof newRow.benefits === 'string') newRow.benefits = JSON.parse(newRow.benefits);
    if (typeof newRow.requirements === 'string') newRow.requirements = JSON.parse(newRow.requirements);
  }
  if (tableName === "posts" && typeof newRow.images === 'string') {
    newRow.images = JSON.parse(newRow.images);
  }
  if (tableName === "survey_responses" && typeof newRow.responses === 'string') {
    newRow.responses = JSON.parse(newRow.responses);
  }
  if (tableName === "user_activities" && typeof newRow.metadata === 'string') {
    newRow.metadata = JSON.parse(newRow.metadata);
  }

  return newRow;
}

// 4. 기존 데이터 삭제 함수 (자식 테이블 -> 부모 테이블 역순으로 지워야 함)
async function clearDatabase() {
  console.log("🧹 기존 데이터를 청소합니다...");
  try {
    // 의존성이 있는 자식 테이블부터 삭제
    await db.delete(schema.galleryLikes).run();
    await db.delete(schema.galleryComments).run();
    await db.delete(schema.postLikes).run();
    await db.delete(schema.postComments).run();
    await db.delete(schema.chatMessages).run();
    await db.delete(schema.chatRooms).run();
    await db.delete(schema.joinRequests).run();
    await db.delete(schema.communityMembers).run();
    await db.delete(schema.userActivities).run();
    await db.delete(schema.schedules).run();
    await db.delete(schema.reviews).run();
    await db.delete(schema.surveyResponses).run();
    await db.delete(schema.userHobbies).run();
    await db.delete(schema.galleryItems).run();
    await db.delete(schema.posts).run();
    await db.delete(schema.communities).run();
    // 최상위 부모 테이블 삭제
    await db.delete(schema.hobbies).run();
    await db.delete(schema.users).run();
    console.log("✨ 청소 완료! 깨끗한 상태에서 시작합니다.");
  } catch (e) {
    console.log("⚠️ 청소 중 오류 발생 (테이블이 비어있으면 무시하세요):", e);
  }
}

async function importData() {
  // 1. 먼저 기존 데이터 삭제
  await clearDatabase();

  console.log("🚀 Turso DB 데이터 입력을 시작합니다...");

  try {
    // 2. 입력 순서 (부모 -> 자식)
    const tableOrder = [
      { name: "users", schema: schema.users },
      { name: "hobbies", schema: schema.hobbies },
      { name: "communities", schema: schema.communities },
      { name: "posts", schema: schema.posts },
      { name: "gallery_items", schema: schema.galleryItems },
      { name: "user_hobbies", schema: schema.userHobbies },
      { name: "survey_responses", schema: schema.surveyResponses },
      { name: "reviews", schema: schema.reviews },
      { name: "schedules", schema: schema.schedules },
      { name: "user_activities", schema: schema.userActivities },
      { name: "community_members", schema: schema.communityMembers },
      { name: "join_requests", schema: schema.joinRequests },
      { name: "chat_rooms", schema: schema.chatRooms },
      { name: "chat_messages", schema: schema.chatMessages },
      { name: "post_comments", schema: schema.postComments },
      { name: "post_likes", schema: schema.postLikes },
      { name: "gallery_comments", schema: schema.galleryComments },
      { name: "gallery_likes", schema: schema.galleryLikes },
    ];

    for (const table of tableOrder) {
      const rawData = readData(table.name);
      if (rawData.length > 0) {
        const formattedData = rawData.map((row: any) => processData(row, table.name));
        
        // 데이터 입력
        await db.insert(table.schema).values(formattedData).run();
        console.log(`✅ ${table.name} (${formattedData.length}건) 입력 완료`);
      }
    }

    console.log("🎉 모든 데이터 이관 완벽 성공!");

  } catch (error) {
    console.error("❌ 데이터 입력 실패:", error);
  }
}

importData();