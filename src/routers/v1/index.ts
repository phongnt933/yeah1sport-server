import { Router } from "express";

import userRouters from "./user.route";
import fieldRouters from "./field.route";
import bookingRouters from "./booking.route";
import teamRouters from "./team.route";

const router = Router();

router.use("/fields", fieldRouters);
router.use("/users", userRouters);
router.use("/bookings", bookingRouters);
router.use("/teams", teamRouters);

export default router;
