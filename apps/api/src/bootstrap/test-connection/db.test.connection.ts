import { prisma } from '../db.init';

export const testDbConnection = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ SUCCESS : Database connected successfully!');
  } catch (error) {
    console.error('❌ ERROR : Database connection failed.', error);
    throw error;
  }
};
