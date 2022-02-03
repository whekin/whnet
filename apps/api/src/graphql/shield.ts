import { IRules, shield, rule, not, and, allow } from 'graphql-shield';
import { ForbiddenError } from 'apollo-server-errors';

import type { Context } from './context';

const isAuthenticated = rule({ cache: 'contextual' })(
  async (parent, args, ctx: Context) => {
    return !!ctx.user;
  }
);

const isUserOwner = rule({ cache: 'strict' })(
  async (parent, args, ctx: Context) => {
    return ctx.user.nickname === parent.nickname;
  }
);

const canAccessMessage = rule({ cache: 'strict' })(
  async (parent, args, ctx: Context) => {
    const messageInCommonChat = !!(await ctx.prisma.chat.count({
      where: {
        id: parent.chatId,
        users: {
          some: {
            nickname: { equals: ctx.user.nickname },
          },
        },
      },
    }));

    return messageInCommonChat;
  }
);

const isChatOwner = rule({ cache: 'strict' })(
  async (parent, args, ctx: Context) => {
    const isParticipant = !!(await ctx.prisma.chat.count({
      where: {
        id: parent.id,
        users: { some: { nickname: { equals: ctx.user.nickname } } },
      },
    }));

    return isParticipant;
  }
);

const canCreateChat = rule({ cache: 'strict' })(
  async (parent, args, ctx: Context) => {
    const {
      user: { nickname },
    } = ctx;

    const {
      data: {
        users: {
          connect: [{ nickname: participant1 }, { nickname: participant2 }],
        },
      },
    } = args;

    if (!participant1 || !participant2)
      return new ForbiddenError(
        'Wrong args format. You must provide two connected users'
      );

    const userOwnesChat = [participant1, participant2].includes(nickname);
    if (!userOwnesChat)
      return new ForbiddenError('Trying to create new chat for other users');

    const alreadyExist = !!(await ctx.prisma.chat.count({
      where: {
        AND: [
          { users: { some: { nickname: { equals: participant1 } } } },
          { users: { some: { nickname: { equals: participant2 } } } },
        ],
      },
    }));

    if (alreadyExist) return new ForbiddenError('Cannot create existing chat!');

    return true;
  }
);

const map: IRules = {
  Query: {
    '*': isAuthenticated,
    findFirstUser: allow,
  },
  Mutation: {
    '*': isAuthenticated,
    loginOrSignUp: not(isAuthenticated),
    createChat: and(isAuthenticated, canCreateChat),
  },
  User: {
    nickname: allow,
    id: isUserOwner,
    createdAt: isUserOwner,
    updatedAt: isUserOwner,
  },
  Message: canAccessMessage,
  Chat: isChatOwner,
};

export const permissions = shield(map, { allowExternalErrors: true });

export default permissions;
