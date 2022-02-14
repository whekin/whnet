/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApolloError } from 'apollo-server-errors';
import {
  Mutation,
  Resolver,
  Ctx,
  Arg,
  InputType,
  Field,
  PubSub,
  PubSubEngine,
} from 'type-graphql';
import { Message } from '../../generated/type-graphql';
import type { Context } from '../context';

@InputType()
export class SendMessageInput {
  @Field((type) => String)
  chatId: string;

  @Field((type) => String)
  content: string;
}

@Resolver()
export class MessageResolver {
  @Mutation((type) => Message)
  async sendMessage(
    @Arg('data') data: SendMessageInput,
    @Ctx() ctx: Context,
    @PubSub() pubSub: PubSubEngine
  ) {
    const { nickname: currentNickname } = ctx.user;
    const { chatId, content } = data;

    const chatExist = !!(await ctx.prisma.chat.count({
      where: { id: { equals: chatId } },
    }));

    if (chatExist) {
      const message = await ctx.prisma.message.create({
        data: {
          content,
          userNickname: currentNickname,
          chatId,
        },
      });

      await pubSub.publish('MESSAGES', message);

      await ctx.prisma.chat.update({
        where: { id: chatId },
        data: {
          updatedAt: new Date(),
        },
      });

      return message;
    }

    throw new ApolloError('Cannot send message to unexisting chat!');
  }
}

export default MessageResolver;
