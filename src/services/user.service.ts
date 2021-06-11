import { PrismaClient, User } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { UserDto } from '../dtos/user.dto';
import { CustomError } from '../helpers/handlerError';

const prisma = new PrismaClient();

export async function getAllUsersService(): Promise<UserDto[]> {
  try {
    const users = await prisma.user.findMany();
    return plainToClass(UserDto, users);
  } catch (e) {
    throw new CustomError(e.message, 422);
  }
}

export async function getSingleUserService(userId: string): Promise<UserDto> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });
    return plainToClass(UserDto, user);
  } catch (e) {
    throw new CustomError(e.message, 422);
  }
}

