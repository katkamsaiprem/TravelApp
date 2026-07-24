import Razorpay from "razorpay";
import crypto from "crypto";
import { env } from "../config/env.js";
import { AppError } from "../middlewares/globalErrorHandler.middlewares.js";
import { CreateOrderInput, VerifyPaymentInput } from "./bookings.schema.zod.js";
import {
    createBookingRepository,
    updateBookingByOrderIdRepository,
} from "./bookings.repository.js";


const razorpay = new Razorpay({
    key_id: env.RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_KEY_SECRET,
});


export const createOrderService = async (dto: CreateOrderInput & { userId: number }) => {

 
    const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(dto.totalPayableAmount * 100), // amount in smallest currency unit paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
    });

   
    const booking = await createBookingRepository({
        userId: dto.userId,
        venueId: dto.venueId,
        checkInDate: new Date(dto.checkInDate),
        checkOutDate: new Date(dto.checkOutDate),
        totalPayableAmount: dto.totalPayableAmount,
        status: "pending",
        razorpayOrderId: razorpayOrder.id,
    });

    return {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        bookingId: booking.id,
    };

};


export const verifyPaymentService = async (dto: VerifyPaymentInput) => {

    
    const body = dto.razorpay_order_id + "|" + dto.razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

    if (expectedSignature !== dto.razorpay_signature) {
        throw new AppError("Invalid payment signature", 400);
    }

    
    const updatedBooking = await updateBookingByOrderIdRepository(
        dto.razorpay_order_id,
        {
            status: "paid",
            razorpayPaymentId: dto.razorpay_payment_id,
            razorpaySignature: dto.razorpay_signature,
        }
    );

    if (!updatedBooking) {
        throw new AppError("Booking not found for this order", 404);
    }

    return updatedBooking;

};
