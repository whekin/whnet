/* eslint-disable default-param-last */
/* eslint-disable @typescript-eslint/default-param-last */
import { InMemoryCache } from '@apollo/client';
import { DateTime } from 'luxon';

const apolloCache = new InMemoryCache({
  typePolicies: {
    Message: {
      keyFields: ['userNickname', 'chatId', 'createdAt'],
    },
    Chat: {
      fields: {
        messages: {
          keyArgs: false,
          merge(existing = [], incoming, { readField }) {
            if (!existing.length) return incoming;

            const getCreatedAtDateTime = (from: any) =>
              DateTime.fromISO(readField<string>('createdAt', from)!);

            const existingFirst = getCreatedAtDateTime(existing[0]);

            const incomingFirst = getCreatedAtDateTime(incoming[0]);

            if (incomingFirst > existingFirst) {
              return [...incoming, ...existing];
            }

            if (incomingFirst.equals(existingFirst)) {
              return [...existing];
            }

            return [...existing, ...incoming];
          },
        },
        loadedAll: {
          read(_, { variables, readField, toReference }) {
            const id = variables?.['id'];
            if (!id) return false;

            const ref = toReference({ __typename: 'Chat', id });
            if (!ref) return false;

            const totalMessages =
              readField<
                { messages: number; __typename: 'ChatCount' } | undefined
              >('_count', ref)?.messages || 0;

            const fetchedMessagesAmount =
              readField<any[]>('messages', ref)?.length || 0;

            return fetchedMessagesAmount >= totalMessages;
          },
        },
      },
    },
  },
});

export default apolloCache;
