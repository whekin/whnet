import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { join } from 'path';

import { resolvers } from '../generated/type-graphql';
import AuthResolver from './authResolver';

const schema = buildSchema({
  resolvers: [...resolvers, AuthResolver],
  validate: true,
  emitSchemaFile: {
    path: join(__dirname, '../generated/schema.graphql'),
    commentDescriptions: true,
    sortedSchema: false,
  },
});

export default schema;