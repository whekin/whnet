import type { ExpressContext } from 'apollo-server-express';

import type { PrismaClient } from '@whnet/prisma-client';

import prisma from './prisma';

interface UserJWT {
  nickname: string;
}

export interface Context {
  prisma: PrismaClient;
  user: UserJWT | null;
}

export const context = ({ req }: ExpressContext): Context => {
  const user: Context['user'] = req.user || null;

  return {
    prisma,
    user,
  };
};

export default context;
