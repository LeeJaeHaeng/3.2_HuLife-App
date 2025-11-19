import { db } from '../lib/db';
import { sql } from 'drizzle-orm';

async function createGalleryTables() {
  try {
    console.log('Creating gallery_items table...');

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS gallery_items (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        user_image LONGTEXT,
        hobby_id VARCHAR(255) NOT NULL,
        hobby_name VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image LONGTEXT NOT NULL,
        likes INT NOT NULL DEFAULT 0,
        views INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (hobby_id) REFERENCES hobbies(id)
      )
    `);

    console.log('Creating gallery_likes table...');

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS gallery_likes (
        id VARCHAR(255) PRIMARY KEY,
        gallery_item_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (gallery_item_id) REFERENCES gallery_items(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    console.log('✅ Gallery tables created successfully!');
  } catch (error: any) {
    if (error.message?.includes('already exists')) {
      console.log('⚠️  Tables already exist, skipping...');
    } else {
      console.error('❌ Error creating tables:', error);
      throw error;
    }
  }
}

createGalleryTables()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
