import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  validateUser,
  notFound,
} from '../helpers/route_validators';

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  return res.json(users);
}

export const getUser = async(req: Request, res: Response) => {
  try {
    const { id } = req.params;
    //console.log('req.params', req.params)
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    //console.log('user', user);
    
    if (user) {
      return res.json(user);
    } else {
      return res.status(404).json(notFound('User', id));
    }

  } catch (e) {
    console.error(e)
    return res.status(400).json(e)
  }
}
