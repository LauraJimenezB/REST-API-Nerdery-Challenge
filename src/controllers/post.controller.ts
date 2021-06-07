import { request, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { notFound, validatePostWithoutUser, validatePost } from '../helpers/route_validators';

const prisma = new PrismaClient();

export const getPosts = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  try {
    const allPosts = await prisma.post.findMany();
    return res.send(allPosts);
  } catch (e) {
    return res.status(400).json(e);
  }
};

export const deletePosts = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  try {
    const posts = await prisma.post.deleteMany();
    return res.send(posts);
  } catch (e) {
    return res.status(400).json(e);
  }
};

export const createSinglePost = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  try {
    const { title, content, id } = req.body;
    if (req.body.user.id) {
      const post = await prisma.post.create({
        data: {
          id,
          title,
          content,
          author: { connect: { id: Number(req.body.user.id) } },
        },
      });
      return res.send(post);
    } else {
      return res.status(401).json('No authorizated to create a post!');
    }
  } catch (e) {
    return res.status(400).json(e);
  }
};

export const getSinglePost = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  try {
    const { postId } = req.params;
    const postExists = await validatePostWithoutUser(postId);
    if (postExists) {
      const post = await prisma.post.findUnique({
        where: {
          id: Number(postId),
        },
      });
      return res.json(post);
    } else {
      return res.status(404).json(notFound('Post', postId));
    }
  } catch (e) {
    return res.status(400).json(e);
  }
};

const getValidatePost = async (postId: string) => {
  const result = await prisma.post.findUnique({
    where: {
      id: Number(postId),
    },
  });
  if (result) return result;
  else throw new Error(`${postId} not exist`);
};

export const updateSinglePost = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  try {
    const { postId } = req.params;
    const { title, content } = req.body;
    const postExists = await validatePostWithoutUser(postId);
    if (!postExists) {
      return res.status(404).json(notFound('Post', postId));
    } else {
      const getPost = await getValidatePost(postId);

      if (getPost.authorId == req.body.user.id) {
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
        return res.status(401).json('No authorizated to update this post!');
      }
    } 
  } catch (e) {
    return res.status(400).json(e);
  }
};

export const deleteSinglePost = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  try {
    const { postId } = req.params;
    const userId = req.body.user.id
    const postExists = await validatePost(userId, postId);
    if (!postExists) {
        return res.status(404).json(notFound('Post', postId));
    } else {
        const getPost = await getValidatePost(postId);
        if (getPost.authorId == req.body.user.id) {
            const post = await prisma.post.delete({
            where: {
                id: Number(postId),
            },
            });
            return res.json(post);
        } else {
          return res.status(401).json('No authorizated to update this post!');
        }
    } 
  } catch (e) {
		console.log('error', e);
		
    return res.status(400).json(e);
  }
};
