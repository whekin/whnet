import { ApolloServer } from 'apollo-server-express';
import { applyMiddleware } from 'graphql-middleware';

import schema from './schema';

import context from './context';
import permissions from './shield';

const schemaWithPermissions = applyMiddleware(await schema, permissions);

const server = new ApolloServer({
  schema: schemaWithPermissions,
  context,
});

export default server;
