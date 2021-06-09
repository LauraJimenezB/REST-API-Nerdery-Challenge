import { Router } from 'express';
import {
  createSinglePost,
  updateSinglePost,
  deleteSinglePost,
  getSinglePost,
  getPosts
} from '../controllers/post.controller';
import {
  createSingleComment,
  getSingleComment,
  updateSingleComment,
  deleteSingleComment,
} from '../controllers/comment.controller';

const router: Router = Router();

// /api/post
router
  .route('/')
  .post(createSinglePost)
  .get(getPosts);

router
  .route('/:postId')
  .patch(updateSinglePost)
  .delete(deleteSinglePost)
  .get(getSinglePost);

router
  .route('/:postId/comments')
  .post(createSingleComment);
  //.get(getComments);

router
  .route('/:postId/comments/:commentId')
  .get(getSingleComment)
  .patch(updateSingleComment)
  .delete(deleteSingleComment)

export { router };
