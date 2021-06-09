import { Router } from 'express';
import {
  createSinglePost,
  updateSinglePost,
  deleteSinglePost,
  getSinglePost,
  getPosts
} from '../controllers/post.controller';
import {
  createComment,
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
  .post(createComment);
  //.get(getComments);

router
  .route('/:postId/comments/:commentId')
  .get(getSingleComment)
  .patch(updateSingleComment)
  .delete(deleteSingleComment)

export { router };
