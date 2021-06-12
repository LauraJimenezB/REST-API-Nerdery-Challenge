import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { InputPostDto } from '../dtos/inputPost';
import { UpdatePostDto } from '../dtos/updatePost.dto';
import {
  getAllPostsService,
  createPostService,
  getPostService,
  updatePostService,
  deletePostService,
  getPostLikesService,
  likeOrDislikePostService,
} from '../services/post.service';

export const getAllPosts = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const allPosts = await getAllPostsService();
  return res.status(200).json(allPosts);
};

export const createPost = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const postContent = plainToClass(InputPostDto, req.body);
  const result = await createPostService(req.body.user.id, postContent);
  return res.status(200).json(result);
};

export const getPost = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const post = await getPostService(req.params.postId);
  return res.status(200).json(post);
};

export const updatePost = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const postContent = plainToClass(UpdatePostDto, req.body);
  const result = await updatePostService(
    req.body.user.id,
    req.params.postId,
    postContent,
  );
  return res.status(200).json(result);
};

export const deletePost = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const result = await deletePostService(req.body.user.id, req.params.postId);
  return res.status(200).json(result);
};

export const getPostLikes = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const result = await getPostLikesService(req.params.postId);
  return res.status(200).json(result);
};

export const likeOrDislikePost = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const result = await likeOrDislikePostService(
    req.body.user.id,
    req.params.postId,
    req.body.likeStatus,
  );
  return res.status(200).json(result);
};


