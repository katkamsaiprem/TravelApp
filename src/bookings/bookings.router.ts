import { Router } from "express";
import { createOrderController, verifyPaymentController } from "./bookings.controller.js";

const bookingsRouter = Router();

// TODO: add authenticate middleware once frontend auth flow is wired up
// bookingsRouter.post("/create-order", authenticate, createOrderController);
// bookingsRouter.post("/verify-payment", authenticate, verifyPaymentController);

bookingsRouter.post("/create-order", createOrderController);
bookingsRouter.post("/verify-payment", verifyPaymentController);

export default bookingsRouter;
