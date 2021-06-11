//import { PrismaClient } from '@prisma/client';
<<<<<<< HEAD
import express, { Application, NextFunction, Response, Request } from 'express';
import morgan from 'morgan';
import { signin, signup, protect } from './helpers/auth';
import { router as userRouter } from './routes/user.route';
import { router as postRouter } from './routes/post.route';
import { router as commentRouter } from './routes/comment.route';
import { getAllPosts } from './controllers/post.controller';
import { getAllComments } from './controllers/comment.controller';
=======
import express, { Application, NextFunction, Request, Response } from 'express'
import morgan from 'morgan'
import { signup, signin, protect } from './controllers/auth.controller'
import { router as userRouter } from './routes/user.route'
import { router as postRouter } from './routes/post.route'
import { router as commentRouter } from './routes/comment.route'
import { getAllPosts } from './controllers/post.controller'
import { getAllComments } from './controllers/comment.controller'
>>>>>>> 2d2bdb459a1ad2071e65919727fc7f6bf0af0b4a
import asyncHandler from 'express-async-handler';
import { HttpError } from 'http-errors';

const app: Application = express();

//middlewares
app.use(morgan('dev'));
app.use(express.json());

function errorHandler(
  err: HttpError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): void {
  res.status(err.status ?? 500);
  res.json(err);
}

//routes
app.post('/signup', asyncHandler(signup));
app.post('/signin', asyncHandler(signin));

app.get('/posts', asyncHandler(getAllPosts));

app.get('/comments', asyncHandler(getAllComments));

app.use('/api', asyncHandler(protect));

app.use('/api/users', userRouter);
app.use('/api/posts', asyncHandler(postRouter));
app.use('/api/comments', commentRouter);
app.use(errorHandler);

app.use(errorHandler)

export { app };
