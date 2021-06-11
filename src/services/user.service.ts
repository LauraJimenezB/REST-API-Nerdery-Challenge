import { PrismaClient, User } from '@prisma/client';
import { UpdateUserDto } from '../dtos/update-user.dto';

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

export async function updateProfileUserService(
  userId: string,
  params: UpdateUserDto,
): Promise<User> {
  await params.isValid();
  console.log('params', params)
  const updateUser = await prisma.user.update({
    where: {
      id: Number(userId),
    },
    data: params,
  });
  return Promise.resolve(updateUser);
}
