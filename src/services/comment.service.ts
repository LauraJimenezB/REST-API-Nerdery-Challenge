import { PrismaClient } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { CommentDto } from '../dtos/commentDto';
import { CustomError } from '../helpers/handlerError';

const prisma = new PrismaClient();

export async function getAllCommentsService(): Promise<CommentDto[]> {
  try {
    const allComments = await prisma.comments.findMany();
    return plainToClass(CommentDto, allComments);
  } catch (e) {
    throw new CustomError(e.message, 422);
  }
}

type commentContent = {
  id: number;
  title: string;
  content: string;
};

export async function createCommentService(
  userId: string,
  commentContent: commentContent,
  postId: string,
): Promise<CommentDto> {
  try {
    const comment = await prisma.comments.create({
      data: {
        author: { connect: { id: Number(userId) } },
        content: commentContent.content,
        post: { connect: { id: Number(postId) } },
      },
    });
    return plainToClass(CommentDto, comment);
  } catch (e) {
    throw new CustomError(e.message, 422);
  }
}

export async function updateSingleCommentService(
  commentId: string,
  commentContent: commentContent,
): Promise<CommentDto> {
  try {
    const comment = await prisma.comments.update({
      where: {
        id: Number(commentId),
      },
      data: {
        content: commentContent.content,
      },
    });
    return plainToClass(CommentDto, comment);
  } catch (e) {
    throw new CustomError(e.message, 422);
  }
}

export async function deleteSingleCommentService(
  commentId: string,
): Promise<CommentDto> {
  try {
    const comment = await prisma.comments.delete({
      where: {
        id: Number(commentId),
      },
    });
    return plainToClass(CommentDto, comment);
  } catch (e) {
    throw new CustomError(e.message, 422);
  }
}

export async function getSingleCommentService(
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
