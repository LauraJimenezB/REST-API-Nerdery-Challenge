import { PrismaClient, User } from '@prisma/client';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserDto } from '../dtos/user.dto';
import { plainToClass } from 'class-transformer';
import { CustomError } from '../helpers/handlerError';

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
  userId: string,
  params: UpdateUserDto,
): Promise<User> {
  await params.isValid();
  //console.log('params', params)
  const updateUser = await prisma.user.update({
    where: {
      id: Number(userId),
    },
    data: params,
  });
  return Promise.resolve(updateUser);
}
