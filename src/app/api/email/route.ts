import { EmailTemplate } from "@/components/email/booking-confirmation";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const {
      bookingId,
      secretToken,
      customerEmail,
    }: {
      bookingId: string;
      secretToken: string;
      customerEmail: string;
    } = await req.json();

    if (!bookingId || !secretToken || !customerEmail) {
      return NextResponse.json(
        { error: "Missing bookingId or secretToken" },
        { status: 400 },
      );
    }

    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: customerEmail,
      subject: "Booking Confirmation - Bangalir Street Food",
      react: EmailTemplate({ bookingId, secretToken }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
