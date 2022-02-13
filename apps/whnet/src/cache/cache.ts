import { InMemoryCache } from '@apollo/client';

const cache = new InMemoryCache({
  typePolicies: {
    Message: {
      keyFields: ['userNickname', 'chatId', 'createdAt'],
    },
    Query: {
      fields: {
        messages: {
          // Within messages we use pagination (take, skip). We don't want to
          // group messages by the size of block of a request.
          keyArgs: false,
        },
      },
    },
  },
});

export default cache;
