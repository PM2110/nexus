import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { config } from './env';

const pool = new Pool({ connectionString: config.DATABASE_URL });
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
