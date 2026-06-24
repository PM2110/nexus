import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const initDb = async () => {
  try {
    await prisma.$connect();
    console.log('PostgreSQL database connection established via Prisma.');
  } catch (error) {
    console.error('Failed to connect to the database via Prisma:', error);
    throw error;
  }
};
