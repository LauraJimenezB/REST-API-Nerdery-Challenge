import { Request, Response } from 'express';
import {
  getAllPostsService,
  getSinglePostService,
  createPostService,
  updatePostService,
  deletePostService,
} from '../services/posts.services';

export const getAllPosts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const result = await getAllPostsService();
  res.status(200).json(result);
};

export const getSinglePost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const result = await getSinglePostService(req.params.id);
  res.status(200).json(result);
};

export const createSinglePost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const result = await createPostService(req.body, req.body.user.id);
  res.status(200).json(result);
};

export const updateSinglePost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const result = await updatePostService(req.body, req.params.id);
  res.send(200).json(result);
};

export const deleteSinglePost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const result = await deletePostService(req.params.id);
  res.send(200).json(result);
};
