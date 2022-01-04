/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Arg,
  InputType,
  Field,
  Mutation,
  Resolver,
  Ctx,
  ObjectType,
} from 'type-graphql';
import { Length, Matches } from 'class-validator';
import { sign } from 'jsonwebtoken';
import { hash, verify } from 'argon2';
import { AuthenticationError } from 'apollo-server-errors';

import type { Context } from './context';
import { User } from '../generated/type-graphql';

const MIN_NICKNAME_LENGTH = 3;
const MIN_PASSWORD_LENGTH = 8;
const MAX_NICKNAME_LENGTH = 20;
const MAX_PASSWORD_LENGTH = 50;

const nicknameReg = /^[a-z_]+$/;

const passwordLengthOutOfRangeMessage = `Password must be at least ${MIN_PASSWORD_LENGTH} symbols long, but less than ${MAX_PASSWORD_LENGTH} symbols`;
const nicknameLengthOutOfRangeMessage = `Nickname should contain at least ${MIN_NICKNAME_LENGTH} symbol and less than ${MAX_NICKNAME_LENGTH} symbols`;

const nicknameDontMatchPatternMessage = `Nickname must consist of lowercase latin symbols and underscores`;

const wrongDataProvidedMessage = 'Incorrect nickname or password!';

const getToken = (nickname: string): string =>
  sign(
    {
      nickname,
    },
    process.env.JWT_SECRET,
    {
      algorithm: 'HS256',
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

@InputType()
class UserBaseCredentials implements Partial<User> {
  @Field((type) => String)
  @Length(MIN_NICKNAME_LENGTH, MAX_NICKNAME_LENGTH, {
    message: nicknameLengthOutOfRangeMessage,
  })
  @Matches(nicknameReg, {
    message: nicknameDontMatchPatternMessage,
  })
  nickname: string;

  @Field((type) => String)
  @Length(MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, {
    message: passwordLengthOutOfRangeMessage,
  })
  password: string;
}

@InputType()
class SignUpInput extends UserBaseCredentials {}

@InputType()
class LoginInput extends UserBaseCredentials {}

@ObjectType('SignUpOutput', {
  isAbstract: true,
})
class SignUpOutput extends User {
  @Field((type) => String)
  token: string;
}

@Resolver()
class AuthResolver {
  @Mutation((returns) => String)
  async login(
    @Arg('data') { nickname, password }: LoginInput,
    @Ctx() ctx: Context
  ) {
    const user = await ctx.prisma.user.findUnique({
      where: { nickname },
      select: {
        password: true,
      },
    });

    if (!user) {
      throw new AuthenticationError(wrongDataProvidedMessage);
    }

    const passwordMatch = await verify(user.password, password);

    if (!passwordMatch) {
      throw new AuthenticationError(wrongDataProvidedMessage);
    }

    return getToken(nickname);
  }

  @Mutation((returns) => SignUpOutput)
  async signUp(
    @Arg('data') { nickname, password }: SignUpInput,
    @Ctx() ctx: Context
  ) {
    const userExists = await ctx.prisma.user.count({ where: { nickname } });

    if (userExists) {
      throw new AuthenticationError(wrongDataProvidedMessage);
    }

    const hashedPassword = await hash(password);

    const user = await ctx.prisma.user.create({
      data: {
        nickname,
        password: hashedPassword,
      },
    });

    const token = getToken(nickname);

    return {
      ...user,
      token,
    };
  }
}

export default AuthResolver;
