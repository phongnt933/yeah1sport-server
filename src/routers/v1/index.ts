import { Router } from 'express';

import userRouters from './user.route';
import fieldRouters from './field.route';
import bookingRouters from './booking.route';

const router = Router();

router.use('/fields', fieldRouters);
router.use('/users', userRouters);
router.use('/bookings', bookingRouters);

export default router;
