import { db, connection } from "../lib/db/index";
import { sql } from "drizzle-orm";

async function resetDatabase() {
  console.log("⚠️  WARNING: This will drop all tables from the database.");

  try {
    console.log("Fetching all table names...");
    // The type from db.execute is any, so we need to be careful
    const queryResult: any = await db.execute(sql`SHOW TABLES;`);
    
    // mysql2 returns an array of rows and then fields. We only need the rows.
    const rows = queryResult[0] as Record<string, any>[];
    
    if (!rows || rows.length === 0) {
      console.log("No tables found to drop. Database is already empty.");
      await connection.end();
      return;
    }

    const key = Object.keys(rows[0])[0];
    const tableNames = rows.map((row) => row[key] as string);

    console.log("Disabling foreign key checks...");
    await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0;`);

    console.log("Dropping all tables...");
    for (const tableName of tableNames) {
      console.log(`Dropping table: ${tableName}`);
      await db.execute(sql.raw(`DROP TABLE IF EXISTS \`${tableName}\``));
    }
    console.log("All tables dropped successfully.");

  } catch (error) {
    console.error("Error resetting database:", error);
    process.exit(1);
  } finally {
    try {
      console.log("Re-enabling foreign key checks...");
      await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1;`);
    } catch (e) {
      console.error("Could not re-enable foreign key checks.", e);
    }
    await connection.end();
    console.log("Database connection closed.");
  }
}

resetDatabase();
