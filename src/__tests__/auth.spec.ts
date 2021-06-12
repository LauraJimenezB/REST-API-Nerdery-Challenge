import { PrismaClient, TokenType, User } from '@prisma/client';
import {
  signUpService,
  signInService,
  protectService,
  confirmEmailService,
} from '../services/auth.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { server } from '../app';
import { SigninUserDto } from '../dtos/signin-user.dto';
import {
  newToken,
  verifyToken,
  encryptPassword,
} from '../helpers/auth_validators';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

let token: string;
let userCreated: User;

beforeAll(async () => {
  const userExample = await prisma.user.create({
    data: {
      username: 'test98',
      email: 'test@test.com',
      password: 'password',
    },
  });
  userCreated = userExample;
});

describe('SignUp → Create new user', () => {
  const user = new CreateUserDto();
  test('email must be unique', async () => {
    user.username = 'test98';
    user.email = 'test@test.com';
    user.password = 'password';
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
  test.skip('login success', async () => {
    user.email = 'test@test.com';
    user.password = 'password';
    const result = await signInService(user);

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
      'Invalid credentials: signin to account',
    );
  });

  test.skip('return user data', async () => {
    token = newToken(userCreated.id);
    authorization = `Bearer ${token}`;

    const result = await protectService(authorization);
    console.log('result', result);
    
    expect(result.id).toBe(userCreated.id);
    expect(result.username).toBe('test98');
    expect(result.email).toBe('test@test.com');
  });
});

afterAll(async () => {
  await prisma.user.deleteMany();
  await prisma.$disconnect();
  server.close();
});
