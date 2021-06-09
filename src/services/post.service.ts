import { PrismaClient } from '@prisma/client';
import 'reflect-metadata';
import 'es6-shim';
import { plainToClass } from 'class-transformer';

const prisma = new PrismaClient();

class PostDto {
    readonly id!:number;
    readonly title!: string;
    readonly content!: string
}

class CustomError extends Error {
    status: number;

    constructor(message: string, status = 500) {
        super(message);

        this.message = message;
        this.status = status;
    }
}

export async function getAllPostsService (): Promise<PostDto[]> {
    try {
        const allPosts = await prisma.post.findMany();

        const getPosts = allPosts.map((post)=>plainToClass(PostDto, post));
        return getPosts;
    } catch (e) {
        throw new CustomError(e.message, 422)
    }
}

type postContent = {
    id: number
    title: string;
    content: string;
}

export async function createSinglePostService (postContent: postContent, userId: number): Promise<PostDto> {
    try {
        const post = await prisma.post.create({
        data: {
            title: postContent.title,
            content: postContent.content,
            author: { connect: { id: Number(userId) } },
        },
        });
        return plainToClass(PostDto, post);
    } catch (e) {
        throw new CustomError(e.message, 422)
    }
}

export async function updateSinglePostService (
    postId: string,
    postContent: postContent
  ): Promise<PostDto> {
    try {
        const post = await prisma.post.update({
        where: {
            id: Number(postId),
        },
        data: {
            title: postContent.title,
            content: postContent.content,
        },
        });
        return plainToClass(PostDto, post);
    } catch (e) {
        throw new CustomError(e.message, 422)
    }
}

export async function deleteSinglePostService (
    postId: string
  ): Promise<PostDto> {
    try {
        const post = await prisma.post.delete({
        where: {
            id: Number(postId),
        },
        });
        return plainToClass(PostDto, post);
    } catch (e) {
        throw new CustomError(e.message, 422)
    }
}

export async function getSinglePostService (postId: string, userId:string): Promise<PostDto> {
    try {
        const post = await prisma.post.findFirst({
        where: {
            id: Number(postId),
            authorId: Number(userId),
        },
        });
        return plainToClass(PostDto, post);
    } catch (e) {
        throw new CustomError(e.message, 422)
    }
}

export async function getPostsService (userId: string): Promise<PostDto[]> {
    try {      
        const userPosts = await prisma.post.findMany({
          where: {
          authorId: Number(userId),
          },
        });

        const getPosts = userPosts.map((post)=>plainToClass(PostDto, post));
        return getPosts;
    } catch (e) {
        throw new CustomError(e.message, 422)
    }
}