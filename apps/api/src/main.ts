import 'reflect-metadata';

import * as express from 'express';

import apolloServer from './graphql/server';

const app = express();

await apolloServer.start();
apolloServer.applyMiddleware({ app });

const port = process.env.PORT || 3333;

const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening at http://localhost:${port}`);
});

// eslint-disable-next-line no-console
server.on('error', console.error);
