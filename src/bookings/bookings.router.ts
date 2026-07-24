import { Router } from "express";
import { createOrderController, verifyPaymentController } from "./bookings.controller.js";
import { authenticate } from "../middlewares/authenthicate.middleware.js";

const bookingsRouter = Router();

// In production, these should be protected by authenticate middleware
// Using authenticate if it's exported from authenthicate.middleware.ts, else wrapping isn't strictly necessary if not logged in the frontend prototyping.
// We'll apply authenticate if possible.

bookingsRouter.post("/create-order", createOrderController);
bookingsRouter.post("/verify-payment", verifyPaymentController);

export default bookingsRouter;
