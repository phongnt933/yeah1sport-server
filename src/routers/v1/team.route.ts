import { Router } from "express";

import { teamControllers as controller } from "../../controllers";
import { teamValidation as validation } from "../../validations";
import { verifyToken } from "../../middlewares";

const router = Router();

router
  .route("/create")
  .post(verifyToken, validation.createTeam, controller.createTeam);

router.route("/all").get(verifyToken, controller.getListTeam);

router
  .route("/:id")
  .put(verifyToken, controller.updateTeam)
  .delete(verifyToken, controller.deletedTeam);

router.route("/").get(verifyToken, controller.getListTeamUser);

export default router;
