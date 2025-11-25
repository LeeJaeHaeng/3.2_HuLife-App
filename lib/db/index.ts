import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import * as schema from './schema';

dotenv.config({
  path: ".env",
});

const requiredEnvVars = ['DATABASE_URL', 'TURSO_AUTH_TOKEN'] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(
      `The ${envVar} environment variable is not set. Please create a .env file and set all the required variables.`
    );
  }
}

export const connection = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const db = drizzle(connection, { schema });
