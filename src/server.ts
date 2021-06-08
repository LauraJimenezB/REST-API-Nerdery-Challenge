//import { PrismaClient } from '@prisma/client';
import express, { Application } from 'express'
import morgan from 'morgan'
import { signin, signup, protect } from './helpers/auth'
import { router as userRouter } from './routes/user.route'
import { router as postRouter } from './routes/post.route'
import { router as commentRouter } from './routes/comment.route'
import { getAllPosts } from './controllers/post.controller'
import { getAllComments } from './controllers/comment.controller'

//const prisma = new PrismaClient();

const app: Application = express();

//middlewares
app.use(morgan('dev'));
app.use(express.json());

//routes
app.post('/signup', signup);
app.post('/signin', signin);

app.get('/posts', getAllPosts);
app.get('/comments', getAllComments);

app.use('/api', protect);

app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);

export { app };
