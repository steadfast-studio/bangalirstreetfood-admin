"use server";

import db from "@/db";
import { packagesTable } from "@/db/schema";
// ============================================================================
// PAYMENT FLOW OVERVIEW (Razorpay — Partial Payment / Booking Amount Model)
// ============================================================================
//
// This project uses a PARTIAL PAYMENT model:
// - User pays a bookingAmount (>= minBookingAmount × totalParticipants) upfront
// - Remaining amount (totalAmount - bookingAmount) is collected later
// - Razorpay order is created for bookingAmount ONLY, not full totalAmount
//
// No authentication required — guest checkout.
//
// FLOW:
//   1. Frontend calls createBooking(formData)
//   2. Server validates, creates PENDING booking, creates Razorpay order
//   3. Frontend opens Razorpay Checkout with returned order details
//   4. On success, Razorpay returns payment_id + order_id + signature to client
//   5. Frontend calls verifyPaymentAndConfirm() with those values (PRIMARY path)
//   6. Razorpay webhook hits /api/webhook/razorpay (BACKUP confirmation path)
//   7. Frontend redirects to /booking/success?bookingId=XXX
//
// IMPORTANT ARCHITECTURE NOTES:
// - verifyPaymentAndConfirm() is the PRIMARY confirmation (client callback)
// - Webhook at /api/webhook/razorpay is the BACKUP (handles edge cases:
//   browser crash, network failure, user closing tab after payment)
// - Both paths MUST be idempotent
// - Neon HTTP driver does NOT support FOR UPDATE row locks.
//   Use neon WebSocket driver (Pool + ws) for transactions, OR use
//   advisory locks / atomic INSERT...SELECT for concurrency safety.
// ============================================================================

import { bookingSchema, type IBookingFormData } from "@/types/booking";
import { eq } from "drizzle-orm";

export const createBooking = async (
  packageId: string,
  formData: IBookingFormData,
) => {
  // PURPOSE:
  // Create a booking in PENDING state and initiate a Razorpay order
  // for the bookingAmount (partial payment), not the full trip cost.
  //
  // ACCEPTS:
  // - packageId: string (UUID of the package)
  // - formData: IBookingFormData (validated by Zod on frontend, RE-VALIDATE here)
  // Step 1: Server-side input validation (NEVER trust frontend)
  // - Re-validate formData using bookingSchema.safeParse()
  const formDataResult = bookingSchema.safeParse(formData);
  if (!formDataResult.success) {
    throw new Error("Invalid booking data");
  }
  // - Validate packageId is non-empty and valid UUID format
  if (
    !packageId ||
    !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
      packageId,
    )
  ) {
    throw new Error("Invalid package ID");
  }
  // - Validate formData.travelDate is a valid date string AND is in the future
  const travelDate = new Date(formData.travelDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of today for accurate comparison
  if (isNaN(travelDate.getTime()) || travelDate < today) {
    throw new Error("Invalid travel date");
  }
  // - Validate formData.noOfAdults >= 1
  if (formData.noOfAdults < 1) {
    throw new Error("At least one adult must be included");
  }
  // - Validate formData.noOfChildren >= 0
  if (formData.noOfChildren < 0) {
    throw new Error("Number of children cannot be negative");
  }
  // - Compute totalParticipants = noOfAdults + noOfChildren
  const totalParticipants = formData.noOfAdults + formData.noOfChildren;
  // - Ensure totalParticipants > 0
  if (totalParticipants <= 0) {
    throw new Error("Total participants must be positive");
  }
  // - Validate contact fields:
  //     primaryContactFirstName, primaryContactLastName (non-empty)
  //     primaryContactEmail (valid email)
  //     primaryContactPhone (10–15 digits)
  //     primaryContactWhatsApp (10–13 digits)
  if (
    !formData.primaryContactFirstName ||
    !formData.primaryContactLastName ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.primaryContactEmail) ||
    !/^\d{10,15}$/.test(formData.primaryContactPhone) ||
    !/^\d{10,13}$/.test(formData.primaryContactWhatsApp)
  ) {
    throw new Error("Invalid contact information");
  }
  // - Validate foodPreference is one of: "Veg", "Non-Veg", "Mixed"
  if (!["Veg", "Non-Veg", "Mixed"].includes(formData.foodPreference)) {
    throw new Error("Invalid food preference");
  }
  // Step 2: Fetch package from DB (NO row lock needed yet)
  // - SELECT id, title, pricePerAdult, pricePerChild, maxParticipants,
  //         minBookingAmount, availableDates, status
  //   FROM packages WHERE id = ?
  // - Reject if not found or status !== "ACTIVE"
  // - Reject if formData.travelDate is NOT in package.availableDates
  const packageData = await db
    .select()
    .from(packagesTable)
    .where(eq(packagesTable.id, packageId)); // Implement this DB function
  console.log(packageData);

  // Step 3: Recalculate pricing on server (NEVER trust frontend amounts)
  // - totalAmount = (noOfAdults × pricePerAdult) + (noOfChildren × pricePerChild)
  // - minRequired = minBookingAmount × totalParticipants
  // - Validate formData.bookingAmount >= minRequired
  // - Validate formData.bookingAmount <= totalAmount (can't overpay)
  // - dueAmount = totalAmount - formData.bookingAmount
  // Step 4: Start SQL transaction
  // NOTE: Requires Neon WebSocket driver (Pool) for transaction support.
  //       The HTTP driver (neon()) does NOT support multi-statement transactions.
  //       See: https://neon.tech/docs/serverless/serverless-driver#pool-and-client
  // Step 5: Cleanup expired PENDING bookings for THIS package + date
  // - UPDATE bookings SET status = 'FAILED', payment_status = 'EXPIRED'
  //   WHERE packageId = ? AND selectedDate = ? AND status = 'PENDING'
  //         AND created_at < NOW() - INTERVAL '15 minutes'
  // NOTE: No seat restoration needed — availability is calculated dynamically.
  // Step 6: Calculate seats already reserved (WITHIN transaction)
  // - SELECT COALESCE(SUM(participantsCount), 0) AS reservedSeats
  //   FROM bookings
  //   WHERE packageId = ? AND selectedDate = ?
  //         AND status IN ('PENDING', 'CONFIRMED')
  //
  // IMPORTANT: Include PENDING bookings to prevent overselling during
  //   concurrent booking attempts. The 15-min expiry in Step 5 ensures
  //   abandoned PENDING bookings eventually release seats.
  // Step 7: Check availability
  // - If (reservedSeats + totalParticipants > maxParticipants):
  //     → Rollback transaction
  //     → Return { success: false, error: "SOLD_OUT" }
  // Step 8: Generate unique booking reference
  // - Format: BSF-YYYYMMDD-XXXX (e.g., BSF-20260302-A3F7)
  // - Use date portion + 4-char random hex to minimize collisions
  // - Optionally check uniqueness in DB before insert
  // Step 9: Create booking record
  // - INSERT INTO bookings:
  //     id:                      generated UUID
  //     bookingReference:        BSF-YYYYMMDD-XXXX
  //     packageId:               packageId
  //     selectedDate:            formData.travelDate
  //     noOfAdults:              formData.noOfAdults
  //     noOfChildren:            formData.noOfChildren
  //     participantsCount:       totalParticipants
  //     totalAmount:             totalAmount (full trip cost)
  //     bookingAmount:           formData.bookingAmount (amount being paid now)
  //     dueAmount:               dueAmount (remaining to pay later)
  //     primaryContactFirstName: formData.primaryContactFirstName
  //     primaryContactLastName:  formData.primaryContactLastName
  //     primaryContactEmail:     formData.primaryContactEmail
  //     primaryContactPhone:     formData.primaryContactPhone
  //     primaryContactWhatsApp:  formData.primaryContactWhatsApp
  //     foodPreference:          formData.foodPreference
  //     additionalInformation:   formData.additionalInformation (nullable)
  //     status:                  "PENDING"
  //     paymentStatus:           "INITIATED"
  //     createdAt:               NOW()
  // Step 10: Create Razorpay Order (AFTER insert, BEFORE commit)
  // - Use Razorpay Node SDK: new Razorpay({ key_id, key_secret })
  // - razorpay.orders.create({
  //     amount: formData.bookingAmount × 100  ← PAISE, NOT totalAmount!
  //     currency: "INR",
  //     receipt: bookingReference,
  //     notes: {
  //       bookingId: booking.id,
  //       packageId: packageId,
  //       customerEmail: formData.primaryContactEmail,
  //       customerPhone: formData.primaryContactPhone,
  //     }
  //   })
  // - Update booking record: SET razorpayOrderId = razorpayOrder.id
  //
  // ERROR HANDLING: If Razorpay API fails → rollback transaction, return error.
  // Step 11: Commit SQL transaction
  // Step 12: Return to frontend
  // return {
  //   success: true,
  //   bookingId: booking.id,
  //   bookingReference: bookingReference,
  //   razorpayOrderId: razorpayOrder.id,
  //   razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  //   amount: formData.bookingAmount × 100,  ← in paise
  //   currency: "INR",
  //   prefill: {
  //     name: `${formData.primaryContactFirstName} ${formData.primaryContactLastName}`,
  //     email: formData.primaryContactEmail,
  //     contact: formData.primaryContactPhone,
  //   }
  // }
};

export const verifyPaymentAndConfirm = async (
  bookingId: string,
  razorpayPaymentId: string,
  razorpayOrderId: string,
  razorpaySignature: string,
) => {
  // PURPOSE:
  // PRIMARY confirmation path — called from frontend after Razorpay Checkout
  // completes successfully. Verifies payment signature and confirms booking.
  //
  // WHEN CALLED:
  // - From Razorpay Checkout's handler.on("payment.success", ...) callback
  // - Frontend passes razorpay_payment_id, razorpay_order_id, razorpay_signature
  //
  // SECURITY:
  // - Signature verification prevents forged payment confirmations
  // - Idempotent: safe to call multiple times
  // - Does nothing if already CONFIRMED
  // Step 1: Validate inputs
  // - All four params must be non-empty strings
  // - bookingId should be valid UUID format
  // Step 2: Fetch booking by bookingId
  // - If not found → return { success: false, error: "BOOKING_NOT_FOUND" }
  // - If status === "CONFIRMED" → return { success: true } (idempotent exit)
  // - If status === "FAILED" → return { success: false, error: "BOOKING_EXPIRED" }
  // - Ensure booking.razorpayOrderId === razorpayOrderId (order mismatch = fraud)
  // Step 3: Verify Razorpay signature (CRITICAL — prevents spoofing)
  // - Construct expected signature:
  //     const body = razorpayOrderId + "|" + razorpayPaymentId;
  //     const expectedSignature = crypto
  //       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
  //       .update(body)
  //       .digest("hex");
  // - Compare: expectedSignature === razorpaySignature
  //   (use crypto.timingSafeEqual to prevent timing attacks)
  // - If mismatch → DO NOT update booking, return { success: false, error: "INVALID_SIGNATURE" }
  // Step 4: (Optional but recommended) Verify payment amount via Razorpay API
  // - Fetch payment: razorpay.payments.fetch(razorpayPaymentId)
  // - Ensure payment.amount === booking.bookingAmount × 100 (paise)
  // - Ensure payment.currency === "INR"
  // - Ensure payment.status === "captured" or "authorized"
  //   (If using auto-capture, it will be "captured")
  //   (If manual capture, you need to capture it here)
  // Step 5: Update booking record (within transaction)
  // - SET status = "CONFIRMED"
  // - SET paymentStatus = "SUCCESS"
  // - SET razorpayPaymentId = razorpayPaymentId
  // - SET razorpaySignature = razorpaySignature
  // - SET paymentConfirmedAt = NOW()
  // - Commit transaction
  // Step 6: Return success
  // return {
  //   success: true,
  //   bookingId: booking.id,
  //   bookingReference: booking.bookingReference,
  //   status: "CONFIRMED"
  // }
  // FUTURE ENHANCEMENTS:
  // - Send confirmation email (use a queue to avoid blocking response)
  // - Send WhatsApp confirmation
  // - Generate PDF receipt
};

export const rejectBooking = async (bookingId: string) => {
  // PURPOSE:
  // Mark booking as FAILED when payment fails or is explicitly rejected.
  // Called from frontend when Razorpay Checkout's payment.failed event fires.
  // Step 1: Validate bookingId (non-empty, valid UUID)
  // Step 2: Fetch booking by bookingId
  // - If not found → exit safely (no-op)
  // - If status === "CONFIRMED" → DO NOTHING (NEVER downgrade a confirmed booking)
  // - If status === "FAILED" → exit (already handled)
  // Step 3: Update booking (no transaction needed for single update):
  // - SET status = "FAILED"
  // - SET paymentStatus = "FAILED"
  // - SET updatedAt = NOW()
  // NOTE:
  // No seat restoration needed — availability is computed dynamically
  // from bookings with status IN ('PENDING', 'CONFIRMED').
  // A FAILED booking is automatically excluded from seat counts.
};

export const checkPackageAvailability = async (packageId: string) => {
  // PURPOSE:
  // Return availability status for each date of a package.
  // Used on package detail page and booking form date picker.
  // Step 1: Fetch package by packageId
  // - Get maxParticipants and availableDates
  // - Reject if not found or not ACTIVE
  // Step 2: Fetch reserved seats grouped by date
  // - SELECT selectedDate, COALESCE(SUM(participantsCount), 0) AS reservedSeats
  //   FROM bookings
  //   WHERE packageId = ? AND status IN ('PENDING', 'CONFIRMED')
  //   GROUP BY selectedDate
  //
  // IMPORTANT: Include PENDING here for DISPLAY purposes too.
  // This prevents showing "AVAILABLE" when seats are held by pending payments.
  // Consistent with createBooking Step 6.
  // Step 3: For each availableDate:
  // - remainingSeats = maxParticipants - reservedSeats (default 0 if no bookings)
  // Step 4: Determine status per date:
  // - remainingSeats <= 0         → "SOLD_OUT"
  // - remainingSeats <= 20% of max → "LIMITED"
  // - else                        → "AVAILABLE"
  // Step 5: Filter out past dates (date < today)
  // Step 6: Return:
  // [
  //   { date: "2026-03-10", status: "AVAILABLE", remainingSeats: 8 },
  //   { date: "2026-03-17", status: "LIMITED", remainingSeats: 2 },
  //   { date: "2026-03-24", status: "SOLD_OUT", remainingSeats: 0 },
  // ]
};

export const cleanupExpiredBookings = async () => {
  // PURPOSE:
  // Expire old PENDING bookings system-wide.
  // Should be called:
  //   - As a cron job (e.g., every 5 minutes via Vercel Cron or external scheduler)
  //   - Also called inline during createBooking (Step 5) for the specific package+date
  //
  // IMPORTANT: This is a system-wide cleanup. createBooking does targeted cleanup.
  // Step 1: Update all expired pending bookings:
  // UPDATE bookings
  //   SET status = 'FAILED', paymentStatus = 'EXPIRED', updatedAt = NOW()
  //   WHERE status = 'PENDING'
  //     AND createdAt < NOW() - INTERVAL '15 minutes'
  // Step 2: Return count of affected rows (for logging/monitoring)
  //
  // CRON SETUP (Vercel):
  // Add to vercel.json:
  // {
  //   "crons": [{
  //     "path": "/api/cron/cleanup-bookings",
  //     "schedule": "*/5 * * * *"
  //   }]
  // }
  // Create /api/cron/cleanup-bookings/route.ts that calls this function
  // and verifies CRON_SECRET header for security.
};

export const getPaymentSuccessData = async (paymentId: string) => {};
