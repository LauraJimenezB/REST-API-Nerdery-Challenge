import { Router } from 'express';
import {
  getAllUsers,
  getSingleUser,
} from '../controllers/user.controller';
import asyncHandler from 'express-async-handler';

const router: Router = Router();

// /api/users
router
  .route('/')
  .get(asyncHandler(getSingleUser))

// /api/users/:id
router
  .route('/:userId')
  .get(getSingleUser)

export { router };
