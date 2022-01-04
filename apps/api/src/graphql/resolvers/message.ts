/* eslint-disable @typescript-eslint/no-unused-vars */
import { Mutation, Resolver, Ctx, Arg, InputType, Field } from 'type-graphql';
import { Message } from '../../generated/type-graphql';
import type { Context } from '../context';

@InputType()
export class SendMessageInput {
  @Field((type) => String)
  userNickname: string;

  @Field((type) => String)
  content: string;
}

@Resolver()
class MessageResolver {
  @Mutation((type) => Message)
  async sendMessage(@Arg('data') data: SendMessageInput, @Ctx() ctx: Context) {
    const { nickname: currentNickname } = ctx.user;
    const { userNickname, content } = data;

    let chat = await ctx.prisma.chat.findFirst({
      where: {
        users: {
          every: {
            OR: [
              {
                nickname: {
                  equals: userNickname,
                },
              },
              {
                nickname: {
                  equals: currentNickname,
                },
              },
            ],
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!chat) {
      chat = await ctx.prisma.chat.create({
        data: {
          users: {
            connect: [
              {
                nickname: userNickname,
              },
              {
                nickname: currentNickname,
              },
            ],
          },
        },
        select: {
          id: true,
        },
      });
    }

    const message = await ctx.prisma.message.create({
      data: {
        content,
        chatId: chat.id,
        userNickname: currentNickname,
      },
    });

    return message;
  }
}

export default MessageResolver;
