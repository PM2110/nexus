import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not defined.');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });

export const initDb = async () => {
  try {
    const client = await pool.connect();
    client.release();
    console.log('PostgreSQL database connection established via Prisma driver adapter.');
  } catch (error) {
    console.error('Failed to connect to the database via Prisma driver adapter:', error);
    throw error;
  }
};
