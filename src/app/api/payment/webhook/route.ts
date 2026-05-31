import { NextRequest, NextResponse } from "next/server";

// ============================================================================
// RAZORPAY WEBHOOK HANDLER
// ============================================================================
// PURPOSE:
// BACKUP confirmation path for payment events.
// Razorpay sends webhook events when payment status changes.
// This ensures bookings are confirmed even if the client-side
// callback (verifyPaymentAndConfirm) fails (browser crash, network error, etc.)
//
// SETUP:
// 1. In Razorpay Dashboard → Settings → Webhooks → Add New Webhook
// 2. URL: https://yourdomain.com/api/webhook/razorpay
// 3. Secret: Set a webhook secret, store as RAZORPAY_WEBHOOK_SECRET env var
// 4. Events to subscribe: payment.captured, payment.failed
//
// SECURITY:
// - Verify webhook signature on EVERY request before processing
// - Use crypto.timingSafeEqual to prevent timing attacks
// - Return 200 even for unknown events (Razorpay retries on non-2xx)
// ============================================================================

export async function POST(request: NextRequest) {
  // const expectedSignature = crypto
  //   .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
  //   .update(rawBody)
  //   .digest("hex");

  return NextResponse.json({ received: true }, { status: 200 });
}

// NOTE: Disable body parsing — we need the raw body for signature verification.
// In Next.js App Router, request.text() gives us the raw body by default.
// No additional config needed (unlike Pages Router which needs bodyParser: false).

// sample payload from Razorpay webhook:
// {
//   "entity": "event",
//   "account_id": "acc_BFQ7uQEaa7j2z7",
//   "event": "payment.captured",
//   "contains": [
//     "payment"
//   ],
//   "payload": {
//     "payment": {
//       "entity": {
//         "id": "pay_DESlfW9H8K9uqM",
//         "entity": "payment",
//         "amount": 100,
//         "currency": "<currency>",
//         "base_amount": 100,
//         "status": "captured",
//         "order_id": "order_DESlLckIVRkHWj",
//         "invoice_id": null,
//         "international": false,
//         "method": "netbanking",
//         "amount_refunded": 0,
//         "amount_transferred": 0,
//         "refund_status": null,
//         "captured": true,
//         "description": null,
//         "card_id": null,
//         "bank": "HDFC",
//         "wallet": null,
//         "vpa": null,
//         "email": "<email>",
//         "contact": "<phone>",
//         "notes": [],
//         "fee": 2,
//         "tax": 0,
//         "error_code": null,
//         "error_description": null,
//         "error_source": null,
//         "error_step": null,
//         "error_reason": null,
//         "acquirer_data": {
//           "bank_transaction_id": "0125836177"
//         },
//         "created_at": 1567674599
//       }
//     }
//   },
//   "created_at": 1567674606
// }
