import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface IPayload {
  id: number;
  iat: number;
  exp: number;
}

// declare module 'express' {
//   export interface Request {
//     userId: number
//   }
// }

export const tokenValidation = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header('auth-token');
  if (!token) return res.status(401).json('Access denied');

  const payload = jwt.verify(
    token,
    process.env.TOKEN_SECRET || 'secret',
  ) as IPayload;

  //req.userId = payload.id;
  console.log(payload);

  next();
};
