import { Request, Response } from 'express';
import { PrismaClient} from '@prisma/client';
import {
  notFound,
  validatePostWithoutUser,
} from '../helpers/route_validators';

const prisma = new PrismaClient();

export const getPosts = async (req: Request, res: Response): Promise<Response<"json">> => {
    try {
        const allPosts = await prisma.post.findMany();
        return res.send(allPosts);
    } catch (e) {
        return res.status(400).json(e)
    }
}

export const deletePosts = async (req: Request, res: Response): Promise<Response<"json">> => {
    try {
        const posts = await prisma.post.deleteMany();
        return res.send(posts);
    } catch (e) {
        return res.status(400).json(e)
    }
}

export const createSinglePost = async (req: Request, res: Response): Promise<Response<"json">> => {
    try {
        const { title, content,id } = req.body;
            const post = await prisma.post.create({
            data: {
                id,
                title,
                content,
                },
            });
            return res.send(post);
    } catch (e) {
        return res.status(400).json(e)
    }
}

export const getSinglePost = async (req: Request, res: Response): Promise<Response<"json">> => {
    try {
        const { postId } = req.params;
        const postExists = await validatePostWithoutUser(postId);
        if (postExists) {
            const post = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            },
            });
            return res.json(post);
        } else {
            return res.status(404).json(notFound('Post', postId));
        }
    } catch (e) {
        return res.status(400).json(e)
    }
}

export const updateSinglePost = async (req: Request, res: Response): Promise<Response<"json">> => {
    try {
        const { postId } = req.params;
        const { title, content } = req.body;
        const postExists = await validatePostWithoutUser(postId);
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
    } catch (e) {
        return res.status(400).json(e)
    }
}

export const deleteSinglePost = async (req: Request, res: Response): Promise<Response<"json">> => {
    try {
        const { postId } = req.params;
        const postExists = await validatePostWithoutUser(postId);
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
    } catch (e) {
        return res.status(400).json(e)
    }
}