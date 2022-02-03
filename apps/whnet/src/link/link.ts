import { createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import fetch from 'cross-fetch';

import { getBearerToken } from '@whnet/helpers';

const httpLink = createHttpLink({
  fetch,
  uri: process.env['NX_GRAPHQL_ENDPOINT_URI'],
});

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:3333/graphql',
  options: {
    reconnect: true,
    connectionParams: {
      authorization: getBearerToken(),
    },
  },
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: getBearerToken(),
    },
  };
});

const links = authLink.concat(httpLink);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  links
);

export default splitLink;
