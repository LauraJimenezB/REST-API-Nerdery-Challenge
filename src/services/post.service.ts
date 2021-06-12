import { PrismaClient } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { PostDto } from '../dtos/post.dto';
import { CustomError } from '../helpers/handlerError';
import { InputPostDto } from '../dtos/inputPost';
import { PostLikesDto } from '../dtos/postLikes.dto';
import { LikesDto } from '../dtos/likes.dto';
import { PostNoLikesDto } from '../dtos/post_nolikes.dto';
import { PostWithLikesDto } from '../dtos/post_withlikes.dto';

const prisma = new PrismaClient();


export async function getAllPostsService(): Promise<PostDto[]> {
  try {
    const allPosts = await prisma.post.findMany({
      where:{
        published: true,
      }
    });

    const getPosts = allPosts.map((post) => plainToClass(PostDto, post));
    return getPosts;
  } catch (e) {
    throw new CustomError(e.message, 422);
  }
}


export async function createPostService(
  userId: string,
  postContent: InputPostDto,
): Promise<PostNoLikesDto> {
  await postContent.isValid();

  try {
    const post = await prisma.post.create({
      data: {
        title: postContent.title,
        content: postContent.content,
        published: postContent.published,
        author: { connect: { id: Number(userId) } },
      },
    });
    return plainToClass(PostNoLikesDto, post);
  } catch (e) {
    throw new CustomError(e.message, 422);
  }
}

export async function getPostService( postId: string ): Promise<PostDto> {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });
    return plainToClass(PostDto, post);
  } catch (e) {
    throw new CustomError(e.message, 422);
  }
}


export async function updatePostService(
  userId: string,
  postId: string,
  postContent: InputPostDto,
): Promise<PostNoLikesDto> {
  await postContent.isValid();

  const post = await prisma.post.findUnique({
    where: {
      id: Number(postId),
    },
  });

  if (!post) {
    throw new CustomError('Post not found', 404);
  }

  if (post.authorId !== Number(userId)) {
    throw new CustomError('Not authorized', 401);
  }

  try {
    const post = await prisma.post.update({
      where: {
        id: Number(postId),
      },
      data: {
        title: postContent.title,
        content: postContent.content,
        published: postContent.published,
      },
    });
    return plainToClass(PostNoLikesDto, post);
  } catch (e) {
    throw new CustomError(e.message, 422);
  }
}

export async function deletePostService(
  userId: string,
  postId: string,
): Promise<PostNoLikesDto> {
  const post = await prisma.post.findUnique({
    where: {
      id: Number(postId),
    },
  });

  if (!post) {
    throw new CustomError('Post not found', 404);
  }

  if (post.authorId !== Number(userId)) {
    throw new CustomError('Not authorized', 401);
  }

  try {
    const post = await prisma.post.delete({
      where: {
        id: Number(postId),
      },
    });
    return plainToClass(PostNoLikesDto, post);
  } catch (e) {
    throw new CustomError(e.message, 422);
  }
}


export async function getPostLikesService(postId: string): Promise<PostWithLikesDto> {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });

    return plainToClass(PostWithLikesDto, post);
  } catch (e) {
    throw new CustomError(e.message, 422);
  }
}


export async function likeOrDislikePostService(
  userId: string,
  postId: string,
  likeStatus: boolean,
): Promise<LikesDto> {
  try {
    const getPost = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });

    const likedByArray = getPost?.likedBy;
    const dislikedByArray = getPost?.dislikedBy;

    const alreadyDisliked = dislikedByArray?.includes(Number(userId));
    const alreadyLiked = likedByArray?.includes(Number(userId));

    //If it changes likestatus: from true to false or viceversa to filter out userId
    const newLikedArray = likedByArray?.filter((el) => el !== Number(userId));
    const newDislikedArray = dislikedByArray?.filter(
      (el) => el !== Number(userId),
    );

    if (
      (alreadyLiked && likeStatus === true) ||
      (alreadyDisliked && likeStatus === false)
    ) {
      return plainToClass(LikesDto, getPost);
    }

    let likedBy;
    let dislikedBy;
    let likes;
    let dislikes;

    if (likeStatus === true && !alreadyDisliked) {
      likedBy = { push: Number(userId) };
      dislikedBy = dislikedByArray;
      likes = { increment: 1 };
      dislikes = { increment: 0 };
    } else if (likeStatus === false && !alreadyLiked) {
      likedBy = likedByArray;
      dislikedBy = { push: Number(userId) };
      likes = { increment: 0 };
      dislikes = { increment: 1 };
    } else if (likeStatus === true && alreadyDisliked) {
      likedBy = { push: Number(userId) };
      dislikedBy = { set: newDislikedArray };
      likes = { increment: 1 };
      dislikes = { decrement: 1 };
    } else if (likeStatus === false && alreadyLiked) {
      likedBy = { set: newLikedArray };
      dislikedBy = { push: Number(userId) };
      likes = { decrement: 1 };
      dislikes = { increment: 1 };
    }

    const post = await prisma.post.update({
      where: {
        id: Number(postId),
      },
      data: {
        likedBy,
        dislikedBy,
        likes,
        dislikes,
      },
    });

    return plainToClass(LikesDto, post);
  } catch (e) {
    throw new CustomError(e.message, 422);
  }
}
