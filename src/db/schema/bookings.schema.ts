import { integer, pgEnum, pgTable, serial, timestamp, varchar, doublePrecision } from "drizzle-orm/pg-core";
import { users } from "./users.schema.js";
import { venues } from "./venues.schema.js";

export const bookingStatusEnum = pgEnum("booking_status", ["pending", "paid", "failed"]);

export const bookings = pgTable("bookings", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id),
    venueId: integer("venue_id").notNull().references(() => venues.id),
    startTime: timestamp("start_time", { withTimezone: true }).notNull(),
    endTime: timestamp("end_time", { withTimezone: true }).notNull(),
    totalPayableAmount: doublePrecision("total_payable_amount").notNull(),
    status: bookingStatusEnum("status").default("pending").notNull(),
    razorpayOrderId: varchar("razorpay_order_id", { length: 255 }),
    razorpayPaymentId: varchar("razorpay_payment_id", { length: 255 }),
    razorpaySignature: varchar("razorpay_signature", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

export type SelectBooking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;
