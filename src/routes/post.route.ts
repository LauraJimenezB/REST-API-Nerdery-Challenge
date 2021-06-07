import { Router } from 'express';
import {
  getAllPosts,
} from '../controllers/post.controller';

const router: Router = Router();

// /api/post
router.route('/').get(getAllPosts);


export default router;
