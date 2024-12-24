import { Router } from "express";

import { matchingControllers as controller } from "../../controllers";
import { matchingValidation as validation } from "../../validations";
import { verifyToken } from "../../middlewares";

const router = Router();

router.route("/find").get(verifyToken, controller.getListMatching);

router.route("/:id").post(verifyToken, controller.updateMatching);

router
  .route("/")
  .post(verifyToken, validation.createMatching, controller.createMatching); // tạo matching

export default router;
