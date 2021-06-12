import { PrismaClient } from '@prisma/client';
import {
  signUpService,
  signInService,
  protectService,
} from '../services/auth.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { server } from '../app';
import { SigninUserDto } from '../dtos/signin-user.dto';
import { newToken, verifyToken } from '../helpers/auth_validators';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

let userId: number;
let token: string;

describe('SignUp → Create new user', () => {
  const user = new CreateUserDto();
  user.username = 'test98';
  user.email = 'test@test.com';
  user.password = 'password';

  test('create new user', async () => {
    const result = await signUpService(user);
    expect(result).toHaveProperty('id');
    expect(result.username).toBe('test98');
    expect(result.email).toBe('test@test.com');
  });

  test('email must be unique', async () => {
    await expect(signUpService(user)).rejects.toThrow(
      'This email is already registered',
    );
  });

  test('fields must be required', async () => {
    user.username = '';
    user.email = '';
    user.password = '';
    await expect(signUpService(user)).rejects.toThrow('BadRequestError');
  });
});

describe('SignIn → Login user', () => {
  const user = new SigninUserDto();
  user.email = 'test@test.com';
  user.password = 'password';

  test('login success', async () => {
    user.email = 'test@test.com';
    user.password = 'password';
    const result = await signInService(user);
    userId = result.id;
    expect(result).toHaveProperty('id');
    expect(result.username).toBe('test98');
    expect(result.email).toBe('test@test.com');
  });

  test('fields must be required', async () => {
    user.email = '';
    await expect(signInService(user)).rejects.toThrow('BadRequestError');
  });

  test('not found user', async () => {
    user.email = 'test123@test.com';
    user.password = 'password';
    await expect(signInService(user)).rejects.toThrow('Not found user');
  });

  test('password is invalid', async () => {
    user.email = 'test@test.com';
    user.password = 'password123';
    await expect(signInService(user)).rejects.toThrow('Invalid password');
  });
});

describe('Authorization JWT', () => {
  test('create new jwt', () => {
    const id = 123;
    token = newToken(id);
    const validToken = jwt.verify(token, process.env.TOKEN_SECRET);

    expect(validToken['id']).toBe(123);
  });

  test('verify token', async () => {
    const id = 1234;
    token = jwt.sign({ id }, process.env.TOKEN_SECRET);
    const validToken = await verifyToken(token);

    expect(validToken.id).toBe(id);
  });
});

describe('Midleware protect routes → Verified authorization', () => {
  let authorization = '';

  test('authorization must be required', async () => {
    await expect(protectService(authorization)).rejects.toThrow(
      'Login credentials are required to access',
    );
  });

  test('the user is not found by send id token', async () => {
    authorization = `Bearer ${token}`;

    await expect(protectService(authorization)).rejects.toThrow(
      'Not found user',
    );
  });

  test('return user data', async () => {
    token = newToken(userId);
    authorization = `Bearer ${token}`;

    const result = await protectService(authorization);
    expect(result.id).toBe(userId);
    expect(result.username).toBe('test98');
    expect(result.email).toBe('test@test.com');
  });
});

afterAll(async () => {
  await prisma.user.deleteMany();
  await prisma.$disconnect();
  server.close();
});
