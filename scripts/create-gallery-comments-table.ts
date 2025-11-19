import { db } from "@/lib/db"
import { sql } from "drizzle-orm"

async function createGalleryCommentsTable() {
  console.log("🔧 Creating gallery_comments table...")

  try {
    // Create gallery_comments table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS gallery_comments (
        id VARCHAR(255) PRIMARY KEY,
        gallery_item_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        user_image LONGTEXT,
        content TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (gallery_item_id) REFERENCES gallery_items(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    console.log("✅ gallery_comments table created successfully!")

    // Check table
    const result = await db.execute(sql`SHOW TABLES LIKE 'gallery_comments'`)
    console.log("📊 Table exists:", result)

  } catch (error) {
    console.error("❌ Error creating table:", error)
    throw error
  }
}

// Run migration
createGalleryCommentsTable()
  .then(() => {
    console.log("🎉 Migration completed!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("💥 Migration failed:", error)
    process.exit(1)
  })
