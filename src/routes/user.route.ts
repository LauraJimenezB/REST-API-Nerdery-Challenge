import { Router } from 'express';
import {
  getAllUsers,
  getSingleUser,
  updateProfileUser
} from '../controllers/user.controller';
import asyncHandler from 'express-async-handler';

const router: Router = Router();

// /api/users
// router
//   .route('/')
//   .get(asyncHandler(getSingleUser))

// /api/users/:id
router
  .route('/:userId')
  .get(asyncHandler(getSingleUser))
  .patch(asyncHandler(updateProfileUser))

export { router };
