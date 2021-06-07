import { Router } from 'express';
import {
  getPosts,
  deletePosts,
  createSinglePost,
  getSinglePost,
  updateSinglePost,
  deleteSinglePost,
} from '../controllers/post.controller';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/user.controller';

const router: Router = Router();

// /api/user
router.route('/').get(getUsers);

// /api/user/:id
router.route('/:userId').get(getUser).patch(updateUser).delete(deleteUser);

router
  .route('/:userId/posts')
  .get(getPosts)
  .delete(deletePosts)
  .post(createSinglePost);

router
  .route('/:userId/posts/:postId')
  .get(getSinglePost)
  .delete(deleteSinglePost)
  .patch(updateSinglePost);

export default router;
