import type { PrismaClient } from '@whnet/prisma-client';

interface Context {
  prisma: PrismaClient;
}

export default Context;
