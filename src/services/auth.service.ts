import { PrismaClient, User } from '@prisma/client';
import { CustomError } from '../helpers/handlerError';
import {
  newToken,
  validatePassword,
  verifyToken,
  encryptPassword,
} from '../helpers/handlerPasswordAndToken';
import { plainToClass } from 'class-transformer';
import { getSingleUserService } from './user.service';
import { UserDto } from '../dtos/user.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { SigninUserDto } from '../dtos/signin-user.dto';

const prisma = new PrismaClient();

export async function signUpService(body: CreateUserDto): Promise<UserDto> {
  await body.isValid();
  const encryptedPass = await encryptPassword(body.password);
  const user = await prisma.user.create({
    data: {
      username: body.username,
      email: body.email,
      password: encryptedPass,
    },
  });
  const token = newToken(user);
  const newUser = { ...user, token };
  return Promise.resolve(newUser);
}

export async function signInService(body: SigninUserDto): Promise<UserDto> {
  await body.isValid();

  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if(!user ) throw new CustomError('Not found user', 404);

  const isPasswordMatching = await validatePassword(
    body.password,
    user.password,
  );

  if (!isPasswordMatching) throw new CustomError('Invalid password', 400);
  
  const token = newToken(user);
  const newUser = { ...user, token };
  return Promise.resolve(newUser);
 
}

export async function protectService(
  authorization: string | undefined,
): Promise<UserDto> {
  //console.log('auth', authorization)
  if (!authorization && authorization === undefined) {
    throw new CustomError('No authorization', 401);
  }

  const token = authorization.split('Bearer')[1];

  if (!token) {
    throw new CustomError('No authorization', 401);
  }

  try {
    const payload = await verifyToken(token);
    const user = await getSingleUserService(payload.id);
    return plainToClass(UserDto, user);
    //req.body.user = user;
  } catch (e) {
    throw new CustomError(e.message, 422);
  }
}
