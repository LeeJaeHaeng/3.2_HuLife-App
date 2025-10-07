import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config({
  path: ".env",
});

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '0000',
  database: process.env.DB_NAME || 'hobby_app',
};

async function createDatabase() {
  let connection;
  try {
    console.log("Connecting to MySQL server...");
    // Connect without specifying a database first
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
    });

    console.log(`Creating database: ${dbConfig.database}...`);
    await connection.query('CREATE DATABASE IF NOT EXISTS `' + dbConfig.database + '`');
    console.log("Database created or already exists.");

  } catch (error) {
    console.error("Error creating database:", error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log("Connection closed.");
    }
  }
}

createDatabase();
