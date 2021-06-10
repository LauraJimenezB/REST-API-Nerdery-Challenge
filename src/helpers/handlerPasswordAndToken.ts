import { User } from '.prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserDto } from '../dtos/user.dto';

export interface IPayload {
  id: string;
  iat: number;
  exp: number;
}

export const encryptPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export async function validatePassword(
  plainTextPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
}

export const newToken = (user: User): string => {
  return jwt.sign({ id: user.id }, process.env.TOKEN_SECRET || 'secret', {
    expiresIn: '1d',
  });
};

export const verifyToken = async (token: string): Promise<IPayload> => {
  const payload = (await jwt.verify(
    token.trim(),
    process.env.TOKEN_SECRET || 'secret',
  )) as IPayload;

  return payload;
};