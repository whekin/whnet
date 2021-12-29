import { ApolloServer } from 'apollo-server-express';

import prisma from './prisma';
import schema from './schema';

import type Context from './context';

const server = new ApolloServer({
  schema: await schema,
  context: (): Context => ({
    prisma,
  }),
});

export default server;
