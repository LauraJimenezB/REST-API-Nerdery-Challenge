import { Router } from 'express';
import { getPosts, deletePosts, createSinglePost, getSinglePost, updateSinglePost, deleteSinglePost } from '../controllers/post.controller';
import { getComments, createComment, getSingleComment, updateSingleComment, deleteSingleComment } from '../controllers/comment.controller';

const router: Router = Router();

// /api/post
router
  .route('/')
  .get(getPosts)
  .delete(deletePosts)
  .post(createSinglePost)

router
  .route('/:postId')
  .get(getSinglePost)
  .patch(updateSinglePost)
  .delete(deleteSinglePost)

router
  .route('/:postId/comments')
  .get(getComments)
/*   .post(createComment)

router
  .route('/:postId/comments/:commentId')
  .get(getSingleComment)
  .patch(updateSingleComment)
  .delete(deleteSingleComment) */

  export { router }