import { Router } from 'express';

import { userControllers as controller } from '../../controllers';
import { userValidation as validation } from '../../validations';
import { verifyToken } from '../../middlewares';

const router = Router();

//

router.route('/forgot-password/:uid').put(controller.forgotPasswordChange);

router
  .route('/change-password/:uid')
  .put(verifyToken, controller.changePassword);

router.route('/login').post(validation.loginUser, controller.loginUser);

router
  .route('/customer')
  .post(validation.createCustomer, controller.createCustomer);

router
  .route('/:id')
  .get(verifyToken, validation.getUser, controller.getCurrentUser)
  .put(verifyToken, validation.updateUser, controller.updateUser)
  .delete(verifyToken, validation.deleteUser, controller.deleteUser);

router
  .route('/')
  .get(verifyToken, validation.getListUsers, controller.getListUser)
  .post(verifyToken, validation.createCMSUser, controller.createCMSUser);

export default router;
