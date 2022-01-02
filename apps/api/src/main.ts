import 'reflect-metadata';

import * as express from 'express';
import expressJwt from 'express-jwt';

import apolloServer from './graphql/server';

const app = express();
app.use(
  expressJwt({
    secret: process.env.JTW_SECRET,
    algorithms: ['HS256'],
    credentialsRequired: false,
  })
);

await apolloServer.start();

apolloServer.applyMiddleware({ app });

const port = process.env.PORT || 3333;

const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening at http://localhost:${port}/graphql`);
});

// eslint-disable-next-line no-console
server.on('error', console.error);
