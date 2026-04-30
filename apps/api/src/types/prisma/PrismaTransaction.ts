import { prisma } from '@/bootstrap/db.init';

export type TX = Omit<typeof prisma, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;
