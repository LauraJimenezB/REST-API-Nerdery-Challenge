import { Router } from 'express';
import { getAllComments } from '../controllers/comment.controller';

const router: Router = Router();

// /api/user
router.route('/').get(getAllComments);

export { router };
