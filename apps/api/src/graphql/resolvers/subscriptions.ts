import { Subscription, Root, Arg } from 'type-graphql';

import { Message } from '../../generated/type-graphql';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MessagePayload extends Message {}

export class SubscriptionsResolver {
  @Subscription({
    topics: 'MESSAGES',
    filter: ({ payload, args }) => payload.chatId === args.chatId,
  })
  newMessage(
    @Root() notificationPayload: MessagePayload,
    @Arg('chatId') chatId: string
  ): Message {
    return {
      ...notificationPayload,
    };
  }
}

export default SubscriptionsResolver;
