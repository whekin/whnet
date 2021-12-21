import { User } from 'nexus-prisma';
import {
  list, nonNull, objectType, queryField,
} from 'nexus';

import type Context from './context';

const userTypes = [
  objectType({
    name: User.$name,
    definition(t) {
      t.field(User.id);
      t.field(User.nickname);
    },
  }),
  queryField((t) => {
    t.field('users', {
      type: nonNull(list(nonNull(User.$name))),
      resolve(source, args, context: Context) {
        return context.prisma.user.findMany();
      },
    });
  }),
];

export default userTypes;
