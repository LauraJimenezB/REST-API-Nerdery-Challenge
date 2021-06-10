import { Router } from 'express';
import {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
} from '../controllers/user.controller';

const router: Router = Router();

// /api/users
router
  .route('/')
  .get(getAllUsers)

// /api/users/:id
router
  .route('/:userId')
  .get(getSingleUser)
  .patch(updateUser)
  .delete(deleteUser);

export { router };
