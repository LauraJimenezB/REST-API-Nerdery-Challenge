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
        return res.status(400).json(e)
    }
}

export const getComments = async (req: Request, res: Response): Promise<Response<"json">> => {
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
        return res.status(400).json(e)
    }
}

export const createComment = async (req: Request, res: Response): Promise<Response<"json">> => {
    try {
        const { userId, postId } = req.params;
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
        return res.status(400).json(e)
    }
}

export const getSingleComment = async (req: Request, res: Response): Promise<Response<"json">> => {
    try {
        const { userId, postId, commentId } = req.params;
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
        return res.status(400).json(e)
    }
}

export const updateSingleComment = async (req: Request, res: Response): Promise<Response<"json">> => {
    try {
        const { userId, postId, commentId } = req.params;
        const { content } = req.body;
        const userExists = await validateUser(userId);
        if (userExists) {
            const postExists = await validatePost(userId, postId);
            if (postExists) {
                const commentExists = await validateComment(userId, postId, commentId);
                if (commentExists) {
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
                    return res.status(404).json(notFound('Comment', commentId));
                }
            } else {
                return res.status(404).json(notFound('Post', postId));
            }
        } else {
            return res.status(404).json(notFound('User', userId));
        }
    } catch (e) {
        return res.status(400).json(e)
    }
}

export const deleteSingleComment = async (req: Request, res: Response): Promise<Response<"json">> => {
    try {
        const { userId, postId, commentId } = req.params;
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
        return res.status(400).json(e)
    }
}