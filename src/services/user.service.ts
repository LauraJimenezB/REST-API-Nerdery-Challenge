import { PrismaClient, User } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { UserDto } from '../dtos/userDto';
import { CustomError } from '../helpers/handlerError';
import { encryptPassword } from '../helpers/handlerPasswordAndToken';

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

export async function createSingleUserService(body: User): Promise<UserDto> {
  const encryptedPass = await encryptPassword(body.password);
  try {
    const user = await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        password: encryptedPass,
      },
    });
    return plainToClass(UserDto, user);
  } catch(e) {
    throw new CustomError(e.message, 422);
  }
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

export async function updateSingleUserService(userId: string, body: User): Promise<UserDto> {
  try {
    const user = await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        emailIsPublic: body.emailIsPublic == true,
        fullnameIsPublic: body.fullnameIsPublic == true,
        fullname: body.fullname,
        bio: body.bio,
      },
    });
    return plainToClass(UserDto, user)
  } catch(e){
    throw new CustomError(e.message, 422);
  }
}
