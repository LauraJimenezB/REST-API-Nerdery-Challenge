import { Router } from 'express';
import {
  /* getUserComments,  */ postCommentLikes,
} from '../controllers/comment.controller';
import asyncHandler from 'express-async-handler';

const router: Router = Router();

// /comments
/* router
  .route('/').get(asyncHandler(getUserComments)); */

router.route('/:commentId/likes').post(asyncHandler(postCommentLikes));

export { router };
