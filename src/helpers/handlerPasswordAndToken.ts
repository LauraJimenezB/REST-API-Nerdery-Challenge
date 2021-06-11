import { User } from '.prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export type Payload = {
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

export const newToken = (userId: number): string => {
  return jwt.sign({ id: userId }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRES,
  });
};

export const verifyToken = async (token: string): Promise<Payload> => {
  const payload = (await jwt.verify(
    token.trim(),
    process.env.TOKEN_SECRET,
  )) as Payload;

  return payload;
};
