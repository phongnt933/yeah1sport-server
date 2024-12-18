import { Router } from 'express';

import { bookingControllers as controller } from '../../controllers';
import { bookingValidation as validation } from '../../validations';
import { verifyToken } from '../../middlewares';

const router = Router();

router
  .route('/create-booking')
  .post(verifyToken, validation.createBooking, controller.createBooking);

router
  .route('/capture-booking')
  .post(verifyToken, validation.captureBooking, controller.updateBooking);

router.route('/').get(verifyToken, controller.getListBooking);

export default router;
