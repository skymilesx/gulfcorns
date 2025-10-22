import { PrismaClient } from '@prisma/client';

const g = global as unknown as { prisma?: PrismaClient };

// Only create PrismaClient if DATABASE_URL is available
export const prisma = g.prisma ?? (process.env.DATABASE_URL ? new PrismaClient() : null as any);

if (process.env.NODE_ENV !== 'production' && process.env.DATABASE_URL) g.prisma = prisma;

export default prisma;
