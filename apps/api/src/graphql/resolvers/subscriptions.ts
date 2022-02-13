import { Subscription, Root, Arg } from 'type-graphql';

import { Context } from '../context';

import { Message } from '../../generated/type-graphql';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MessagePayload extends Message {}

export class SubscriptionsResolver {
  @Subscription({
    topics: 'MESSAGES',
    filter: async ({
      payload,
      context: {
        user: { nickname },
        prisma,
      },
    }) => {
      const userIsParticipant = !!(await (
        prisma as Context['prisma']
      ).user.count({
        where: {
          AND: [
            { nickname: { equals: nickname } },
            { chats: { some: { id: { equals: payload.chatId } } } },
          ],
        },
      }));

      return userIsParticipant;
    },
  })
  newMessage(@Root() notificationPayload: MessagePayload): Message {
    return {
      ...notificationPayload,
    };
  }
}

export default SubscriptionsResolver;
