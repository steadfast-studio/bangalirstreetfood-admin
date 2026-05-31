import db from "@/db";
import { bookingsTable, packagesTable, travelDatesTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getTravelDates = async () => {
  const query = db
    .select({
      id: travelDatesTable.id,
      date: travelDatesTable.startDate,
      packageName: packagesTable.packageTitle,
    })
    .from(travelDatesTable)
    .innerJoin(packagesTable, eq(travelDatesTable.packageId, packagesTable.id))
    .orderBy(packagesTable.packageTitle);

  if (!query) {
    throw new Error("Failed to fetch travel dates");
  }

  return query;
};

export const getBookings = async (page: number, pageSize?: number) => {
  const limit = pageSize || 10;
  const offset = (page - 1) * limit;

  // const response = await fetch(`/api/admin/bookings?limit=${limit}&offset=${offset}`);
  const query = db
    .select({
      id: bookingsTable.id,
      customerInformation: {
        firstName: bookingsTable.customerFirstName,
        lastName: bookingsTable.customerLastName,
        email: bookingsTable.customerEmail,
        phone: bookingsTable.customerPhone,
        whatsapp: bookingsTable.customerWhatsapp,
        additionalRequest: bookingsTable.additionalRequest,
      },
      bookingDetails: {
        noOfAdults: bookingsTable.noOfAdults,
        noOfChildren: bookingsTable.noOfChildren,
        amountPaid: bookingsTable.amountPaid,
        totalPayable: bookingsTable.totalAmountPayable,
      },
      packageDetails: {},
    })
    .from(bookingsTable)
    .innerJoin(
      travelDatesTable,
      eq(bookingsTable.travelDateId, travelDatesTable.id),
    )
    .limit(limit)
    .offset(offset)
    .then((rows) => {
      return rows;
    })
    .catch(() => {
      throw new Error("Failed to fetch bookings");
    });

  return query;
};

export const getBookingDetailsById = async (travelDateId: string) => {
  const query = await db
    .select({
      customerDetails: {
        firstName: bookingsTable.customerFirstName,
        lastName: bookingsTable.customerLastName,
        email: bookingsTable.customerEmail,
        phone: bookingsTable.customerPhone,
        whatsapp: bookingsTable.customerWhatsapp,
      },
      bookingDetails: {
        noOfAdults: bookingsTable.noOfAdults,
        noOfChildren: bookingsTable.noOfChildren,
        additionalRequest: bookingsTable.additionalRequest,
        bookedOn: bookingsTable.createdAt,
        status: bookingsTable.status,
      },
      paymentDetails: {
        amountPaid: bookingsTable.amountPaid,
        totalPayable: bookingsTable.totalAmountPayable,
        paymentStatus: bookingsTable.paymentStatus,
        paymentId: bookingsTable.razorpayPaymentId,
      },
    })
    .from(bookingsTable)
    .where(eq(bookingsTable.travelDateId, travelDateId));

  return query;
};
