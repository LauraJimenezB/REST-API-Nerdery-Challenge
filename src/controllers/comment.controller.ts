import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import {
  getAllCommentsService,
  createCommentService,
  updateCommentService,
  deleteCommentService,
  getCommentLikesService,
  postCommentLikesService,
} from '../services/comment.service';
import { CreateCommentDto } from '../dtos/createComment.dto';

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
  const commentContent = plainToClass(CreateCommentDto, req.body);
  const result = await createCommentService(
    req.body.user.id,
    commentContent,
    req.params.postId,
  );
  return res.status(200).json(result);
};

export const updateComment = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const commentContent = plainToClass(CreateCommentDto, req.body);
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

export const postCommentLikes = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const result = await postCommentLikesService(
    req.body.user.id,
    req.params.commentId,
    req.body.likeStatus,
  );
  return res.status(200).json(result);
};
