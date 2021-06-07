import { Router } from 'express';
import { getUsers, getUser, updateUser, deleteUser } from '../controllers/user.controller';

const router: Router = Router();

// /api/user
router
  .route('/')
  .get(getUsers)

// /api/user/:id
router
  .route('/:userId')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser)


export {router}