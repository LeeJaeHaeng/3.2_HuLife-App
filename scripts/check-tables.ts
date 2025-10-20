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

async function checkTables() {
  console.log("📋 Connecting to database...");
  console.log("  Host:", process.env.DB_HOST);
  console.log("  User:", process.env.DB_USER);
  console.log("  Database:", process.env.DB_NAME);

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    // Check all tables
    console.log("\n📊 All tables in database:");
    const [tables] = await connection.execute("SHOW TABLES");
    console.table(tables);

    // Check if post_comments exists
    const [postCommentsCheck] = await connection.execute(
      "SHOW TABLES LIKE 'post_comments'"
    );

    if (Array.isArray(postCommentsCheck) && postCommentsCheck.length > 0) {
      console.log("\n✅ post_comments table exists!");

      // Show structure
      const [columns] = await connection.execute("DESCRIBE post_comments");
      console.log("\n📋 post_comments table structure:");
      console.table(columns);

      // Count rows
      const [count]: any = await connection.execute(
        "SELECT COUNT(*) as count FROM post_comments"
      );
      console.log(`\n📊 Total comments: ${count[0].count}`);
    } else {
      console.log("\n❌ post_comments table does NOT exist!");
      console.log("\n💡 Run this to create it:");
      console.log("   npm run migrate:comments");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await connection.end();
  }
}

checkTables()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
