import { db } from '../lib/db/index.js';
import { sql } from 'drizzle-orm';

async function createUserActivitiesTable() {
  try {
    console.log('📝 Creating user_activities table...');

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`user_activities\` (
        \`id\` varchar(255) NOT NULL,
        \`user_id\` varchar(255) NOT NULL,
        \`activity_type\` enum('view_hobby','view_community','view_post','search','join_community','add_hobby_interest','remove_hobby_interest','complete_survey','create_post','create_schedule') NOT NULL,
        \`target_id\` varchar(255),
        \`metadata\` json,
        \`created_at\` timestamp NOT NULL DEFAULT (now()),
        CONSTRAINT \`user_activities_id\` PRIMARY KEY(\`id\`)
      )
    `);

    console.log('✅ user_activities table created successfully!');

    console.log('📝 Adding foreign key constraint...');

    await db.execute(sql`
      ALTER TABLE \`user_activities\`
      ADD CONSTRAINT \`user_activities_user_id_users_id_fk\`
      FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`)
      ON DELETE no action ON UPDATE no action
    `);

    console.log('✅ Foreign key constraint added successfully!');

    // Verify the table was created
    const result = await db.execute(sql`SHOW TABLES LIKE 'user_activities'`);
    console.log('\n✅ Verification: user_activities table exists:', result.length > 0);

  } catch (error: any) {
    if (error.code === 'ER_DUP_KEYNAME') {
      console.log('⚠️ Foreign key constraint already exists, skipping...');
    } else {
      console.error('❌ Error creating table:', error);
      process.exit(1);
    }
  }

  process.exit(0);
}

createUserActivitiesTable();
