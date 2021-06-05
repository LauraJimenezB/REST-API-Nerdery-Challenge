import { Router } from 'express';
import { signup, signin, profile } from '../controllers/auth.controller';
const router: Router = Router();

// import { app } from './server';
router.post('/signup', signup);
router.post('/signin', signin);
router.get('/profile', profile);

export { router }