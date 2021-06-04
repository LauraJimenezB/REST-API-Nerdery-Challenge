import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const token = jwt.sign({ foo: 'bar' }, 'shhhh');

interface User {
  id: number;
  username: string;
  email: string;
}

export const newToken = (user: User): string => {
  return jwt.sign({ id: user.id }, 'secret', {
    expiresIn: '100d',
  });
};

export const verifyToken = async (token: string) => {
  await jwt.verify(token, 'secret', (err, payload) => {
    if (err) return err;
    return payload;
  });
};

// console.log(
//   newToken({
//     id: 1,
//     username: 'Diana98',
//     email: 'prueba@test.com',
//   }),
// );

verifyToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjIyNzYzODA1LCJleHAiOjE2MzE0MDM4MDV9.DYR1je203pvPd39uWtWFWvzfMqc2j5oYHDax5442G38')
.then( data => console.log(data))
