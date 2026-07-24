import { db } from "../db/index.js";
import { bookings, InsertBooking } from "../db/schema/bookings.schema.js";
import { eq } from "drizzle-orm";


export const createBookingRepository = async (data: InsertBooking) => {

    const [booking] = await db
        .insert(bookings)
        .values(data)
        .returning();

    return booking;

};


export const updateBookingByOrderIdRepository = async (
    razorpayOrderId: string,
    data: { status: "paid" | "failed"; razorpayPaymentId: string; razorpaySignature: string }
) => {

    const [updatedBooking] = await db
        .update(bookings)
        .set(data)
        .where(eq(bookings.razorpayOrderId, razorpayOrderId))
        .returning();

    return updatedBooking;

};
