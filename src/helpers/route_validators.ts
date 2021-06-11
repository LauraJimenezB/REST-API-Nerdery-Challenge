import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function validateUser(id: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });
  if (user) {
    return true;
  } else {
    return false;
  }
}

async function validatePost(authorId: string, id: string): Promise<boolean> {
  const post = await prisma.post.findFirst({
    where: {
      id: Number(id),
      authorId: Number(authorId),
    },
  });
  if (post) {
    return true;
  } else {
    return false;
  }
}

async function validatePostWithoutUser(id: string): Promise<boolean> {
  const post = await prisma.post.findUnique({
    where: {
      id: Number(id),
    },
  });
  if (post) {
    return true;
  } else {
    return false;
  }
}

async function validateComment(
  authorId: string,
  postId: string,
  id: string,
): Promise<boolean> {
  const comment = await prisma.comments.findFirst({
    where: {
      id: Number(id),
      authorId: Number(authorId),
      postId: Number(postId),
    },
  });
  if (comment) {
    return true;
  } else {
    return false;
  }
}

interface errorMessage {
  statusCode: number;
  message: string;
  error: string;
}

const notFound = (type: string, id: string): errorMessage => {
  return {
    statusCode: 404,
    message: `${type} with ID ${id} not found`,
    error: 'Bad Request',
  };
};

export {
  validateUser,
  validatePost,
  validatePostWithoutUser,
  validateComment,
  notFound,
};
