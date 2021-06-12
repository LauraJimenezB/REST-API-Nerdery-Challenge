import { PrismaClient, User } from '@prisma/client';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserDto } from '../dtos/user.dto';
import { plainToClass } from 'class-transformer';
import { CustomError } from '../helpers/handlerError';
import createError from 'http-errors';

const prisma = new PrismaClient();

export async function getAllUsersService(): Promise<User[]> {
  const users = await prisma.user.findMany();
  return Promise.resolve(users);
}

export async function getSingleUserService(userId: string): Promise<User> {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
  });
  if (!user) throw createError(404, 'Not found user');
  return Promise.resolve(user);
}

export async function deleteSingleUserService(
  userId: string,
): Promise<UserDto> {
  try {
    const user = await prisma.user.delete({
      where: {
        id: Number(userId),
      },
    });
    return plainToClass(UserDto, user);
  } catch (e) {
    throw new CustomError(e.message, 422);
  }
}

export async function updateProfileUserService(
  idToken: string,
  userId: string,
  params: UpdateUserDto,
): Promise<User> {
  console.log('userId', userId);
  if (!userId || userId === undefined)
    throw createError(404, 'Not found user');
  await params.isValid();

  const auhorProfile = await getSingleUserService(idToken);

  if (auhorProfile.id !== Number(userId))
    throw createError(
      403,
      "You don't have permission to update this profile",
    );

  const updateUser = await prisma.user.update({
    where: {
      id: Number(userId),
    },
    data: params,
  });

  return Promise.resolve(updateUser);
}
