/** This script seeds the database by some data
 * WARN: the script RESETS the database!
 * run: yarn seed
 */

import { hash } from 'argon2';

import { PrismaClient } from '../src';

const cleanDatabase = async (prisma: PrismaClient) => {
  await prisma.message.deleteMany();
  await prisma.chat.deleteMany();
  await prisma.user.deleteMany();
};

const prisma = new PrismaClient();

const userCredentials = [
  { nickname: 'johndoe', password: 'c#Qb$k2U' },
  { nickname: 'whekin', password: '#6^n!HdN' },
  { nickname: 'dan', password: '4xV@X*r2' },
];

const johndoe = userCredentials[0];
const whekin = userCredentials[1];
const dan = userCredentials[2];

const createUser = async ({ nickname, password }) =>
  prisma.user.create({
    data: {
      nickname,
      password: await hash(password),
    },
  });

(async () => {
  await cleanDatabase(prisma);

  await Promise.all(userCredentials.map((args) => createUser(args)));

  await prisma.chat.create({
    data: {
      users: {
        connect: [
          { nickname: johndoe.nickname },
          { nickname: whekin.nickname },
        ],
      },
      messages: {
        create: [
          {
            sentBy: { connect: { nickname: johndoe.nickname } },
            content: 'Hey',
            createdAt: '2022-01-04T16:08:36.332Z',
          },
          {
            sentBy: { connect: { nickname: whekin.nickname } },
            content: 'What is up?',
            createdAt: '2022-01-04T17:00:36.332Z',
          },
          {
            sentBy: { connect: { nickname: johndoe.nickname } },
            content: `I'm fine, thanks! How about you?`,
            createdAt: '2022-01-04T18:08:36.332Z',
          },
        ],
      },
    },
  });

  await prisma.chat.create({
    data: {
      users: {
        connect: [{ nickname: whekin.nickname }, { nickname: dan.nickname }],
      },
      messages: {
        create: [
          {
            sentBy: { connect: { nickname: whekin.nickname } },
            content: 'Hello! I enjoy what you do!',
            createdAt: '2022-01-04T16:08:36.332Z',
          },
          {
            sentBy: { connect: { nickname: dan.nickname } },
            content: `Hey! That's nice to hear!`,
            createdAt: '2022-01-04T16:09:36.332Z',
          },
          {
            sentBy: { connect: { nickname: whekin.nickname } },
            content: `Thank you! If you need help write me here!`,
            createdAt: '2022-01-04T16:10:36.332Z',
          },
          {
            sentBy: { connect: { nickname: whekin.nickname } },
            content: `Alright! See ya!`,
            createdAt: '2022-01-04T16:10:59.332Z',
          },
        ],
      },
    },
  });

  const users = await prisma.user.findMany({
    include: {
      chats: {
        include: {
          messages: true,
        },
      },
    },
  });

  // eslint-disable-next-line no-console
  console.dir(users, { depth: null });
})();
