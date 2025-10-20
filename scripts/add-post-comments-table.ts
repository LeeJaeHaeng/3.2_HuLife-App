import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// Try .env.local first, then fall back to .env
const envLocalPath = path.resolve(process.cwd(), ".env.local");
const envPath = path.resolve(process.cwd(), ".env");

if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.error("❌ No .env or .env.local file found!");
  process.exit(1);
}

async function addPostCommentsTable() {
  console.log("📋 Database connection info:");
  console.log("  Host:", process.env.DB_HOST);
  console.log("  User:", process.env.DB_USER);
  console.log("  Database:", process.env.DB_NAME);
  console.log("  Password:", process.env.DB_PASSWORD ? "***" : "(not set)");

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log("\n🔄 Creating post_comments table...");

  try {
    // First, create the table without foreign key constraints
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS post_comments (
        id VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci PRIMARY KEY,
        post_id VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        user_id VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        user_name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        user_image VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        content TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_post_id (post_id),
        INDEX idx_user_id (user_id),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log("✅ Table created successfully!");

    // Try to add foreign key constraints (may fail if they already exist, which is fine)
    try {
      await connection.execute(`
        ALTER TABLE post_comments
        ADD CONSTRAINT fk_post_comments_post
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
      `);
      console.log("✅ Foreign key constraint for post_id added!");
    } catch (fkError: any) {
      if (fkError.code === 'ER_DUP_KEYNAME' || fkError.code === 'ER_FK_DUP_NAME') {
        console.log("⚠️  Foreign key constraint for post_id already exists, skipping...");
      } else {
        console.log("⚠️  Could not add foreign key constraint for post_id:", fkError.message);
      }
    }

    try {
      await connection.execute(`
        ALTER TABLE post_comments
        ADD CONSTRAINT fk_post_comments_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
      `);
      console.log("✅ Foreign key constraint for user_id added!");
    } catch (fkError: any) {
      if (fkError.code === 'ER_DUP_KEYNAME' || fkError.code === 'ER_FK_DUP_NAME') {
        console.log("⚠️  Foreign key constraint for user_id already exists, skipping...");
      } else {
        console.log("⚠️  Could not add foreign key constraint for user_id:", fkError.message);
      }
    }

    console.log("✅ post_comments table created successfully!");

    // Check if table was created
    const [rows] = await connection.execute(`
      SHOW TABLES LIKE 'post_comments';
    `);

    if (Array.isArray(rows) && rows.length > 0) {
      console.log("✅ Table verification successful!");

      // Show table structure
      const [columns] = await connection.execute(`
        DESCRIBE post_comments;
      `);

      console.log("\n📋 Table structure:");
      console.table(columns);
    } else {
      console.error("❌ Table verification failed!");
    }

  } catch (error) {
    console.error("❌ Error creating table:", error);
    throw error;
  } finally {
    await connection.end();
    console.log("\n✅ Database connection closed.");
  }
}

// Run the migration
addPostCommentsTable()
  .then(() => {
    console.log("\n🎉 Migration completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  });
