import { Prisma, PrismaClient } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import express from 'express';
import request from 'supertest';
import { app } from '../server';
import { server } from '../app';
const prisma = new PrismaClient();
import {
  getAllPostsService,
  createPostService,
  updatePostService,
  deletePostService,
} from '../services/post.service';
import {
  getAllCommentsService,
  createCommentService,
  updateCommentService,
  deleteCommentService,
} from '../services/comment.service';
import { newToken } from '../helpers/handlerPasswordAndToken';
import { PostDto } from '../dtos/post.dto';
import { CreatePostDto } from '../dtos/createPost.dto';
import { CreateCommentDto } from '../dtos/createComment.dto';
import { UpdatePostDto } from '../dtos/updatePost.dto';

let token1: string;
let token2: string;

beforeEach(async () => {
  await prisma.user.deleteMany();
  await prisma.post.deleteMany();
  await prisma.comments.deleteMany();
  const user1 = await prisma.user.create({
    data: {
      id: 1,
      username: 'example',
      email: 'example@gmail.com',
      password: '$2a$10$SFUotjg8JHxyMTe5iQed8.CkcoZeVrYDB3TGMWFC.bteiujYRUZOO',
      posts: {
        create: [
          {
            id: 1,
            title: 'POST #1',
            content: 'Content of the first post',
          },
          {
            id: 2,
            title: 'POST #2',
            content: 'Content of the second post',
            comments: {
              create: [
                {
                  id: 1,
                  authorId: 1,
                  content: 'Short comment',
                },
              ],
            },
          },
        ],
      },
    },
  });
  token1 = newToken(user1);
  const user2 = await prisma.user.create({
    data: {
      id: 2,
      username: 'abc',
      email: 'abc@gmail.com',
      password: 'password',
      posts: {
        create: [
          {
            id: 3,
            title: 'POST #3',
            content: 'Content of the first post',
            comments: {
              create: [
                {
                  id: 2,
                  authorId: 2,
                  content: 'Another short comment',
                },
              ],
            },
          },
        ],
      },
    },
  });
  token2 = newToken(user2);
});

//-------------------POSTS---------------------------------------------------

describe('getAllPosts', () => {
  it('should return a json with all users', async () => {
    const allPosts = await getAllPostsService();
    expect(allPosts).toHaveLength(3);
    const title = allPosts.map((post: { title: string }) => post.title);
    expect(title).toContain('POST #1');
    expect(title).toContain('POST #2');
    expect(title).toContain('POST #3');
  });
});

describe('createPost', () => {
  it('should return a created post', async () => {
    const post = await createPostService(
      '2',
      plainToClass(CreatePostDto, {
        title: 'New post...',
        content: 'Content of the new post',
        published: true,
      }),
    );
    expect(post.title).toBe('New post...');
  });
  it('should throw an error when title is empty', async () => {
    await expect(
      createPostService(
        '2',
        plainToClass(CreatePostDto, {
          title: '',
          content: 'Content of the new post',
          published: true,
        }),
      ),
    ).rejects.toThrow('BadRequestError');
  });
  it('should throw an error when content is not a string', async () => {
    await expect(
      createPostService(
        '2',
        plainToClass(CreatePostDto, {
          title: '',
          content: 4,
          published: true,
        }),
      ),
    ).rejects.toThrow('BadRequestError');
  });
});

describe('updatePost', () => {
  it('should return an updated post', async () => {
    const post = await updatePostService(
      '1',
      '1',
      plainToClass(UpdatePostDto, {
        title: 'Edited title',
        content: 'new content',
      }),
    );
    expect(post.title).toBe('Edited title');
    expect(post.content).toBe('new content');
  });

  it('should throw an error when title & content are empty', async () => {
    await expect(
      updatePostService(
        '1',
        '1',
        plainToClass(UpdatePostDto, {
          title: '',
          content: '',
        }),
      ),
    ).rejects.toThrow('BadRequestError');
  });

  it('should throw an error when the post does not exists in the database', async () => {
    await expect(
      updatePostService(
        '1',
        '8',
        plainToClass(UpdatePostDto, {
          title: 'New title',
          content: 'Content of post',
        }),
      ),
    ).rejects.toThrow('Post not found');
  });

  it('should throw an error when the user tries to update a post that does not belong to them', async () => {
    await expect(
      updatePostService(
        '2',
        '1',
        plainToClass(UpdatePostDto, {
          title: 'New title',
          content: 'Content of post',
        }),
      ),
    ).rejects.toThrow('Not authorized');
  });
});

describe('deletePost', () => {
  it('should return the deleted post', async () => {
    const post = await deletePostService('1', '1');
    expect(post.title).toBe('POST #1');
  });

  it('should throw an error when the post does not exists in the database', async () => {
    await expect(deletePostService('1', '8')).rejects.toThrow('Post not found');
  });

  it('should throw an error when the user tries to update a post that does not belong to them', async () => {
    await expect(deletePostService('3', '1')).rejects.toThrow('Not authorized');
  });
});

//-------------------------COMMENTS-------------------------------------------

describe('getAllComments', () => {
  it('should return all comments in the database', async () => {
    const allComments = await getAllCommentsService();
    expect(allComments).toHaveLength(2);
    const content = allComments.map(
      (comment: { content: string }) => comment.content,
    );
    expect(content).toContain('Short comment');
    expect(content).toContain('Another short comment');
  });
});

describe('createSingleComment', () => {
  it('should return a created comment', async () => {
    const comment = await createCommentService(
      '2',
      plainToClass(CreateCommentDto, {
        content: 'New comment!',
        published: true,
      }),
      '1',
    );
    expect(comment.content).toBe('New comment!');
  });

  it('should throw an error when content is empty', async () => {
    await expect(
      createCommentService(
        '2',
        plainToClass(CreateCommentDto, {
          content: '',
          published: true,
        }),
        '1',
      ),
    ).rejects.toThrow('BadRequestError');
  });

  it('should throw an error when published property is not boolean', async () => {
    await expect(
      createCommentService(
        '2',
        plainToClass(CreateCommentDto, {
          content: 'new comment',
          published: 'true',
        }),
        '1',
      ),
    ).rejects.toThrow('BadRequestError');
  });
});

describe('updateComment', () => {
  it('should return an updated comment', async () => {
    const comment = await updateCommentService(
      '1',
      '1',
      plainToClass(CreateCommentDto, { content: 'edited comment' }),
    );
    expect(comment.content).toBe('edited comment');
  });

  it('should throw an error when content is empty', async () => {
    await expect(
      updateCommentService(
        '1',
        '1',
        plainToClass(CreateCommentDto, {
          content: '',
        }),
      ),
    ).rejects.toThrow('BadRequestError');
  });

  it('should throw an error when the comment does not exists in the database', async () => {
    await expect(
      updateCommentService(
        '1',
        '8',
        plainToClass(CreateCommentDto, {
          content: 'Content of post',
        }),
      ),
    ).rejects.toThrow('Comment not found');
  });

  it('should throw an error when the user tries to update a comment that does not belong to them', async () => {
    await expect(
      updateCommentService(
        '2',
        '1',
        plainToClass(CreateCommentDto, {
          content: 'Content of post',
        }),
      ),
    ).rejects.toThrow('Not authorized');
  });
});

describe('deleteComment', () => {
  it('should return the deleted comment', async () => {
    const comment = await deleteCommentService('1', '1');
    expect(comment.content).toBe('Short comment');
  });

  it('should throw an error when the comment does not exists in the database', async () => {
    await expect(deleteCommentService('1', '8')).rejects.toThrow(
      'Comment not found',
    );
  });

  it('should throw an error when the user tries to delete a comment that does not belong to them', async () => {
    await expect(deleteCommentService('2', '1')).rejects.toThrow(
      'Not authorized',
    );
  });
});

afterAll(async () => {
  await prisma.$disconnect();
  server.close();
});
