import { Router } from 'express';
import { jwtMiddleware } from '../middlewares/auth.middleware';
import { userController } from '../controllers/user.controller';

const router = Router();

router.post('/login', userController.signIn);
router.post('/signup', userController.signUp);
router.get('/current-user', jwtMiddleware, userController.getCurrentUser);

export default router;
