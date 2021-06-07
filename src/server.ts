//import { PrismaClient } from '@prisma/client';
import express, { Application } from 'express'
import morgan from 'morgan'
import { signin, signup, profile } from './helpers/auth'
import { router as userRouter } from './routes/user.route'
import { router as postRouter } from './routes/post.route'
import { router as commentRouter } from './routes/comment.route'
import { getPosts } from './controllers/post.controller'

//const prisma = new PrismaClient();

import { signin, signup, protect } from './helpers/auth';

const app: Application = express();

//middlewares
app.use(morgan('dev'));
app.use(express.json());

//routes
app.post('/signup', signup);
app.post('/signin', signin);

app.get('/posts', getPosts);

app.use('/api', profile);

app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);

app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);


export { app };
