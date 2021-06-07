import { Request, Response } from 'express';
import { PrismaClient} from '@prisma/client';
import {
  validateUser,
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

export const createPost = async (req: Request, res: Response): Promise<Response<"json">> => {
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
