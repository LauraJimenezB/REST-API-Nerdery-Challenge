import { Router } from 'express';
import { getUsers, getUser } from '../controllers/user.controller';

const router: Router = Router();

// /api/user
router
  .route('/')
  .get(getUsers)

// /api/user/:id
router
  .route('/:id')
  .get(getUser);

export default router;
