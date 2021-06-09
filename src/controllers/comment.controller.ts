import { Request, Response } from 'express';
import {
  getAllCommentsService,
  createCommentService,
  updateSingleCommentService,
  deleteSingleCommentService,
  getSingleCommentService,
} from '../services/comment.service';

export const getAllComments = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const allComments = await getAllCommentsService();
  return res.status(200).json(allComments);
};

export const createSingleComment = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const result = await createCommentService(
    req.body.user.id,
    req.body,
    req.params.postId,
  );
  return res.status(200).json(result);
};

export const updateSingleComment = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const result = await updateSingleCommentService(
    req.params.commentId,
    req.body,
  );
  return res.status(200).json(result);
};

export const deleteSingleComment = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const result = await deleteSingleCommentService(req.params.commentId);
  return res.status(200).json(result);
};

export const getSingleComment = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const result = await getSingleCommentService(req.params.commentId);
  return res.status(200).json(result);
};

/* export const getComments = async (req: Request, res: Response): Promise<Response<"json">> => {
    try {
        const { postId } = req.params;
        const postExists = await validatePostWithoutUser(postId);
            if (postExists) {
                const comments = await prisma.comments.findMany({
                where: {
                    postId: Number(postId)
                },
                });
                return res.json(comments);
            } else {
                return res.status(404).json(notFound('Post', postId));
            }
    } catch (e) {
        return res.status(500).json(e)
    }
} */
