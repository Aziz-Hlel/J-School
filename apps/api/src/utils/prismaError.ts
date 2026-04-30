import { Prisma } from '@repo/db/prisma/client';

export const isUniqueConstraintError = (error: Prisma.PrismaClientKnownRequestError) => {
  return error.code === 'P2002';
};

export const isForeignKeyConstraintError = (error: Prisma.PrismaClientKnownRequestError) => {
  return error.code === 'P2003';
};

export const isRecordNotFoundError = (error: Prisma.PrismaClientKnownRequestError) => {
  return error.code === 'P2025';
};
