import { Router } from 'express';
import { createSinglePost, getSinglePost, updateSinglePost, deleteSinglePost } from '../controllers/post.controller';
import { createComment, getSingleComment, updateSingleComment, deleteSingleComment } from '../controllers/comment.controller';

const router: Router = Router();

// /api/post
router
  .route('/')
  .post(createSinglePost)

router
  .route('/:postId')
  .get(getSinglePost)
  .patch(updateSinglePost)
  .delete(deleteSinglePost)

router
  .route('/:postId/comments')
  .post(createComment)

router
  .route('/:postId/comments/:commentId')
  .get(getSingleComment)
  .patch(updateSingleComment)
  .delete(deleteSingleComment)

  export { router }

