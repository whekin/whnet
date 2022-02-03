import { ApolloClient } from '@apollo/client';

import link from '../link/link';
import cache from '../cache/cache';

const client = new ApolloClient({
  cache,
  link,
});

export default client;
