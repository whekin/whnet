import { makeSchema } from 'nexus';
import * as path from 'path';

import userTypes from './user';

const schema = makeSchema({
  outputs: {
    schema: path.join(__dirname, '../generated/schema.graphql'),
  },
  types: [userTypes],
});

export default schema;
