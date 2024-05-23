import {PrismaClient} from '@prisma/client'

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma ??= new PrismaClient()
}

export const prisma =
  process.env.NODE_ENV === 'production' ? new PrismaClient() : globalThis.prisma
