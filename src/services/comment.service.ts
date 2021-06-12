import { PrismaClient } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { CommentDto } from '../dtos/comment.dto';
import { CommentNoLikesDto } from '../dtos/comment_nolikes.dto';
import { CommentWithLikesDto } from '../dtos/comment_withlikes.dto';
import { InputCommentDto } from '../dtos/inputComment.dto';
import { UpdateCommentDto } from '../dtos/updateComment.dto';
import { LikesDto } from '../dtos/likes.dto';

import { CustomError } from '../helpers/handlerError';

const prisma = new PrismaClient();

export async function getAllCommentsService(): Promise<CommentDto[]> {
  try {
    const allComments = await prisma.comments.findMany({
      where:{
        published: true,
      }
    });
    return plainToClass(CommentDto, allComments);
  } catch (e) {
    throw new CustomError(e.message, 422);
  }
}

export async function createCommentService(
  userId: string,
  commentContent: InputCommentDto,
  postId: string,
): Promise<CommentNoLikesDto> {
  await commentContent.isValid();
  try {
    const comment = await prisma.comments.create({
      data: {
        author: { connect: { id: Number(userId) } },
        content: commentContent.content,
        post: { connect: { id: Number(postId) } },
        published: commentContent.published
      },
    });
    return plainToClass(CommentNoLikesDto, comment);
  } catch (e) {
    throw new CustomError(e.message, 422);
  }
}

export async function updateCommentService(
  userId: string,
  commentId: string,
  commentContent: UpdateCommentDto,
): Promise<CommentNoLikesDto> {
  await commentContent.isValid();

  const comment = await prisma.comments.findUnique({
    where: {
      id: Number(commentId),
    },
  });

  if (!comment) {
    throw new CustomError('Comment not found', 404);
  }

  if (comment.authorId !== Number(userId)) {
    throw new CustomError('Not authorized', 401);
  }

  try {
    const comment = await prisma.comments.update({
      where: {
        id: Number(commentId),
      },
      data: {
        content: commentContent.content,
        published: commentContent.published
      },
    });
    return plainToClass(CommentNoLikesDto, comment);
  } catch (e) {
    throw new CustomError(e.message, 422);
  }
}

export async function deleteCommentService(
  userId: string,
  commentId: string,
): Promise<CommentNoLikesDto> {
  const comment = await prisma.comments.findUnique({
    where: {
      id: Number(commentId),
    },
  });

  if (!comment) {
    throw new CustomError('Comment not found', 404);
  }

  if (comment.authorId !== Number(userId)) {
    throw new CustomError('Not authorized', 401);
  }

  try {
    const comment = await prisma.comments.delete({
      where: {
        id: Number(commentId),
      },
    });
    return plainToClass(CommentNoLikesDto, comment);
  } catch (e) {
    throw new CustomError(e.message, 422);
  }
}

export async function getCommentService(
  commentId: string,
): Promise<CommentDto> {
  try {
    const comment = await prisma.comments.findUnique({
      where: {
        id: Number(commentId),
      },
    });
    return plainToClass(CommentDto, comment);
  } catch (e) {
    throw new CustomError(e.message, 422);
  }
}

//comments/:commentId/likes
export async function getCommentLikesService(
  commentId: string,
): Promise<CommentWithLikesDto> {
  try {
    const post = await prisma.comments.findUnique({
      where: {
        id: Number(commentId),
      },
    });

    return plainToClass(CommentWithLikesDto, post);
  } catch (e) {
    throw new CustomError(e.message, 422);
  }
}

export async function likeOrDislikeCommentService(
  userId: string,
  commentId: string,
  likeStatus: boolean,
): Promise<CommentWithLikesDto> {
  try {
    const getComment = await prisma.comments.findUnique({
      where: {
        id: Number(commentId),
      },
    });

    const likedByArray = getComment?.likedBy;
    const dislikedByArray = getComment?.dislikedBy;

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
      return plainToClass(CommentWithLikesDto, getComment);
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

    const comment = await prisma.comments.update({
      where: {
        id: Number(commentId),
      },
      data: {
        likedBy,
        dislikedBy,
        likes,
        dislikes,
      },
    });

    return plainToClass(CommentWithLikesDto, comment);
  } catch (e) {
    throw new CustomError(e.message, 422);
  }
}
