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
  MessageRelationsResolver,
  UserRelationsResolver,
} from '../generated/type-graphql';
import AuthResolver from './resolvers/auth';
import MessageResolver from './resolvers/message';

const schema = buildSchema({
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
    MessageRelationsResolver,
    AuthResolver,
    MessageResolver,
  ],
  validate: true,
  emitSchemaFile: {
    path: join(__dirname, '../generated/schema.graphql'),
    commentDescriptions: true,
    sortedSchema: false,
  },
});

export default schema;
