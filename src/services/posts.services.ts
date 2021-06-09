import { PrismaClient } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { PostDto } from '../dtos/postDto';

const prisma = new PrismaClient();

export const getAllPostsService = async (): Promise<PostDto[]> => {
  const posts = await prisma.post.findMany();
  return plainToClass(PostDto, posts);
};

export const getSinglePostService = async (
  postId: string,
): Promise<PostDto> => {
  const post = await prisma.post.findUnique({
    where: {
      id: Number(postId),
    },
  });
  return plainToClass(PostDto, post);
};

export const createPostService = async (
  body: PostDto,
  userId: string,
): Promise<PostDto> => {
  const newPost = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      author: { connect: { id: Number(userId) } },
    },
  });
  return plainToClass(PostDto, newPost);
};

export const updatePostService = async (
  body: PostDto,
  postId: string,
): Promise<PostDto> => {
  const post = await prisma.post.update({
    where: {
      id: Number(postId),
    },
    data: {
      title: body.title,
      content: body.content,
    },
  });
  return plainToClass(PostDto, post);
};

export const deletePostService = async (postId: string): Promise<PostDto> => {
  const post = await prisma.post.delete({
    where: {
      id: Number(postId),
    },
  });
  return plainToClass(PostDto, post);
};
