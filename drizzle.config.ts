import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  schema: "./lib/db/schema.ts", // 스키마 파일 경로가 맞는지 확인하세요
  out: "./drizzle",
  dialect: "turso", // 또는 "sqlite"
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
});