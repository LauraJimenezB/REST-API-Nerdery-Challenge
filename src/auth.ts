import { PrismaClient } from '@prisma/client';
import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { app } from './server';

const prisma = new PrismaClient();

app.use(express.json());

interface User {
  id: number;
  username: string;
  email: string;
}

app.post('/signin', (req, res) => {
  const { username, email } = req.body;
  const user = { username, email };
 
});

// jwt.sign({ user: user }, 'secret', { expiresIn: '1d' }, (err: any, token: any) => {
//   res.json({
//     token,
//   });
// });

// Authorization: Bearer <token>
// const verifyToken = (req: Request, res: Response, next: NextFunction) => {
//   const bearerHeader = req.headers['authorization'];

//   if (typeof bearerHeader !== undefined) {
//     const bearerToken = bearerHeader?.split('')[1];
//     req.token = bearerToken;
//     next();
//   } else {
//     res.send({ status: 403 });
//   }
// };

// export const newToken = (user: User): string => {
//   return jwt.sign({ id: user.id }, 'secret', {
//     expiresIn: '1d',
//   });
// };

// export const verifyToken = async (token: string) => {
//   await jwt.verify(token, 'secret', (err, payload) => {
//     if (err) return err;
//     return payload;
//   });
// };

app.post('/signin', (req, res) => {
  const { username, email } = req.body
  const user = { username, email }
  jwt.sign({ user: user}, 'secret', (err: any, token: any) => {
    res.json({
      token
    })
  });
})

// console.log(
//   newToken({
//     id: 1,
//     username: 'Diana98',
//     email: 'prueba@test.com',
//   }),
// );
