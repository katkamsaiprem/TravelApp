import { Request, Response } from "express";
import { AppError } from "../middlewares/globalErrorHandler.middlewares.js";
import { ApiResponse } from "../types/index.js";
import { createOrderService, verifyPaymentService } from "./bookings.service.js";
import { createOrderSchema, verifyPaymentSchema } from "./bookings.schema.zod.js";


export const createOrderController = async (
    req: Request,
    res: Response<ApiResponse>
): Promise<void> => {

    const parseResult = createOrderSchema.safeParse({ body: req.body });
    if (!parseResult.success) {
        throw new AppError(
            parseResult.error.issues.map((e) => e.message).join(", "),
            400
        );
    }

    const userId = (req as any).user?.id || 1; // replaced with auth middleware in production

    const data = await createOrderService({
        userId,
        ...parseResult.data.body,
    });

    res.status(201).json({
        success: true,
        message: "Order created successfully",
        data,
    });

};


export const verifyPaymentController = async (
    req: Request,
    res: Response<ApiResponse>
): Promise<void> => {

    const parseResult = verifyPaymentSchema.safeParse({ body: req.body });
    if (!parseResult.success) {
        throw new AppError(
            parseResult.error.issues.map((e) => e.message).join(", "),
            400
        );
    }

    const updatedBooking = await verifyPaymentService(parseResult.data.body);

    res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        data: updatedBooking,
    });

};
