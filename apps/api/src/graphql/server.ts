import { ApolloServer } from 'apollo-server-express';

import schema from './schema';

import context from './context';

const server = new ApolloServer({
  schema: await schema,
  context,
});

export default server;
