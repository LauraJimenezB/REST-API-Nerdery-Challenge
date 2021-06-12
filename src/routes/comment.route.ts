import { Router } from 'express';
import {
  likeOrDislikeComment,
  getComment,
  updateComment,
  deleteComment,
} from '../controllers/comment.controller';
import asyncHandler from 'express-async-handler';

const router: Router = Router();

// /api/comments/
router
  .route('/:commentId')
  .get(asyncHandler(getComment))
  .patch(asyncHandler(updateComment))
  .delete(asyncHandler(deleteComment));

router
  .route('/:commentId/likes')
  .post(asyncHandler(likeOrDislikeComment));

export { router };
