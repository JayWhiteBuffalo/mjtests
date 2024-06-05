import {PrismaClient} from '@prisma/client'

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma ??= new PrismaClient()
}

export const prisma = process.env.NODE_ENV === 'production' ? new PrismaClient() : globalThis.prisma;

// import { PrismaClient } from '@prisma/client'

// const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

// export const prisma =
//   globalForPrisma.prisma || new PrismaClient()

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma