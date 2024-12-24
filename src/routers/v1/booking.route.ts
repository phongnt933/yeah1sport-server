import { Router } from "express";

import { bookingControllers as controller } from "../../controllers";
import { bookingValidation as validation } from "../../validations";
import { verifyToken } from "../../middlewares";

const router = Router();

router
  .route("/create-booking")
  .post(verifyToken, validation.createBooking, controller.createBooking); // tạo booking -> tạo order id

router
  .route("/capture-booking")
  .post(verifyToken, validation.captureBooking, controller.updateBooking); // Xác nhận trạng thái order => cập nhật booking

router.route("/").get(verifyToken, controller.getListBooking); // Lấy danh sách booking

export default router;
