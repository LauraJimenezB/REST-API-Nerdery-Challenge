//import { PrismaClient } from '@prisma/client';
import express, { Application, NextFunction, Response, Request } from 'express';
import morgan from 'morgan';
import { signin, signup, protect } from './helpers/auth';
import { router as userRouter } from './routes/user.route';
import { router as postRouter } from './routes/post.route';
import { router as commentRouter } from './routes/comment.route';
import { getAllPosts } from './controllers/post.controller';
import { getAllComments } from './controllers/comment.controller';
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
  /* if (ENVIROMENT !== 'development') {
      logger.error(err.message)
      logger.error(err.stack || '')
    } */

  res.status(err.status ?? 500);
  res.json(err);
}

//routes
app.post('/signup', signup);
app.post('/signin', signin);

app.get('/posts', asyncHandler(getAllPosts));

app.get('/comments', asyncHandler(getAllComments));

app.use('/api', asyncHandler(protect));

app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);
app.use(errorHandler);

export { app };
