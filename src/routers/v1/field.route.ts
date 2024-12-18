import { Router } from 'express';

import { fieldControllers as controller } from '../../controllers';
import { fieldValidation as validation } from '../../validations';
import { verifyToken } from '../../middlewares';

const router = Router();

router.route('/find').get(controller.findField);

//
router
  .route('/')
  .get(verifyToken, controller.getAllField)
  .post(verifyToken, validation.createField, controller.createField);

export default router;
