import { NextFunction, Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import { encryptPassword, validatePassword } from '../models/User';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export interface IPayload {
  id: number;
  iat: number;
  exp: number;
}

export const verifyToken = async (token: string) => {
  const payload = (await jwt.verify(
    token,
    process.env.TOKEN_SECRET || 'secret',
  )) as IPayload;

  //req.userId = payload.id;
  return payload;
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = Prisma.validator<Prisma.UserArgs>()({
    select: {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    },
  });

  user.select.password = await encryptPassword(user.select.password);

  try {
    const savedUser = await prisma.user.create({
      data: {
        username: user.select.username,
        email: user.select.email,
        password: user.select.password,
      },
    });

    //token
    const token: string = jwt.sign(
      { id: savedUser.id, username: savedUser.username, role: savedUser.role },
      process.env.TOKEN_SECRET || 'secret',
    );

    //console.log(savedUser)
    res.header('auth-token', token).json(savedUser);
  } catch (e) {
    res.status(500).json('Unique constraint failed on the field email');
  }
};

export const signin = async (req: Request, res: Response) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json('Email and password required')
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

  if (!isPasswordMatching) return res.status(400).json('Invalid password');

  const token: string = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.TOKEN_SECRET || 'secret',
    {
      expiresIn: '1d',
    },
  );

  return res.header('auth-token', token).json(user);
};

export const profile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header('auth-token');
  if (!token) return res.status(401).json('Access denied');

  try {
    const payload = await verifyToken(token);
    const user = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    });
    if (!user) return res.status(404).json('No user found');
    //console.log('veamos...',user)
    res.status(200).json({ id: user.id, username: user.username, email: user.email });
    //res.json(user);
    next()
  } catch (e) {
    //console.error(e);
    return res.status(401).json(e);
  }

  next();
};
