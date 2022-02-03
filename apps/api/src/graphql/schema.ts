import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { join } from 'path';

import {
  ChatRelationsResolver,
  FindFirstChatResolver,
  FindFirstMessageResolver,
  FindFirstUserResolver,
  FindManyChatResolver,
  FindManyMessageResolver,
  FindManyUserResolver,
  FindUniqueChatResolver,
  FindUniqueMessageResolver,
  FindUniqueUserResolver,
  CreateChatResolver,
  MessageRelationsResolver,
  UserRelationsResolver,
} from '../generated/type-graphql';
import {
  AuthResolver,
  MessageResolver,
  SubscriptionsResolver,
} from './resolvers';

export const schema = buildSchema({
  resolvers: [
    FindUniqueChatResolver,
    FindFirstChatResolver,
    FindManyChatResolver,
    FindFirstUserResolver,
    FindManyUserResolver,
    FindUniqueUserResolver,
    FindFirstMessageResolver,
    FindUniqueMessageResolver,
    FindManyMessageResolver,
    UserRelationsResolver,
    ChatRelationsResolver,
    CreateChatResolver,
    MessageRelationsResolver,
    AuthResolver,
    MessageResolver,
    SubscriptionsResolver,
  ],
  validate: true,
  emitSchemaFile: {
    path: join(__dirname, '../generated/schema.graphql'),
    commentDescriptions: true,
    sortedSchema: false,
  },
});

export default schema;
