import { z } from "zod";


// Validation rules for creating a booking order

export const createOrderSchema = z.object({
    body: z.object({

        venueId: z
            .number({ error: "venueId must be a number" })
            .int("venueId must be a whole number")
            .positive("venueId must be a positive number"),

        startTime: z
            .string({ error: "startTime is required" })
            .datetime({ message: "startTime must be a valid ISO 8601 datetime string" }),

        endTime: z
            .string({ error: "endTime is required" })
            .datetime({ message: "endTime must be a valid ISO 8601 datetime string" }),

        totalPayableAmount: z
            .number({ error: "totalPayableAmount must be a number" })
            .positive("totalPayableAmount must be a positive number"),

    }),
});


// Validation rules for verifying a Razorpay payment

export const verifyPaymentSchema = z.object({
    body: z.object({

        razorpay_order_id: z
            .string({ error: "razorpay_order_id is required" })
            .min(1, "razorpay_order_id cannot be empty"),

        razorpay_payment_id: z
            .string({ error: "razorpay_payment_id is required" })
            .min(1, "razorpay_payment_id cannot be empty"),

        razorpay_signature: z
            .string({ error: "razorpay_signature is required" })
            .min(1, "razorpay_signature cannot be empty"),

    }),
});


// Export generated TypeScript types so we don't have to write them manually

export type CreateOrderInput = z.infer<typeof createOrderSchema>["body"];

export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>["body"];
