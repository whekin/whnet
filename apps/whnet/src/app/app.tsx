import React from 'react';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import fetch from 'cross-fetch';

import { Login } from '@whnet/ui';
import Box from '@mui/material/Box';

const httpLink = createHttpLink({
  fetch,
  uri: process.env['NX_GRAPHQL_ENDPOINT_URI'],
});

const authLink = setContext((_, { headers }) => {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuaWNrbmFtZSI6IndoZWtpbiIsImlhdCI6MTY0MTMyNDEzNCwiZXhwIjoxNjQxNTgzMzM0fQ._eZH7NSBsosjG7oF6Gx2kWKOAyJSC1unkBARRN0gyoU';
  // localStorage.getItem('token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

const App = () => (
  <ApolloProvider client={client}>
    <h1>Whnet</h1>
    <Box sx={{ width: 300 }}>
      <Login />
    </Box>
  </ApolloProvider>
);

export default App;
