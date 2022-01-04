import { ApolloError } from 'apollo-server-errors';
import { IRules, shield, rule, not, allow } from 'graphql-shield';

import type { Context } from './context';

const isAuthenticated = rule()(async (parent, args, ctx: Context) => {
  return !!ctx.user;
});

const isMessageOwner = rule()(async (parent, args, ctx: Context) => {
  return ctx.user.nickname === parent.userNickname;
});

const isChatOwner = rule()(async (parent, args, ctx: Context) => {
  const isParticipant = !!(await ctx.prisma.chat.count({
    where: {
      id: parent.id,
      users: { some: { nickname: { equals: ctx.user.nickname } } },
    },
  }));

  return isParticipant;
});

const map: IRules = {
  Query: {
    '*': isAuthenticated,
  },
  Mutation: {
    '*': isAuthenticated,
    login: allow,
    signUp: not(isAuthenticated),
  },
  Message: isMessageOwner,
  Chat: isChatOwner,
};

const permissions = shield(map, {
  fallbackError: async (thrownThing) => {
    if (thrownThing instanceof ApolloError) {
      return thrownThing;
    }

    // eslint-disable-next-line no-console
    console.error(thrownThing);

    return new ApolloError('Internal server error', 'ERR_INTERNAL_SERVER');
  },
});

export default permissions;
