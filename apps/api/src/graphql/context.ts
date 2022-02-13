import { verify, JwtPayload } from 'jsonwebtoken';
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

export const subContext = (token: string): Context => {
  let user = null;

  try {
    const { nickname } = verify(token, process.env.JWT_SECRET) as JwtPayload;

    user = { nickname };
    // eslint-disable-next-line no-empty
  } catch (err) {}

  return { user, prisma };
};

export default context;
