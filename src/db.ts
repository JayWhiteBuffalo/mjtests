import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

async function ensureConnection() {
  let isConnected = false;
  const retries = 5;
  const delay = 2000; // 2 seconds

  for (let i = 0; i < retries; i++) {
    try {
      await prisma.$connect();
      isConnected = true;
      break;
    } catch (error) {
      console.error(`Prisma connection attempt ${i + 1} failed:`, error);
      await new Promise(res => setTimeout(res, delay));
    }
  }

  if (!isConnected) {
    throw new Error('Could not establish a connection to the database.');
  }
}

// Ensure connection at the start of the application
ensureConnection().catch((error) => {
  console.error('Failed to establish a connection to the database:', error);
  process.exit(1);
});
