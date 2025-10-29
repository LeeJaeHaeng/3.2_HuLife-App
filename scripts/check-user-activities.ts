import { db } from '../lib/db/index.js';
import { sql } from 'drizzle-orm';

async function checkUserActivitiesTable() {
  try {
    const result = await db.execute(sql`SHOW TABLES LIKE 'user_activities'`);
    console.log('✅ user_activities table exists:', result.length > 0);

    if (result.length > 0) {
      // Check the structure
      const structure = await db.execute(sql`DESCRIBE user_activities`);
      console.log('\nTable structure:');
      console.log(structure);
    } else {
      console.log('❌ user_activities table does NOT exist');
    }
  } catch (error) {
    console.error('❌ Error checking table:', error);
  }
  process.exit(0);
}

checkUserActivitiesTable();
