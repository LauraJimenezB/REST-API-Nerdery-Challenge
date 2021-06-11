import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserDto } from '../dtos/user.dto';
import { 
  getAllUsersService,
  getSingleUserService,
  updateProfileUserService
} from '../services/user.service';

export const getAllUsers = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const allUsers = await getAllUsersService();
  return res.status(200).json(plainToClass(UserDto,allUsers));
};

export const getSingleUser = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const result = await getSingleUserService(req.params.userId);
  return res.status(200).json(plainToClass(UserDto,result));
};

export const updateProfileUser = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const dto = plainToClass(UpdateUserDto,req.body)
  const result = await updateProfileUserService(req.params.userId, dto)
  console.log('result', result);
  console.log('req.params.userId', req.params.userId);
  console.log('req.body', req.body);
  
  return res.status(200).json(plainToClass(UpdateUserDto,result));
}

