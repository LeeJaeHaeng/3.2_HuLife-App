// scripts/check-db.ts
import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "0000", // <-- 본인 비밀번호 꼭 넣으세요!
};

async function checkDatabases() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query("SHOW DATABASES");
    console.log("👇 내 컴퓨터에 있는 데이터베이스 목록 👇");
    console.log(rows);
    await connection.end();
  } catch (error) {
    console.error("❌ 접속 실패! 비밀번호가 틀렸거나 MySQL이 꺼져 있습니다.", error);
  }
}

checkDatabases();