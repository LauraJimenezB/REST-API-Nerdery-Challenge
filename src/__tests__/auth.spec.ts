import { PrismaClient, User } from '@prisma/client';
import { signUpService } from '../services/auth.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { server } from '../app';
import createError from 'http-errors';

const prisma = new PrismaClient();

// beforeEach( async () => {
//   await prisma.user.deleteMany();
// });
// const user = new CreateUserDto(
//   username: 'diana98',
//   email: 'diana@test.com',
//   password: 'password',
// )

describe('SignUp → Create new user', () => {
  test('create new user', async () => {
    const user = new CreateUserDto();
    user.username = 'diana98';
    user.email = 'diana@test.com';
    user.password = 'password';
    const result = await signUpService(user);
    expect(result).toHaveProperty('id');
    expect(result.username).toBe('diana98');
    expect(result.email).toBe('diana@test.com');
  });

  test('email must be unique', async () => {
    const user = new CreateUserDto();
    user.email = 'diana@test.com';
    user.password = 'password';

    try {
      await signUpService(user);
    } catch (e) {
      expect(e.message).toMatch('BadRequestError');
    }
  });

  test('email must be required', async () => {
    const user = new CreateUserDto();
    user.password = 'password';

    try {
      await signUpService(user);
    } catch (e) {
      expect(e.message).toMatch('BadRequestError');
    }
  });
});

afterAll(async () => {
  await prisma.user.deleteMany();
  await prisma.$disconnect();
  server.close();
});
