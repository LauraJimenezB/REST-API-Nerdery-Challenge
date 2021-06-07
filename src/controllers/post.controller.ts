import { Request, Response } from 'express';
import { PrismaClient} from '@prisma/client';
import {
  validateUser,
  validatePost,
  notFound,
} from '../helpers/route_validators';

const prisma = new PrismaClient();

export const getAllPosts = async (req: Request, res: Response): Promise<Response<"json">> => {
    try {
        const allPosts = await prisma.post.findMany();
        return res.send(allPosts);
    } catch (e) {
        return res.status(400).json(e)
    }
}

export const getPosts = async (req: Request, res: Response): Promise<Response<"json">> => {
    try {
        const { userId } = req.params;
        const userExists = await validateUser(userId);
        if (userExists) {
        const userPosts = await prisma.post.findMany({
            where: {
            authorId: Number(userId),
            },
        });
        return res.json(userPosts);
        } else {
        return res.status(404).json(notFound('User', userId));
        }
    } catch (e) {
        return res.status(400).json(e)
    }
}

export const deletePosts = async (req: Request, res: Response): Promise<Response<"json">> => {
    try {
        const { userId } = req.params;
        const userExists = await validateUser(userId);
        if (userExists) {
        const posts = await prisma.post.deleteMany({
            where: {
            authorId: Number(userId),
            },
        });
        return res.send(posts);
        } else {
        return res.status(404).json(notFound('User', userId));
        }
    } catch (e) {
        return res.status(400).json(e)
    }
}

export const createSinglePost = async (req: Request, res: Response): Promise<Response<"json">> => {
    try {
        const { userId } = req.params
        const { title, content,id } = req.body;
        const userExists = await validateUser(userId)
        if (userExists) {
            const post = await prisma.post.create({
            data: {
                id,
                author: { connect: { id: Number(userId)} },
                title,
                content,
                },
            });
            return res.send(post);
        } else {
            return res.status(404).json(notFound('User', userId));
        }
    } catch (e) {
        return res.status(400).json(e)
    }
}

export const getSinglePost = async (req: Request, res: Response): Promise<Response<"json">> => {
    try {
        const { userId, postId } = req.params;
        const userExists = await validateUser(userId);
        if (userExists) {
        const postExists = await validatePost(userId, postId);
        if (postExists) {
            const post = await prisma.post.findFirst({
            where: {
                id: Number(postId),
                authorId: Number(userId),
            },
            });
            return res.json(post);
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

export const updateSinglePost = async (req: Request, res: Response): Promise<Response<"json">> => {
    try {
        const { userId, postId } = req.params;
        const { title, content } = req.body;
        const userExists = await validateUser(userId);
        if (userExists) {
        const postExists = await validatePost(userId, postId);
        if (postExists) {
            const post = await prisma.post.update({
            where: {
                id: Number(postId),
            },
            data: {
                title: title,
                content: content,
            },
            });
            return res.json(post);
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

export const deleteSinglePost = async (req: Request, res: Response): Promise<Response<"json">> => {
    try {
        const { userId, postId } = req.params;
        const userExists = await validateUser(userId);
        if (userExists) {
        const postExists = await validatePost(userId, postId);
        if (postExists) {
            const post = await prisma.post.delete({
            where: {
                id: Number(postId),
            },
            });
            return res.json(post);
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

