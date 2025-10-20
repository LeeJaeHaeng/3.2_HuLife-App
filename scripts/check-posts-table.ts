import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// Load environment variables
const envLocalPath = path.resolve(process.cwd(), ".env.local");
const envPath = path.resolve(process.cwd(), ".env");

if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

async function checkPostsTable() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    console.log("📋 posts table structure:");
    const [columns] = await connection.execute("DESCRIBE posts");
    console.table(columns);

    console.log("\n📋 users table structure:");
    const [userColumns] = await connection.execute("DESCRIBE users");
    console.table(userColumns);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await connection.end();
  }
}

checkPostsTable()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
