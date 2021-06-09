import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { app } from '../server';
import { newToken, verifyToken, IPayload } from '../helpers/handlerPasswordAndToken';
import jwt from 'jsonwebtoken';

//const prisma = new PrismaClient();

// beforeEach( async () => {
//   await prisma.user.deleteMany();
// });

describe('Creation JWT and Authentication: ', () => {
  describe('newToken', () => {
    test('creates new jwt from user', () => {
      const userModel = { id: 123, username: 'test', email: 'test@test.com' };
      const token = newToken(userModel);
      const user = jwt.verify(
        token,
        process.env.TOKEN_SECRET || 'secret',
      ) as IPayload;

      expect(user.id).toEqual(userModel.id);
    });
  });

  describe('verifyToken', () => {
    test('validates jwt and returns payload', async () => {
      const id = 1234;
      const token = jwt.sign({ id }, process.env.TOKEN_SECRET || 'secret');
      const user = await verifyToken(token);

      expect(user.id).toEqual(id);
    });
  });

  describe('signup', () => {
    test('requires email and password', async () => {
      const response = await request(app).post('/signup');
      expect(response.status).toBe(400);
      expect(response.body).toBe('Email and password required');
    });
  });

  test.skip('creates user and and sends new token from user', async () => {
    const response = await request(app)
      .post('/signup')
      .send({ username: 'test', email: 'test@test.com', password: 'password' });

    expect(response.status).toBe(200);
  });

  test(`can't creates user without username field`, async () => {
    const response = await request(app)
      .post('/signup')
      .send({ email: 'john@test.com', password: 'password' });

    expect(response.status).toBe(400);
  });

  test('signup with the email already exists', async () => {
    const response = await request(app)
      .post('/signup')
      .send({ username: 'test', email: 'test@test.com', password: 'password' });

    expect(response.status).toBe(400);
    expect(response.body).toBe('The email already exists');
  });
});

describe('signin', () => {
  test(`login with email and password and return a new token`, async () => {
    const response = await request(app)
      .post('/signin')
      .send({ email: 'test@test.com', password: 'password' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
  });

  test(`not sending email and password`, async () => {
    const response = await request(app).post('/signin').send();

    expect(response.status).toBe(400);
    expect(response.body).toBe('Email and password required');
  });

  test(`invalid password`, async () => {
    const response = await request(app)
      .post('/signin')
      .send({ email: 'test@test.com', password: 'password123' });

    expect(response.status).toBe(400);
    expect(response.body).toBe('Invalid password');
  });
});
