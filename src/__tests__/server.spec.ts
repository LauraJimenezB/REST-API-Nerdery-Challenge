import { PrismaClient } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { server } from '../app';
const prisma = new PrismaClient();
import {
  getAllPostsService,
  createPostService,
  updatePostService,
  deletePostService,
  likeOrDislikePostService,
  getPostLikesService,
} from '../services/post.service';
import {
  getAllCommentsService,
  createCommentService,
  updateCommentService,
  deleteCommentService,
  getCommentLikesService,
  likeOrDislikeCommentService,
} from '../services/comment.service';
import { InputPostDto } from '../dtos/inputPost';
import { InputCommentDto } from '../dtos/inputComment.dto';


beforeEach(async () => {
  await prisma.user.deleteMany();
  await prisma.post.deleteMany();
  await prisma.comments.deleteMany();

  await prisma.user.create({
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
            likes: 1,
            dislikes: 2,
            likedBy: [2],
            dislikedBy: [3, 4]
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
                  likes: 1,
                  dislikes: 2,
                  likedBy: [3],
                  dislikedBy: [2, 4]
                },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.user.create({
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
      plainToClass(InputPostDto, {
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
        plainToClass(InputPostDto, {
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
        plainToClass(InputPostDto, {
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
      plainToClass(InputPostDto, {
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
        plainToClass(InputPostDto, {
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
        plainToClass(InputPostDto, {
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
        plainToClass(InputPostDto, {
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

describe('getPostLikes', () => {
  it('should get likes & dislikes of a post, also who liked and disliked the post (array of userIds)', async () => {
    const post = await getPostLikesService('1');
    expect(post.likes).toBe(1); 
    expect(post.likedBy).toEqual([2]);

    expect(post.dislikes).toBe(2);
    expect(post.dislikedBy).toEqual([3, 4]);
  })
});


describe('likeOrDislikePost', () => {
  it('should add likes when LIKE', async () => {
    const post = await likeOrDislikePostService('6', '1', true);
    expect(post.likes).toBe(2); // initially 1
    expect(post.likedBy).toHaveLength(2);
    expect(post.likedBy).toEqual([2, 6]); // userId = 6 was added to likedBy array

    //dislikes stay the same
    expect(post.dislikes).toBe(2);
    expect(post.dislikedBy).toHaveLength(2);
  });

  it('should add likes when DISLIKE', async () => {
    const post = await likeOrDislikePostService('6', '1', false);
    expect(post.dislikes).toBe(3); // initially 2
    expect(post.dislikedBy).toHaveLength(3);
    expect(post.dislikedBy).toEqual([3, 4, 6]); // userId = 6 was added to dislikedBy array

    //likes stay the same
    expect(post.likes).toBe(1); 
    expect(post.likedBy).toHaveLength(1);
  });

  it('should not add likes when LIKE because the user has already liked the post', async () => {
    const post = await likeOrDislikePostService('2', '1', true);
    //likes & dislikes stay the same
    expect(post.likes).toBe(1);
    expect(post.likedBy).toHaveLength(1);

    expect(post.dislikes).toBe(2);
    expect(post.dislikedBy).toHaveLength(2); 
  });

  it('should not add dislikes when DISLIKE because the user has already disliked the post', async () => {
    const post = await likeOrDislikePostService('3', '1', false);
    //likes & dislikes stay the same
    expect(post.likes).toBe(1);
    expect(post.likedBy).toHaveLength(1);
    
    expect(post.dislikes).toBe(2);
    expect(post.dislikedBy).toHaveLength(2);
  });

  it('should add likes & rest dislikes when LIKE,  if user has disliked the post before', async () => {
    const post = await likeOrDislikePostService('3', '1', true);
    expect(post.likes).toBe(2); // initially 1
    expect(post.likedBy).toHaveLength(2);

    expect(post.dislikes).toBe(1); // initially 2
    expect(post.dislikedBy).toHaveLength(1);
  });

  it('should rest likes & add dislikes when DISLIKE,  if user has liked the post before', async () => {
    const post = await likeOrDislikePostService('2', '1', false);
    expect(post.likes).toBe(0); // initially 1
    expect(post.likedBy).toHaveLength(0);

    expect(post.dislikes).toBe(3); // initially 2
    expect(post.dislikedBy).toHaveLength(3);
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
      plainToClass(InputCommentDto, {
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
        plainToClass(InputCommentDto, {
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
        plainToClass(InputCommentDto, {
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
      plainToClass(InputCommentDto, { content: 'edited comment' }),
    );
    expect(comment.content).toBe('edited comment');
  });

  it('should throw an error when content is empty', async () => {
    await expect(
      updateCommentService(
        '1',
        '1',
        plainToClass(InputCommentDto, {
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
        plainToClass(InputCommentDto, {
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
        plainToClass(InputCommentDto, {
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


describe('getCommentLikes', () => {
  it('should get likes & dislikes of a comment, also who liked and disliked the comment (array of userIds)', async () => {
    const comment = await getCommentLikesService('1');
    expect(comment.likes).toBe(1); 
    expect(comment.likedBy).toEqual([3]);

    expect(comment.dislikes).toBe(2);
    expect(comment.dislikedBy).toEqual([2, 4]);
  })
});


describe('likeOrDislikeComment', () => {
  it('should add likes when LIKE', async () => {
    const comment = await likeOrDislikeCommentService('6', '1', true);
    expect(comment.likes).toBe(2); // initially 1
    expect(comment.likedBy).toHaveLength(2);
    expect(comment.likedBy).toEqual([3, 6]); // userId = 6 was added to likedBy array

    //dislikes stay the same
    expect(comment.dislikes).toBe(2);
    expect(comment.dislikedBy).toHaveLength(2);
  });

  it('should add likes when DISLIKE', async () => {
    const comment = await likeOrDislikeCommentService('6', '1', false);
    expect(comment.dislikes).toBe(3); // initially 2
    expect(comment.dislikedBy).toHaveLength(3);
    expect(comment.dislikedBy).toEqual([2, 4, 6]); // userId = 6 was added to dislikedBy array

    //likes stay the same
    expect(comment.likes).toBe(1); 
    expect(comment.likedBy).toHaveLength(1);
  });

  it('should not add likes when LIKE, if the user has already liked the comment', async () => {
    const comment = await likeOrDislikeCommentService('3', '1', true);
    //likes & dislikes stay the same
    expect(comment.likes).toBe(1);
    expect(comment.likedBy).toHaveLength(1);

    expect(comment.dislikes).toBe(2);
    expect(comment.dislikedBy).toHaveLength(2); 
  });

  it('should not add dislikes when DISLIKE, if the user has already disliked the comment', async () => {
    const comment = await likeOrDislikeCommentService('2', '1', false);
    //likes & dislikes stay the same
    expect(comment.likes).toBe(1);
    expect(comment.likedBy).toHaveLength(1);
    
    expect(comment.dislikes).toBe(2);
    expect(comment.dislikedBy).toHaveLength(2);
  });

  it('should add likes & rest dislikes when LIKE,  if user has disliked the comment before', async () => {
    const comment = await likeOrDislikeCommentService('2', '1', true);
    expect(comment.likes).toBe(2); // initially 1
    expect(comment.likedBy).toHaveLength(2);

    expect(comment.dislikes).toBe(1); // initially 2
    expect(comment.dislikedBy).toHaveLength(1);
  });

  it('should rest likes & add dislikes when DISLIKE,  if user has liked the comment before', async () => {
    const comment = await likeOrDislikeCommentService('3', '1', false);
    expect(comment.likes).toBe(0); // initially 1
    expect(comment.likedBy).toHaveLength(0);

    expect(comment.dislikes).toBe(3); // initially 2
    expect(comment.dislikedBy).toHaveLength(3);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
  server.close();
});
