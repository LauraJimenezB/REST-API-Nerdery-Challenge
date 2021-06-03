import { Prisma, PrismaClient } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.post('/signup', async (req, res) => {
  const { username, email } = req.body;

  const result = await prisma.user.create({
    data: {
      username,
      email,
    },
  });
  res.send(result);
});

app.post('/posts', async (req, res) => {
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
    res.json({ error: `Not found userID ${authorId}` });
  }
});

app.get('/users', async (req, res) => {
  const result = await prisma.user.findMany();
  res.send(result);
});

export { app };
