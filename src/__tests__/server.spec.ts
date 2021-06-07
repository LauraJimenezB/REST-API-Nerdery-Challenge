import { Prisma, PrismaClient } from '@prisma/client';
import express from 'express';
import request from 'supertest';
import { app } from '../server';
import { server } from '../app';
const prisma = new PrismaClient();
import { newToken } from '../helpers/auth';

let token: string;

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
  token = newToken(user1);
  await prisma.user.create({
    data: {
      id: 2,
      username: "abc",
      email: "abc@gmail.com",
      password: "password"
    },
  });
});


describe("Test GET /users", () => {
  test("It should return a JSON of all users", async() => {
    const jwt = `Bearer ${token}`
    await request(app)
      .get('/api/users')
      .set('Authorization', jwt)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
  });

  test("It should return 2 users", async() => {
    const jwt = `Bearer ${token}`
    const response = await request(app).get('/api/users').set('Authorization', jwt)
    expect(response.body).toHaveLength(2)
  });
  /* test("It should return an ERROR: wrong endpoint", async() => {
    const jwt = `Bearer ${token}`
    await request(app)
        .get('/api/uses')
        .set('Authorization', jwt)
        .expect(400)
  }); */
});

describe("Test GET /users/:userId", () => {
  test("It should return the user called with the id", async() => {
    const jwt = `Bearer ${token}`
    const response = await request(app).get('/api/users/1').set('Authorization', jwt)
    expect(response.body.id).toBe(1)
    expect(response.body.username).toBe('example')
    expect(response.body.email).toBe('example@gmail.com')
  });
  test("It should return an ERROR when the user id is not found", async() => {
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
})

describe("Test PATCH /users/:userId", () => {
  test("It should return the updated user: set fullname & bio", async() => {
    const jwt = `Bearer ${token}`

    const response = await request(app)
      .patch('/api/users/1')
      .set('Authorization', jwt)
      .send({
        fullname: "Example Name",
        bio: "creative bio"
      })
    expect(response.body.id).toBe(1)
    expect(response.body.fullname).toBe("Example Name")
    expect(response.body.bio).toBe("creative bio")
  });
  test("It should return the updated user: set public email", async() => {
    const jwt = `Bearer ${token}`
    const response = await request(app)
      .patch('/api/users/1')
      .set('Authorization', jwt)
      .send({
        emailIsPublic: "true",
      })
    expect(response.body.id).toBe(1)
    expect(response.body.emailIsPublic).toBe(true)
  });
  test("It should return the updated user: set public fullname", async() => {
    const jwt = `Bearer ${token}`
    const response = await request(app)
      .patch('/api/users/1')
      .set('Authorization', jwt)
      .send({
        fullnameIsPublic: "true",
      })
    expect(response.body.id).toBe(1)
    expect(response.body.fullnameIsPublic).toBe(true)
  });
  test("It should return ERROR when userId is not found", async() => {
    const userId = 589
    const jwt = `Bearer ${token}`
    const response = await request(app)
      .patch(`/api/users/${userId}`)
      .set('Authorization', jwt)
      .send({
        fullnameIsPublic: "true",
      })
      expect(response.status).toBe(404)
      expect(response.body).toEqual({
        statusCode: 404, 
        message: `User with ID ${userId} not found`,
        error: "Bad Request"
      })
  });
})

describe("Test DELETE users/:id", () => {
  test("It should return the deleted user", async() => {
    const jwt = `Bearer ${token}`
    const deletedUser = await request(app).delete('/api/users/1').set('Authorization', jwt)
    expect(deletedUser.body.id).toBe(1)

    const response = await request(app).get('/api/users').set('Authorization', jwt)
    expect(response.body).toHaveLength(1)

  });
  /* test("It should return ERROR: not authorized", async() => {
    await request(app)
    .delete('/api/users/1')
    .expect(401)
  }); */
});


describe("Test /api/posts endpoint", () => {
  test("It should get all the posts of a user", async() => {
    app.use(express.json())
    const jwt = `Bearer ${token}`
    await request(app)
      .get('/api/posts').set('Authorization', jwt)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const response = await request(app).get('/api/posts').set('Authorization', jwt)
    expect(response.body).toHaveLength(2)
    expect(response.body[0].authorId).toBe(1)
    expect(response.body[1].authorId).toBe(1)
  }); 
  test("It should create a post with the user id", async() => {
    const jwt = `Bearer ${token}`
    app.use(express.json());
    await request(app)
      .post('/api/posts')
      .set('Authorization', jwt)
      .send({
        title: 'POST #3',
        content: 'Content of the third post',
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const response = await request(app).get('/api/posts').set('Authorization', jwt)
    expect(response.body).toHaveLength(3)
    expect(response.body[response.body.length-1].authorId).toBe(1)

  });
  test('It should delete all posts of a user', async () => {
    const jwt = `Bearer ${token}`;
    await request(app)
      .delete('/api/posts')
      .set('Authorization', jwt)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const response = await request(app).get('/api/posts').set('Authorization', jwt)
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

describe('Test users/:userId/posts/:postId endpoint', () => {
  test('It should get an specific post of a user', async () => {
    const jwt = `Bearer ${token}`;
    app.use(express.json());
    const response = await request(app).get('/api/posts/2').set('Authorization', jwt)
    expect(response.body.title).toBe('POST #2')
  });
  test('It should update an specific post of a user', async () => {
    const jwt = `Bearer ${token}`;
    app.use(express.json());
    const response = await request(app)
      .patch('/api/posts/1')
      .set('Authorization', jwt)
      .send({
        title: 'Edited title',
        content: 'new content',
      })
      .expect(200)
      .expect('Content-Type', /application\/json/);
    expect(response.body.title).toBe('Edited title');
  });
  test('It should delete an specific post of a user', async () => {
    const jwt = `Bearer ${token}`;
    app.use(express.json());
    const response = await request(app)
      .delete('/api/posts/1')
      .set('Authorization', jwt)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    expect(response.body.title).toBe('POST #1');
  });
});


describe("Test /api/posts/:postId/comments endpoint", () => {
  test("It should get all the posts of a user", async() => {
    const jwt = `Bearer ${token}`
    app.use(express.json());
    await request(app)
      .get('/api/posts/2/comments')
      .set('Authorization', jwt)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const response = await request(app).get('/api/posts/2/comments').set('Authorization', jwt)
    expect(response.body).toHaveLength(1)
  });
  /* test("It should create a comment with the user id & post id", async() => {
    const jwt = `Bearer ${token}`
    app.use(express.json());
    await request(app)
      .post('/api/users/1/posts/2/comments')
      .set('Authorization', jwt)
      .send({
        id: 2,
        content: "New comment"
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const response = await request(app).get('/api/users/1/posts/2/comments').set('Authorization', jwt)
    expect(response.body).toHaveLength(2)
  }); */
});
/* 
describe("Test users/:userId/posts/:postId/comments/:commentId endpoint", () => {
  test("It should get an specific comments of a post and user", async() => {
    const jwt = `Bearer ${token}`
    app.use(express.json());
    const response = await request(app).get('/api/users/1/posts/2/comments/1').set('Authorization', jwt)
    expect(response.body.content).toBe('Short comment')
  });
  test("It should update an specific comment of post and user", async() => {
    const jwt = `Bearer ${token}`
    app.use(express.json());
    const response = await request(app)
      .patch('/api/users/1/posts/2/comments/1')
      .set('Authorization', jwt)
      .send({
        content: "edited comment"
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.content).toBe('edited comment')
  });
  test("It should delete an specific comment of a post and user", async() => {
    const jwt = `Bearer ${token}`
    app.use(express.json());
    const response = await request(app)
      .delete('/api/users/1/posts/2/comments/1')
      .set('Authorization', jwt)
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

