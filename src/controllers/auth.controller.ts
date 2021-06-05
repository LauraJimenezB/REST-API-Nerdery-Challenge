import { Request, Response } from 'express';
import { Prisma, PrismaClient, User } from '@prisma/client'
import { encryptPassword } from '../models/User';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response) => {
  const user = Prisma.validator<Prisma.UserArgs>()({
    select: { username: req.body.username, email: req.body.email, password: req.body.password }
  })

  user.select.password = await encryptPassword(user.select.password)

  const savedUser = await prisma.user.create({
  data: {
    username: user.select.username,
    email: user.select.email,
    password: user.select.password,
  }})
  //token
  const token: string = jwt.sign({_id: savedUser.id}, process.env.TOKEN_SECRET || 'secret')
  
  console.log(savedUser)
  res.header('auth-token', token).json(savedUser)
};

export const signin = (req: Request, res: Response) => {
  console.log(req.body)
  res.send('login')
};

export const profile = (req: Request, res: Response) => {
  res.send('profile')
}

function data(data: any, arg1: { username: any; email: any; password: any; }) {
  throw new Error('Function not implemented.');
}
