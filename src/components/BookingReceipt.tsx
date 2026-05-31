"use client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import Link from "next/link";
import { Info, Copy, Check } from "lucide-react";
import { useState } from "react";

export const metaData = {
  title: "Booking Receipt - Bangalir Street Food",
  description:
    "View your booking receipt with details of your package, travel date, and payment summary. Thank you for choosing Bangalir Street Food!",
};

const BookingReceipt = ({
  bookingData,
}: {
  bookingData: {
    bookingId: string;
    packageTitle: string;
    duration: string;
    travelDate: string;
    noOfAdults: number;
    noOfChildren: number;
    pricePerAdult: number;
    pricePerChild: number;
    bookingAmount: number;
    primaryContactName: string;
    primaryContactEmail: string;
    primaryContactPhone: string;
  };
}) => {
  const totalAmount =
    bookingData.noOfAdults * bookingData.pricePerAdult +
    bookingData.noOfChildren * bookingData.pricePerChild;
  const dueAmount = totalAmount - bookingData.bookingAmount;
  const formattedTravelDate = new Date(
    bookingData.travelDate,
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(bookingData.bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 5000);
  };
  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="w-full max-w-2xl bg-white shadow-lg print:border-2 print:shadow-none">
      {/* Success Header */}
      <CardHeader className="pb-2 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 print:bg-green-200">
          <svg
            className="h-8 w-8 text-green-600 print:hidden"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <CardTitle className="text-2xl font-bold text-green-700">
          Booking Confirmed!
        </CardTitle>
        {/* <p className="text-sm text-gray-500 mt-1">
          Thank you for your booking. A confirmation email has been sent to{" "}
          <span className="font-medium text-gray-700">
            {bookingData.primaryContactEmail}
          </span>
        </p> */}
      </CardHeader>

      <CardContent className="space-y-6 px-6 pb-8">
        {/* Booking ID */}
        <div className="mb-2 px-2 text-sm text-yellow-600 print:hidden">
          <Info className="mr-1 inline h-4 w-4" />
          Please save this Booking ID for future reference.
        </div>
        <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 print:bg-gray-100">
          <span className="text-sm text-gray-500">Booking ID</span>

          <div className="flex items-center gap-2">
            <span className="font-mono font-semibold text-gray-800">
              {bookingData.bookingId}
            </span>

            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4 text-gray-500" />
              )}
            </Button>
          </div>
        </div>

        {/* Package Info */}
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">
              {bookingData.packageTitle}
            </h3>
            <Badge variant="secondary" className="bg-teal-100 text-teal-700">
              {bookingData.duration}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Travel Date:{" "}
            <span className="font-medium text-gray-700">
              {formattedTravelDate}
            </span>
          </p>
        </div>

        <Separator />

        {/* Traveller Details */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">
            Contact Details
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500">Name</p>
              <p className="font-medium text-gray-800">
                {bookingData.primaryContactName}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Phone</p>
              <p className="font-medium text-gray-800">
                {bookingData.primaryContactPhone}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-500">Email</p>
              <p className="font-medium text-gray-800">
                {bookingData.primaryContactEmail}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Pricing Summary */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">
            Payment Summary
          </h4>
          <div className="space-y-3 rounded-xl border border-teal-200 bg-teal-50/40 p-4">
            {/* Guest breakdown */}
            <div className="grid grid-cols-3 gap-3 print:hidden">
              <SummaryCard
                label="Adults"
                value={String(bookingData.noOfAdults)}
              />
              <SummaryCard
                label="Children"
                value={String(bookingData.noOfChildren)}
              />
              <SummaryCard label="Travel Date" value={formattedTravelDate} />
            </div>

            {/* Line items */}
            <div className="space-y-1.5 text-sm">
              {bookingData.noOfAdults > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>
                    {bookingData.noOfAdults} Adult
                    {bookingData.noOfAdults > 1 ? "s" : ""} × ₹
                    {bookingData.pricePerAdult.toLocaleString("en-IN")}
                  </span>
                  <span>
                    ₹
                    {(
                      bookingData.noOfAdults * bookingData.pricePerAdult
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
              )}
              {bookingData.noOfChildren > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>
                    {bookingData.noOfChildren} Child
                    {bookingData.noOfChildren > 1 ? "ren" : ""} × ₹
                    {bookingData.pricePerChild.toLocaleString("en-IN")}
                  </span>
                  <span>
                    ₹
                    {(
                      bookingData.noOfChildren * bookingData.pricePerChild
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
              )}
            </div>

            <Separator className="bg-teal-200" />

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">Total Amount</span>
              <span className="text-xl font-bold text-teal-600">
                ₹{totalAmount.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Payment split */}
            <div className="space-y-1.5 rounded-lg border border-teal-100 bg-white/70 p-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid</span>
                <span className="font-medium text-green-600">
                  ₹{bookingData.bookingAmount.toLocaleString("en-IN")}
                </span>
              </div>
              {dueAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Due Later</span>
                  <span className="font-medium text-gray-900">
                    ₹{dueAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator className="print:hidden" />

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row print:hidden">
          <Button onClick={handlePrint} className="flex-1">
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z"
              />
            </svg>
            Download Receipt
          </Button>
          <Button variant="outline" className="flex-1" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>

        <p className="text-center text-sm font-semibold text-red-500 print:hidden">
          If you face any issues, please contact us at{" "}
          <a href="tel:+919876543210" className="underline">
            +91 98765 43210
          </a>
        </p>
      </CardContent>
    </Card>
  );
};
function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-teal-100 bg-white/70 px-3 py-2 text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
  );
}
export default BookingReceipt;
