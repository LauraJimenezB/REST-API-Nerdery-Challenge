import { Prisma, PrismaClient } from '@prisma/client';
import express from 'express';
import {
  validateUser,
  validatePost,
  validateComment,
  notFound
} from './helpers/route_validators'

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  const result = await prisma.user.create({
    data: {
      username,
      email,
      password
    },
  });
  res.send(result);
});


app.route('/users')
  .get(async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
  });


app.route('/users/:userId')
  .get(async (req, res) => {
    const { userId } = req.params
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      }
    })
    if(user) {
      res.json(user)
    } else {
      res.status(404).json(notFound('User', userId))
    }
  })
  .patch(async (req, res) => {
    const { userId } = req.params
    const { fullname, bio, emailIsPublic, fullnameIsPublic } = req.body
    const userExists = await validateUser(userId)
    if(userExists) {
      const user = await prisma.user.update({
        where: {
          id: Number(userId),
        },
        data: {
          emailIsPublic: emailIsPublic,
          fullnameIsPublic: fullnameIsPublic,
          fullname:fullname,
          bio: bio
        }
      })
      res.json(user)
    } else {
      res.status(404).json(notFound('User', userId))
    }
  })
  .delete(async (req, res) => {
    const { userId } = req.params
    const userExists = await validateUser(userId)
    if(userExists) {
      const user = await prisma.user.delete({
        where: {
          id: Number(userId),
        },
      })
      res.json(user)
    } else {
      res.status(404).json(notFound('User', userId))
    }
  })

app.route('/users/:userId/posts')
  .get(async (req, res) => {
    const { userId } = req.params
    const userExists = await validateUser(userId)
    if(userExists) {
      const userPosts = await prisma.post.findMany({
        where: {
          authorId: Number(userId),
        }
      })
      res.json(userPosts)
    } else {
      res.status(404).json(notFound('User', userId))
    }
  })
  .post(async (req, res) => {
    const { userId } = req.params
    const { title, content } = req.body;
    const userExists = await validateUser(userId)
    if (userExists) {
      const post = await prisma.post.create({
        data: {
          author: { connect: { id: Number(userId)} },
          title,
          content,
        },
      });
      res.send(post);
    } else {
      res.status(404).json(notFound('User', userId))
    }
  })
  .delete(async (req, res) => {
    const { userId } = req.params
    const userExists = await validateUser(userId)
    if (userExists) {
      const posts = await prisma.post.deleteMany({
        where: {
          authorId: Number(userId)
        }
      })
      res.send(posts);
    } else {
      res.status(404).json(notFound('User', userId))
    }
  });

app.route('/posts')
  .get(async (req, res) => {
    const allPosts = await prisma.post.findMany();
    res.send(allPosts);
  })

app.route('/users/:userId/posts/:postId')
  .get(async (req, res) => {
    const { userId, postId } = req.params
    const userExists = await validateUser(userId)
    if (userExists) {
      const postExists = await validatePost(userId, postId)
      if(postExists){
        const post = await prisma.post.findFirst({
          where: {
            id: Number(postId),
            authorId: Number(userId)
          }
        })
        res.json(post)
      } else {
        res.status(404).json(notFound('Post', postId))
      }
    } else  {
      res.status(404).json(notFound('User', userId))
    }
  })
  .patch(async (req, res) => {
    const { userId, postId } = req.params
    const { title, content } = req.body;
    const userExists = await validateUser(userId)
    if(userExists){
      const postExists = await validatePost(userId, postId)
      if(postExists){
        const post = await prisma.post.update({
          where: {
            id: Number(postId),
          },
          data: {
            title: title,
            content: content, 
          }
        })
        res.json(post)
      } else {
        res.status(404).json(notFound('Post', postId))
      }
    } else {
      res.status(404).json(notFound('User', userId))
    }
  })
  .delete(async (req, res) => {
    const { userId, postId } = req.params
    const userExists = await validateUser(userId)
    if (userExists) {
      const postExists = await validatePost(userId, postId)
        if(postExists){
        const post = await prisma.post.delete({
          where: {
            id: Number(postId)
          }
        })
        res.json(post)
      } else {
        res.status(404).json(notFound('Post', postId))
      }
    } else {
      res.status(404).json(notFound('User', userId))
    }
  })

app.route('/users/:userId/posts/:postId/comments')
  .get(async (req, res) => {
    const { userId, postId } = req.params
    const userExists = await validateUser(userId)
    if (userExists) {
      const postExists = await validatePost(userId, postId)
      if(postExists){
        const comments = await prisma.comments.findMany({
          where: {
            postId: Number(postId),
            authorId: Number(userId)
          }
        })
        res.json(comments)
      } else {
        res.status(404).json(notFound('Post', postId))
      }
    } else {
      res.status(404).json(notFound('User', userId))
    } 
  })
  .post(async (req, res) => {
    const { userId, postId } = req.params
    const { content } = req.body;
    const userExists = await validateUser(userId)
    if (userExists) {
      const postExists = await validatePost(userId, postId)
      if(postExists){
      const comment = await prisma.comments.create({
        data: {
          author: { connect: { id: Number(userId) } },
          content,
          post: { connect: { id: Number(postId) } },
        },
      });
      res.send(comment);
      } else {
        res.status(404).json(notFound('Post', postId))
      }
    } else {
      res.status(404).json(notFound('User', userId))
    } 
  });

app.route('/users/:userId/posts/:postId/comments/:commentId')
  .get(async (req, res) => {
    const { userId, postId, commentId } = req.params
    const userExists = await validateUser(userId)
    if (userExists) {
      const postExists = await validatePost(userId, postId)
      if(postExists){
        const commentExists = await validateComment(userId, postId, commentId)
          if (commentExists) {
          const comment = await prisma.comments.findUnique({
            where: {
              id: Number(commentId)
            }
          })
          res.json(comment)
        } else {
          res.status(404).json(notFound('Comment', commentId))
        }
      } else {
        res.status(404).json(notFound('Post', postId))
      }
    } else {
      res.status(404).json(notFound('User', userId))
    } 
  })
  .patch(async (req, res) => {
    const { userId, postId, commentId } = req.params
    const { content } = req.body;
    const userExists = await validateUser(userId)
    if (userExists) {
      const postExists = await validatePost(userId, postId)
      if(postExists){
        const commentExists = await validateComment(userId, postId, commentId)
        if (commentExists) {
          const comment = await prisma.comments.update({
            where: {
              id: Number(commentId)
            },
            data: {
              content: content, 
            }
          })
          res.json(comment)
        } else {
          res.status(404).json(notFound('Comment', commentId))
        }
      } else {
        res.status(404).json(notFound('Post', postId))
      }
    } else {
      res.status(404).json(notFound('User', userId))
    } 
  })
  .delete(async (req, res) => {
    const { userId, postId, commentId } = req.params
    const userExists = await validateUser(userId)
    if (userExists) {
      const postExists = await validatePost(userId, postId)
      if(postExists){
        const commentExists = await validateComment(userId, postId, commentId)
        if (commentExists) {
          const comment = await prisma.comments.delete({
            where: {
              id: Number(commentId)
            },
          })
          res.json(comment)
        } else {
          res.status(404).json(notFound('Comment', commentId))
        }
      } else {
        res.status(404).json(notFound('Post', postId))
      }
    } else {
      res.status(404).json(notFound('User', userId))
    } 
  });

export { app };
