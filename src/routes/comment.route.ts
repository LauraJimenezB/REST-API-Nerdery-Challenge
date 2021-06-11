import { Router } from 'express';
import {
  likeOrDislikeComment,
  getCommentLikes
} from '../controllers/comment.controller';
import asyncHandler from 'express-async-handler';

const router: Router = Router();

// /api/comments/
router
  .route('/:commentId/likes')
  .get(asyncHandler(getCommentLikes))
  .post(asyncHandler(likeOrDislikeComment));

export { router };
