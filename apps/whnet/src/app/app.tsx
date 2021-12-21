import React from 'react';
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'cross-fetch';

import { Login } from '@whnet/ui';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: createHttpLink({
    fetch,
    // eslint-disable-next-line @typescript-eslint/dot-notation
    uri: process.env['NX_GRAPHQL_ENDPOINT_URI'],
  }),
});

const App = () => (
  <ApolloProvider client={client}>
    <h1>Whnet</h1>
    <Login />
  </ApolloProvider>
);

export default App;
