import { Router } from 'express';
import {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
} from '../controllers/user.controller';

const router: Router = Router();

// /api/user
router.route('/').get(getAllUsers);

// /api/user/:id
router
  .route('/:userId')
  .get(getSingleUser)
  .patch(updateUser)
  .delete(deleteUser);

export { router };
