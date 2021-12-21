/** This script creates some demo entries in the database
 * run: yarn demo-db
 */

import { PrismaClient } from '../src';

const prisma = new PrismaClient();

const nickNames = ['Johndoe', 'Whekin', 'Ilonspacex'];

const createUser = async (nickname: string) =>
  prisma.user.create({
    data: {
      nickname,
    },
  });

(async () => {
  await Promise.all(nickNames.map((nickname) => createUser(nickname)));

  const users = await prisma.user.findMany();

  // eslint-disable-next-line no-console
  console.dir(users, { depth: null });
})();
