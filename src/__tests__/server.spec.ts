import { Prisma, PrismaClient} from '@prisma/client'
import express from 'express';
import request from 'supertest';
import { app } from '../server';
import { server } from '../app'
const prisma = new PrismaClient()
import { newToken } from '../helpers/auth'


let token: string;

beforeEach( async() => {
  await prisma.user.deleteMany()
  await prisma.post.deleteMany()
  await prisma.comments.deleteMany()
  const user1 = await prisma.user.create({
    data: {
      id: 1,
      username: "example",
      email: "example@gmail.com",
      password: "$2a$10$SFUotjg8JHxyMTe5iQed8.CkcoZeVrYDB3TGMWFC.bteiujYRUZOO",
      posts: {
        create: [
          {
            id: 1,
            title: "POST #1",
            content: "Content of the first post",
          },
          {
            id: 2,
            title: "POST #2",
            content: "Content of the second post",
            comments: {
              create: [
                {
                  id: 1,
                  authorId: 1,
                  content: "Short comment",
                }
              ]
            }
          },
        ]
      }
    },
  });
  token= newToken(user1);
  const user2 = await prisma.user.create({
    data: {
      id: 2,
      username: "abc",
      email: "abc@gmail.com",
      password: "$2a$10$SFUotjg8JHxyMTe5iQed8.CkcoZeVrYDB3TGMWFC.bteiujYRUZOO"
    },
  });
})

describe("Test /users endpoint", () => {
  test("It should return a JSON of all users", async() => {
    const jwt = `Bearer ${token}`
    await request(app)
        .get('/api/users')
        .set('Authorization', jwt)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
  });
  test("It should return 2 users", async() => {
    const jwt = `Bearer ${token}`
    const response = await request(app).get('/api/users').set('Authorization', jwt)
    console.log(response)
    expect(response.body).toHaveLength(2)
  });
});

describe("Test users/:id endpoint", () => {
  test("It should return the user called with the id", async() => {
    const jwt = `Bearer ${token}`
    const response = await request(app).get('/api/users/1').set('Authorization', jwt)
    expect(response.body.id).toBe(1)
    expect(response.body.username).toBe('example')
    expect(response.body.email).toBe('example@gmail.com')
  });
  test("It should throw an error when the user id does not exists", async() => {
    const userId = 123
    const jwt = `Bearer ${token}`
    const response = await request(app).get(`/api/users/${userId}`).set('Authorization', jwt)
    expect(response.status).toBe(404)
    expect(response.body).toEqual({
      statusCode: 404, 
      message: `User with ID ${userId} not found`,
      error: "Bad Request"
  })
  });
});

/* 
describe("Test users/:userId/posts endpoint", () => {
  test("It should get all the posts of a user", async() => {
    app.use(express.json());
    await request(app)
      .get('/users/1/posts')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const response = await request(app).get('/users/1/posts')
    expect(response.body).toHaveLength(2)
    expect(response.body[0].authorId).toBe(1)
    expect(response.body[1].authorId).toBe(1)
  });
  test("It should create a post with the user id", async() => {
    app.use(express.json());
    await request(app)
      .post(`/users/1/posts`)
      .send({
        title: "POST #3",
        content: "Content of the third post"
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const response = await request(app).get('/users/1/posts')
    expect(response.body).toHaveLength(3)
    expect(response.body[response.body.length-1].authorId).toBe(1)
  });
  test("It should delete all posts of a user", async() => {
    await request(app)
      .delete('/users/1/posts')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const response = await request(app).get('/users/1/posts')
    expect(response.body).toHaveLength(0)
  });
});

describe("Test posts/ endpoint", () => {
  test("It should get all posts", async() => {
    app.use(express.json());
    await request(app)
      .get('/posts')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const response = await request(app).get('/posts')
    expect(response.body).toHaveLength(2)
    const title = response.body.map((post: { title: string })=>post.title)
    expect(title).toContain('POST #1')
  });
  
});

describe("Test users/:userId/posts/:postId endpoint", () => {
  test("It should get an specific post of a user", async() => {
    app.use(express.json());
    const response = await request(app).get('/users/1/posts/2')
    expect(response.body.title).toBe('POST #2')
  });
  test("It should update an specific post of a user", async() => {
    app.use(express.json());
    const response = await request(app)
      .patch('/users/1/posts/1')
      .send({
        title: "Edited title",
        content: "new content"
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.title).toBe('Edited title')
  });
  test("It should delete an specific post of a user", async() => {
    app.use(express.json());
    const response = await request(app)
      .delete('/users/1/posts/1')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.title).toBe('POST #1')
  });
});


describe("Test users/:userId/posts/:postId/comments endpoint", () => {
  test("It should get all the posts of a user", async() => {
    app.use(express.json());
    await request(app)
      .get('/users/1/posts/2/comments')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const response = await request(app).get('/users/1/posts/2/comments')
    expect(response.body).toHaveLength(1)
  });
  test("It should create a comment with the user id & post id", async() => {
    app.use(express.json());
    await request(app)
      .post('/users/1/posts/2/comments')
      .send({
        id: 2,
        content: "New comment"
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const response = await request(app).get('/users/1/posts/2/comments')
    expect(response.body).toHaveLength(2)
  });
});

describe("Test users/:userId/posts/:postId/comments/:commentId endpoint", () => {
  test("It should get an specific comments of a post and user", async() => {
    app.use(express.json());
    const response = await request(app).get('/users/1/posts/2/comments/1')
    expect(response.body.content).toBe('Short comment')
  });
  test("It should update an specific comment of post and user", async() => {
    app.use(express.json());
    const response = await request(app)
      .patch('/users/1/posts/2/comments/1')
      .send({
        content: "edited comment"
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.content).toBe('edited comment')
  });
  test("It should delete an specific comment of a post and user", async() => {
    app.use(express.json());
    const response = await request(app)
      .delete('/users/1/posts/2/comments/1')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.content).toBe('Short comment')
  });
});
 */
afterAll( async() => {
   await prisma.$disconnect()
   server.close()
})
