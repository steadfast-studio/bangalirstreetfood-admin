import PageTitle from "@/app/_components/PageTitle";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { Baby, PhoneCall, UserRound } from "lucide-react";
import BookingFilters from "../../_components/BookingFilter";
import { getBookingDetailsById, getTravelDates } from "@/app/_actions/bookings";
import RemovePendingBookings from "@/app/_components/RemovePendingBookings";
import { BookingDetailsModal } from "@/app/_components/BookingDetailsModal";

const BookingsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ packageId?: string; dateId?: string }>;
}) => {
  const params = await searchParams;

  const travelDates = await getTravelDates();

  const bookingData = params?.dateId
    ? await getBookingDetailsById(params.dateId)
    : [];

  return (
    <div className="space-y-6">
      <PageTitle title="Bookings" />
      <BookingFilters
        travelDates={travelDates}
        selectedPackage={params?.packageId}
        selectedDate={params?.dateId}
      />
      {/* BOOKINGS TABLE */}
      {bookingData.length > 0 ? (
        <Table className="overflow-x-auto max-w-full">
          <TableCaption>
            <div className="flex justify-between mb-2 items-center px-4">
              <h2 className="font-semibold text-lg">Booking Details</h2>
              {params?.packageId && params?.dateId && (
                <RemovePendingBookings
                  packageId={params?.packageId}
                  dateId={params?.dateId}
                  // If it contains any PENDING bookings, then enable the button, else disable it
                  disabled={
                    !bookingData.some(
                      (booking) =>
                        booking.bookingDetails.status.toLowerCase() ===
                        "pending",
                    )
                  }
                />
              )}
            </div>
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Customer Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Guests</TableHead>
              {/* <TableHead>Additional Request</TableHead> */}
              <TableHead>Payment Status</TableHead>
              <TableHead>Amount Paid</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {bookingData.map((booking, idx) => (
              <TableRow key={booking.paymentDetails.paymentId || idx}>
                <TableCell>
                  {booking.customerDetails.firstName}{" "}
                  {booking.customerDetails.lastName}
                </TableCell>

                {/* CONTACT */}
                <TableCell>
                  <div className="space-y-1">
                    <ContactItem
                      icon={<PhoneCall size={16} />}
                      color="text-blue-600 bg-blue-50"
                      data={booking.customerDetails.phone}
                    />
                  </div>
                </TableCell>

                {/* STATUS */}
                <TableCell>
                  <Badge
                    variant={
                      booking.bookingDetails.status.toLowerCase() ===
                      "confirmed"
                        ? "success"
                        : booking.bookingDetails.status.toLowerCase() ===
                            "pending"
                          ? "warning"
                          : "destructive"
                    }
                  >
                    {booking.bookingDetails.status}
                  </Badge>
                </TableCell>

                {/* GUESTS */}
                <TableCell>
                  <div className="flex flex-col items-center gap-2">
                    <GuestItem
                      icon={<UserRound size={16} />}
                      color="text-indigo-600"
                      count={booking.bookingDetails.noOfAdults}
                    />

                    <GuestItem
                      icon={<Baby size={16} />}
                      color="text-pink-600"
                      count={booking.bookingDetails.noOfChildren}
                    />
                  </div>
                </TableCell>

                {/* <TableCell>
                  {booking.bookingDetails.additionalRequest}
                </TableCell> */}

                <TableCell>{booking.paymentDetails.paymentStatus}</TableCell>

                <TableCell>{booking.paymentDetails.amountPaid}</TableCell>

                <TableCell>
                  <BookingDetailsModal data={booking} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className=" bg-white p-4 rounded-md shadow-sm flex items-center justify-center text-muted-foreground">
          {params?.packageId && params?.dateId
            ? "No bookings found for the selected package and date."
            : "Please select a package and date to view bookings."}
        </p>
      )}
    </div>
  );
};

export default BookingsPage;

function ContactItem({
  icon,
  data,
  color,
}: {
  icon: React.ReactNode;
  data: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-md ${color}`}
      >
        {icon}
      </div>
      <span className="text-muted-foreground text-sm">{data}</span>
    </div>
  );
}

function GuestItem({
  icon,
  count,
  color,
}: {
  icon: React.ReactNode;
  count: number;
  color: string;
}) {
  return (
    <div className="bg-muted/50 flex items-center gap-2 rounded-md px-2 py-1">
      <span className={color}>{icon}</span>
      <span className="text-sm font-medium">{count}</span>
    </div>
  );
}
