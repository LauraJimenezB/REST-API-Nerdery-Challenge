import { plainToClass } from 'class-transformer';
import { NextFunction, Request, Response } from 'express';
import { nextTick } from 'process';
import { CreateUserDto } from '../dtos/create-user.dto';
import { SigninUserDto } from '../dtos/signin-user.dto';
import { UserDto } from '../dtos/user.dto';
import { 
  signUpService,
  signInService,
  protectService,
} from '../services/auth.service';

export const signup = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const dto = plainToClass(CreateUserDto,req.body )
  const result = await signUpService(dto);
  return res.status(200).json(plainToClass(UserDto,result));
};

export const signin = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const dto = plainToClass(SigninUserDto,req.body)
  const result = await signInService(dto);
  return res.status(200).json(plainToClass(UserDto,result));
};

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const result = await protectService(req.headers.authorization);
  
  req.body.user = result;
  //res.status(200).json(plainToClass(UserDto,result));
  next()
};

// export const signout = async (
//   req: Request,
//   res: Response,
// ) => {
//   // const result = await signOutService(req.headers.authorization);
//   // req.body.user = result;
//   req.headers.authorization = ''
// }



