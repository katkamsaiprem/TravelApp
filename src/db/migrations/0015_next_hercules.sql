CREATE TYPE "public"."booking_status" AS ENUM('pending', 'paid', 'failed');--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"venue_id" integer NOT NULL,
	"check_in_date" timestamp with time zone NOT NULL,
	"check_out_date" timestamp with time zone NOT NULL,
	"total_payable_amount" double precision NOT NULL,
	"status" "booking_status" DEFAULT 'pending' NOT NULL,
	"razorpay_order_id" varchar(255),
	"razorpay_payment_id" varchar(255),
	"razorpay_signature" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "whishlist" RENAME TO "wishlist";--> statement-breakpoint
ALTER TABLE "wishlist" RENAME COLUMN "whishlisted_item_id" TO "wishlisted_item_id";--> statement-breakpoint
DROP INDEX "idx_whishlist_userId";--> statement-breakpoint
DROP INDEX "idx_whishlist_itemId";--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_venue_id_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_wishlist_userId" ON "wishlist" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_wishlist_itemId" ON "wishlist" USING btree ("wishlisted_item_id");