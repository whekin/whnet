import type { ExpressContext } from 'apollo-server-express';

import type { PrismaClient } from '@whnet/prisma-client';

import prisma from './prisma';

export interface Context {
  prisma: PrismaClient;
  user: any;
}

const context = ({ req }: ExpressContext): Context => {
  const user = req.user || null;

  return {
    prisma,
    user,
  };
};

export default context;
