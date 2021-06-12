import { Router } from 'express';
import {
  createPost,
  updatePost,
  deletePost,
  likeOrDislikePost,
} from '../controllers/post.controller';
import {
  createComment
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
  .post(asyncHandler(likeOrDislikePost));


router.route('/:postId/comments').post(asyncHandler(createComment));


export { router };
