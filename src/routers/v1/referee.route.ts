import { Router } from "express";

import { refereeControllers as controller } from "../../controllers";
import { verifyToken } from "../../middlewares";

const router = Router();


router.route("/capture").post(verifyToken, controller.captureRefereeOrder);

router
  .route("/")
  .get(verifyToken, controller.getListReferee)
  .post(verifyToken, controller.createRefereeOrder);

export default router;
