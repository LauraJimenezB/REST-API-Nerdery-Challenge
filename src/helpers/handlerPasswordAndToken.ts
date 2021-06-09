import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserDto } from '../dtos/userDto';

export interface IPayload {
  id: number;
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

export const newToken = (user: UserDto): string => {
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