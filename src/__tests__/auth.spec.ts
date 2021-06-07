import request from 'supertest';
import { app } from '../server';
import {
  newToken,
  verifyToken,
  signin,
  signup,
  protect,
  IPayload,
} from '../helpers/auth';
import jwt from 'jsonwebtoken';

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

  test.only('creates user and and sends new token from user', async () => {
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
});
