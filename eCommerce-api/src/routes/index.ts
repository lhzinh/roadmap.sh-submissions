import { Router } from 'express';
import userRouter from './user.route';
import cartRouter from './cart.route';

const router = Router();

router.use('/users', userRouter);
router.use('/cart', cartRouter);

export default router;
