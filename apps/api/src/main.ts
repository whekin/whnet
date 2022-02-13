import 'reflect-metadata';

import { createServer } from 'http';
import { ApolloServer } from 'apollo-server-express';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import * as express from 'express';
import expressJwt from 'express-jwt';
import { execute, subscribe } from 'graphql';
import { applyMiddleware } from 'graphql-middleware';

import { schema, context, subContext, permissions } from './graphql';

const schemaWithPermissions = applyMiddleware(await schema, permissions);

const app = express();

app.use(
  expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    credentialsRequired: false,
  })
);

const httpServer = createServer(app);

const subscriptionServer = SubscriptionServer.create(
  {
    schema: await schema,
    execute,
    subscribe,
    onConnect(connectionParams, webSocket, ctx) {
      if (connectionParams?.authorization) {
        const token = connectionParams.authorization.split(' ')[1];

        return subContext(token);
      }

      throw new Error('Missing auth token!');
    },
  },
  { server: httpServer, path: '/graphql' }
);

const apolloServer = new ApolloServer({
  schema: schemaWithPermissions,
  context,
  plugins: [
    {
      async serverWillStart() {
        return {
          async drainServer() {
            subscriptionServer.close();
          },
        };
      },
    },
  ],
});

await apolloServer.start();
apolloServer.applyMiddleware({ app });

const port = process.env.PORT;

httpServer.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening at http://localhost:${port}/graphql`);
});
