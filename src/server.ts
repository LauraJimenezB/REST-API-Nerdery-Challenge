import { Prisma, PrismaClient } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  const result = await prisma.user.create({
    data: {
      username,
      email,
      password,
    },
  });
  res.send(result);
});

app.route('/users').get(async (req, res) => {
  const result = await prisma.user.findMany();
  res.send(result);
});

app
  .route('/users/:id')
  .get(async (req, res) => {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    res.json(user);
  })
  .patch(async (req, res) => {
    const { id } = req.params;
    const { fullname, bio, emailIsPublic, fullnameIsPublic } = req.body;
    try {
      const user = await prisma.user.update({
        where: {
          id: Number(id),
        },
        data: {
          emailIsPublic: emailIsPublic,
          fullnameIsPublic: fullnameIsPublic,
          fullname: fullname,
          bio: bio,
        },
      });
      res.json(user);
    } catch (error) {
      res.json({
        error: `Profile with ID ${id} does not exist in the database`,
      });
    }
  });

app
  .route('/users/:userId/posts')
  .get(async (req, res) => {
    const { userId } = req.params;
    const result = await prisma.post.findMany({
      where: {
        authorId: Number(userId),
      },
    });
    res.json(result);
  })
  .post(async (req, res) => {
    const { title, content, authorId } = req.body;
    try {
      const result = await prisma.post.create({
        data: {
          author: { connect: { id: authorId } },
          title,
          content,
        },
      });
      res.send(result);
    } catch (error) {
      res.json({ error: `Can't create post, not found userID ${authorId}` });
    }
  });

app.route('/posts').get(async (req, res) => {
  const result = await prisma.post.findMany();
  res.send(result);
});

app
  .route(`users/:userId/posts/:postId`)
  .get(async (req, res) => {
    const { userId, postId } = req.params;
    const post = await prisma.post.findFirst({
      where: {
        id: Number(postId),
        authorId: Number(userId),
      },
    });
    res.json(post);
  })
  .patch(async (req, res) => {
    const { postId } = req.params;
    const { title, content } = req.body;
    try {
      const post = await prisma.post.update({
        where: {
          id: Number(postId),
        },
        data: {
          title: title,
          content: content,
        },
      });
      res.json(post);
    } catch (error) {
      res.json({
        error: `Post with ID ${postId} does not exist in the database`,
      });
    }
  })
  .delete(async (req, res) => {
    const { postId } = req.params;
    const post = await prisma.post.delete({
      where: {
        id: Number(postId),
      },
    });
    res.json(post);
  });

app
  .route('users/:userId/posts/:postId/comments')
  .get(async (req, res) => {
    const { userId, postId } = req.params;
    const comments = await prisma.comments.findMany({
      where: {
        postId: Number(postId),
        authorId: Number(userId),
      },
    });
    res.json(comments);
  })
  .post(async (req, res) => {
    const { content, authorId, postId } = req.body;
    try {
      const result = await prisma.comments.create({
        data: {
          author: { connect: { id: authorId } },
          content,
          post: { connect: { id: postId } },
        },
      });
      res.send(result);
    } catch (error) {
      res.json(error);
      //no user record, no post record
    }
  });

app
  .route(`users/:userId/posts/:postId/comments/:commentId`)
  .get(async (req, res) => {
    const { userId, postId, commentId } = req.params;
    const comment = await prisma.comments.findFirst({
      where: {
        id: Number(commentId),
        authorId: Number(userId),
        postId: Number(postId),
      },
    });
    res.json(comment);
  })
  .patch(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    try {
      const comment = await prisma.comments.update({
        where: {
          id: Number(commentId),
        },
        data: {
          content: content,
        },
      });
      res.json(comment);
    } catch (error) {
      res.json({
        error: `Comment with ID ${commentId} does not exist in the database`,
      });
    }
  })
  .delete(async (req, res) => {
    const { commentId } = req.params;
    const comment = await prisma.comments.delete({
      where: {
        id: Number(commentId),
      },
    });
    res.json(comment);
  });

export { app };
