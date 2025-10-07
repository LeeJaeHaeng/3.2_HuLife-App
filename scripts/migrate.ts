import { migrate } from "drizzle-orm/mysql2/migrator";
import { db, connection } from "../lib/db/index";

async function runMigration() {
  console.log("Running database migrations...");

  try {
    await migrate(db, { migrationsFolder: "./lib/db/migrations" });
    console.log("Migrations completed successfully!");
  } catch (error) {
    console.error("Error running migrations:", error);
    process.exit(1);
  } finally {
    await connection.end();
    console.log("Database connection closed.");
  }
}

runMigration();
