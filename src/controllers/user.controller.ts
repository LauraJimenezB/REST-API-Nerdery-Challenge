import { Request, Response } from 'express';
import { 
  getAllUsersService,
  getSingleUserService,
  deleteSingleUserService,
  createSingleUserService,
  updateSingleUserService
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

export const createUser = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const result = await createSingleUserService(req.body);
  return res.status(200).json(result);
}

export const deleteUser = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const result = await deleteSingleUserService(req.params.userId);
  return res.status(200).json(result);
};

export const updateUser = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const result = await updateSingleUserService(req.params.userId, req.body)
  return res.status(200).json(result);
};
