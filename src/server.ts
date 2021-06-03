import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())

app.post('/signup', async(req, res) => {
  const { username, email } = req.body

  const result = await prisma.user.create({
    data: {
      username,
      email
    }
  })
  res.send(result)
})

app.post('/posts', async(req, res) => {
  const { title, content, authorId } = req.body

  const result = await prisma.post.create({
    data: {
      title,
      content,
      author: { connect: { email: authorId } },
    }
  })
  res.send(result)
})

app.get('/users', async(req, res) => {
  const result = await prisma.user.findMany()
  res.send(result)
})

app.get('/posts', async(req, res) => {
  const result = await prisma.post.findMany()
  res.send(result)
})

app.get(`/posts/:id`, async (req, res) => {
  const { id } = req.params
  const post = await prisma.post.findFirst({
    where: {
      id: Number(id),
    },
  })
  res.json(post)
})


export { app }


