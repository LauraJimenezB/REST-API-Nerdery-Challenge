import { Request, Response } from 'express';
import { PrismaClient} from '@prisma/client';
import {
  validateUser,
  validatePost,
  validatePostWithoutUser,
  validateComment,
  notFound,
} from '../helpers/route_validators';

const prisma = new PrismaClient();

export const getAllComments = async (req: Request, res: Response): Promise<Response<"json">> => {
    try {
        const allComments = await prisma.comments.findMany();
        return res.send(allComments);
    } catch (e) {
        return res.status(500).json(e)
    }
}

export const createComment = async (req: Request, res: Response): Promise<Response<"json">> => {
    try {
        const { postId } = req.params;
        const userId = req.body.user.id;
        const { content } = req.body;
        const userExists = await validateUser(userId);
        if (userExists) {
            const postExists = await validatePost(userId, postId);
            if (postExists) {
                const comment = await prisma.comments.create({
                data: {
                    author: { connect: { id: Number(userId) } },
                    content,
                    post: { connect: { id: Number(postId) } },
                },
                });
                return res.send(comment);
            } else {
                return res.status(404).json(notFound('Post', postId));
            }
        } else {
            return res.status(404).json(notFound('User', userId));
        }
    } catch (e) {
        return res.status(500).json(e)
    }
}

export const getSingleComment = async (req: Request, res: Response): Promise<Response<"json">> => {
    try {
        const { postId, commentId } = req.params;
        const userId = req.body.user.id
        const userExists = await validateUser(userId);
        if (userExists) {
            const postExists = await validatePost(userId, postId);
            if (postExists) {
                const commentExists = await validateComment(userId, postId, commentId);
                if (commentExists) {
                    const comment = await prisma.comments.findUnique({
                        where: {
                        id: Number(commentId),
                        },
                    });
                    return res.json(comment);
                } else {
                    return res.status(404).json(notFound('Comment', commentId));
                }
            } else {
                return res.status(404).json(notFound('Post', postId));
            }
        } else {
            return res.status(404).json(notFound('User', userId));
        }
    } catch (e) {
        return res.status(500).json(e)
    }
}

const getValidateComment = async (commentId: string) => {
    const result = await prisma.comments.findUnique({
      where: {
        id: Number(commentId),
      },
    });
    if (result) return result;
    else throw new Error(`${commentId} not exist`);
};


export const updateSingleComment = async (req: Request, res: Response): Promise<Response<"json">> => {
    try {
        const { postId, commentId } = req.params;
        const userId = req.body.user.id;
        const { content } = req.body;
            const postExists = await validatePostWithoutUser(postId);
            if (!postExists) {
                return res.status(404).json(notFound('Post', postId));
              } else {
                const getComment = await getValidateComment(commentId);
                if (getComment.authorId == userId) {
                    const comment = await prisma.comments.update({
                    where: {
                    id: Number(commentId),
                    },
                    data: {
                    content: content,
                    },
                    });
                    return res.json(comment);
                } else {
                  return res.status(401).json('No authorizated to update this post!');
                }
            }  
    } catch (e) {
        return res.status(500).json(e)
    }
}

export const deleteSingleComment = async (req: Request, res: Response): Promise<Response<"json">> => {
    try {
        const { postId, commentId } = req.params;
        const userId = req.body.user.id
        const userExists = await validateUser(userId);
        if (userExists) {
        const postExists = await validatePost(userId, postId);
            if (postExists) {
                const commentExists = await validateComment(userId, postId, commentId);
                if (commentExists) {
                    const comment = await prisma.comments.delete({
                        where: {
                        id: Number(commentId),
                        },
                    });
                    return res.json(comment);
                } else {
                return res.status(404).json(notFound('Comment', commentId));
                }
            } else {
                return res.status(404).json(notFound('Post', postId));
            }
        } else {
            return res.status(404).json(notFound('User', userId));
        }
    } catch (e) {
        return res.status(500).json(e)
    }
}

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