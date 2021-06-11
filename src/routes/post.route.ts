import { Router } from 'express';
import {
  createPost,
  updatePost,
  deletePost,
  getPostLikes,
  likeOrDislikePost,
} from '../controllers/post.controller';
import {
  createComment,
  getComment,
  updateComment,
  deleteComment,
} from '../controllers/comment.controller';
import asyncHandler from 'express-async-handler';

const router: Router = Router();

// /api/posts/
router.route('/').post(asyncHandler(createPost));

router
  .route('/:postId')
  .patch(asyncHandler(updatePost))
  .delete(asyncHandler(deletePost));

router
  .route('/:postId/likes')
  .get(asyncHandler(getPostLikes))
  .post(asyncHandler(likeOrDislikePost));


router.route('/:postId/comments').post(asyncHandler(createComment));

router
  .route('/:postId/comments/:commentId')
  .get(asyncHandler(getComment))
  .patch(asyncHandler(updateComment))
  .delete(asyncHandler(deleteComment));

export { router };
