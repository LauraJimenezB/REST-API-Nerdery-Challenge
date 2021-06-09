import { User } from '@prisma/client';
import { CustomError } from '../helpers/handlerError';
import {
  newToken,
  validatePassword,
  verifyToken,
} from '../helpers/handlerPasswordAndToken';
import { plainToClass } from 'class-transformer';
import {
  createSingleUserService,
  getUserForEmailService,
  getSingleUserService,
} from './user.service';
import { UserDto } from '../dtos/userDto';

export async function signUpService(body: User): Promise<UserDto> {
  if (!body.email || !body.password) {
    throw new CustomError('Email and password required', 400);
  }

  try {
    const user = await createSingleUserService(body);
    const token = newToken(user);
    return plainToClass(UserDto, token);
  } catch (e) {
    throw new CustomError(e.message, 422);
  }
}

export async function signInService(body: User): Promise<UserDto> {
  if (!body.email || !body.password) {
    throw new CustomError('Email and password required', 400);
  }

  try {
    const user = await getUserForEmailService(body.email);
    const isPasswordMatching = await validatePassword(
      body.password,
      user.password,
    );

    if (isPasswordMatching) {
      const token = newToken(user);
      return plainToClass(UserDto, token);
    } else {
      throw new CustomError('Invalid password', 400);
    }
  } catch (e) {
    throw new CustomError(e.message, 422);
  }
}

export async function protectService(
  authorization: string | undefined
): Promise<UserDto> {
  console.log('auth', authorization)
  if (!authorization) {
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
