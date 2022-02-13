import {
  ChatsFragFragment,
  ChatsFragFragmentDoc,
  useNewMessageSubscription,
} from '@whnet/data-access';

// eslint-disable-next-line import/prefer-default-export
export const useNewMessageSubscriptionUpdateCache = () => {
  const state = useNewMessageSubscription({
    shouldResubscribe: true,
    onSubscriptionData({ client, subscriptionData }) {
      const { data } = subscriptionData;

      if (!data) return;

      const { newMessage } = data;

      const cacheId = `Chat:${newMessage.chatId}`;

      const prev = client.readFragment({
        id: cacheId,
        fragment: ChatsFragFragmentDoc,
      }) as ChatsFragFragment;

      client.writeFragment({
        id: cacheId,
        fragment: ChatsFragFragmentDoc,
        data: {
          ...prev,
          messages: [newMessage],
        },
      });
    },
  });

  return state;
};
