import { Request, Response } from 'express';
import { 
  getAllUsersService,
  getSingleUserService,
} from '../services/user.service';

export const getAllUsers = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const allUsers = await getAllUsersService();
  return res.status(200).json(allUsers);
};

export const getSingleUser = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const result = await getSingleUserService(req.params.userId);
  return res.status(200).json(result);
};

