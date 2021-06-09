import { NextFunction, Request, Response } from 'express';
import { 
  signUpService,
  signInService,
  protectService
} from '../services/auth.service';

export const signup = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const result = await signUpService(req.body);
  return res.status(200).json(result);
};

export const signin = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const result = await signInService(req.body);
  return res.status(200).json(result);
};

export const protect = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const result = await protectService(req.headers.authorization);
  req.body.user = result;
  return res.status(200).json(result);
};



