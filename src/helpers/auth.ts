import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { IUser, encryptPassword, validatePassword } from '../models/User';

const prisma = new PrismaClient();

export interface IPayload {
  id: number;
  iat: number;
  exp: number;
}

export const newToken = (user: IUser): string => {
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

export const signup = async (req: Request, res: Response) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json('Email and password required');
  }

  try {
    req.body.password = await encryptPassword(req.body.password);
    const savedUser = await prisma.user.create({
      data: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      },
    });

    const token: string = newToken(savedUser);
    return res.status(200).send({ token });
  } catch (e) {
    //console.log(e);
    return res.status(400).end();
  }
};

export const signin = async (req: Request, res: Response) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json('Email and password required');
  }

  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });

  if (!user) return res.status(400).json('Email or password is wrong');
  const isPasswordMatching: boolean = await validatePassword(
    req.body.password,
    user.password,
  );

  try {
    if (!isPasswordMatching) return res.status(400).json('Invalid password');

    const token: string = newToken(user);
    return res.status(201).send({ token });
  } catch (e) {
    console.error(e);
    return res.status(400).json('Not auth');
  }
};

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.headers.authorization) {
    return res.status(401).end();
  }

  const token = req.headers.authorization.split('Bearer')[1];

  if (!token) {
    return res.status(401).end();
  }

  try {
    const payload = await verifyToken(token);

    const user = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    });
    //res.status(200).send({user});
    //res.json(user);
    req.body.user = user;
    next();
  } catch (e) {
    console.error(e);
    return res.status(401).json(e);
  }
};
