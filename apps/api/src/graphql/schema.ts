import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { join } from 'path';
import { resolvers } from '../generated/type-graphql/index';

const schema = buildSchema({
  resolvers,
  validate: false,
  emitSchemaFile: {
    path: join(__dirname, '../generated/schema.graphql'),
    commentDescriptions: true,
    sortedSchema: false,
  },
});

export default schema;
