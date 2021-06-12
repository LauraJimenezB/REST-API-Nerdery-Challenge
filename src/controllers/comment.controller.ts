import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import {
  getAllCommentsService,
  createCommentService,
  getCommentService,
  updateCommentService,
  deleteCommentService,
  getCommentLikesService,
  likeOrDislikeCommentService
} from '../services/comment.service';
import { InputCommentDto } from '../dtos/inputComment.dto';
import { UpdateCommentDto } from '../dtos/updateComment.dto';

export const getAllComments = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const allComments = await getAllCommentsService();
  return res.status(200).json(allComments);
};

export const createComment = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const commentContent = plainToClass(InputCommentDto, req.body);
  const result = await createCommentService(
    req.body.user.id,
    commentContent,
    req.params.postId,
  );
  return res.status(200).json(result);
};

export const getComment = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const  comment = await getCommentService(req.params.commentId);
  return res.status(200).json(comment);
};

export const updateComment = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const commentContent = plainToClass(UpdateCommentDto, req.body);
  const result = await updateCommentService(
    req.body.user.id,
    req.params.commentId,
    commentContent,
  );
  return res.status(200).json(result);
};

export const deleteComment = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const result = await deleteCommentService(
    req.body.user.id,
    req.params.commentId,
  );
  return res.status(200).json(result);
};

export const getCommentLikes = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const result = await getCommentLikesService(req.params.commentId);
  return res.status(200).json(result);
};

export const likeOrDislikeComment = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const result = await likeOrDislikeCommentService(
    req.body.user.id,
    req.params.commentId,
    req.body.likeStatus,
  );
  return res.status(200).json(result);
};
