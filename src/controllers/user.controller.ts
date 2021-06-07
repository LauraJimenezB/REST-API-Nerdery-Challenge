import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  validateUser,
  notFound,
} from '../helpers/route_validators';

const prisma = new PrismaClient();

export const getUsers = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  try {
    const users = await prisma.user.findMany();
    return res.json(users);
  } catch (e) {
    return res.status(400).json(e);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  try {
    const { userId } = req.params;
    // console.log('id', id);
    // console.log('req.body.user', req.body.user.id);

    // if( id != req.body.user.id){
    //   return res.status(400).json({ message: 'no puedes acceder a otros uausrios!'})
    // }
    //console.log('req.params', req.params)
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });
    if (user) {
      return res.json(user);
    } else {
      return res.status(404).json(notFound('User', userId));
    }
  } catch (e) {
    return res.status(400).json(e);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  try {
    const { userId } = req.params;
    
    const userExists = await validateUser(userId);
    if (userExists) {
      const user = await prisma.user.delete({
        where: {
          id: Number(userId),
        },
      });
      return res.json(user);
    } else {
      return res.status(404).json(notFound('User', userId));
    }
  } catch (e) {
    return res.status(400).json(e);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  try {
    const { userId } = req.params;
    const { fullname, bio, emailIsPublic, fullnameIsPublic } = req.body;
    const userExists = await validateUser(userId);
    if (userExists) {
      const user = await prisma.user.update({
        where: {
          id: Number(userId),
        },
        data: {
          emailIsPublic: (emailIsPublic =="true"),
          fullnameIsPublic: (fullnameIsPublic =="true"),
          fullname: fullname,
          bio: bio,
        },
      });
      return res.json(user);
    } else {
      return res.status(404).json(notFound('User', userId));
    }
  } catch (e) {
    return res.status(400).json(e);
  }
};
