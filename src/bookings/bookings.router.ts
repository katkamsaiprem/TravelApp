import { Router } from "express";
import { createOrderController, verifyPaymentController } from "./bookings.controller.js";
import { authenticate } from "../middlewares/authenthicate.middleware.js";

const bookingsRouter = Router();

bookingsRouter.post("/create-order", authenticate, createOrderController);
bookingsRouter.post("/verify-payment", authenticate, verifyPaymentController);

export default bookingsRouter;
