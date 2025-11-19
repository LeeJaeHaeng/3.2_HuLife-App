import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { sql } from 'drizzle-orm';

async function addVideoSupportToGallery() {
  console.log('🔧 Adding video support to gallery_items table...\n');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hulife',
  });

  const db = drizzle(connection);

  try {
    // Check existing columns
    const [columns] = await connection.query('DESCRIBE gallery_items') as any;
    const columnNames = columns.map((c: any) => c.Field);

    // 1. image 컬럼을 nullable로 변경
    console.log('1️⃣ Making image column nullable...');
    await db.execute(sql`
      ALTER TABLE gallery_items
      MODIFY COLUMN image LONGTEXT NULL
    `);
    console.log('✅ image column is now nullable\n');

    // 2. videoUrl 컬럼 추가 (if not exists)
    if (!columnNames.includes('video_url')) {
      console.log('2️⃣ Adding videoUrl column...');
      await db.execute(sql`
        ALTER TABLE gallery_items
        ADD COLUMN video_url VARCHAR(500) NULL AFTER image
      `);
      console.log('✅ video_url column added\n');
    } else {
      console.log('2️⃣ video_url column already exists. Skipping.\n');
    }

    // 3. videoThumbnail 컬럼 추가 (if not exists)
    if (!columnNames.includes('video_thumbnail')) {
      console.log('3️⃣ Adding videoThumbnail column...');
      await db.execute(sql`
        ALTER TABLE gallery_items
        ADD COLUMN video_thumbnail LONGTEXT NULL AFTER video_url
      `);
      console.log('✅ video_thumbnail column added\n');
    } else {
      console.log('3️⃣ video_thumbnail column already exists. Skipping.\n');
    }

    console.log('🎉 Video support added successfully!');
    console.log('📌 Now you can upload both images and videos to gallery.');
    console.log('📌 Video thumbnails will be generated automatically.');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

addVideoSupportToGallery()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
