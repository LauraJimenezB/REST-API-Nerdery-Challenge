import { Router } from 'express';
import {
  createPost,
  updatePost,
  deletePost,
  postPostLikes,
} from '../controllers/post.controller';
import {
  createComment,
  updateComment,
  deleteComment,
} from '../controllers/comment.controller';
import asyncHandler from 'express-async-handler';

const router: Router = Router();

// /api/post
router.route('/').post(asyncHandler(createPost));

router
  .route('/:postId')
  .patch(asyncHandler(updatePost))
  .delete(asyncHandler(deletePost));

router.route('/:postId/likes').post(asyncHandler(postPostLikes));

router.route('/:postId/comments').post(asyncHandler(createComment));

router
  .route('/:postId/comments/:commentId')
  .patch(asyncHandler(updateComment))
  .delete(asyncHandler(deleteComment));

export { router };
