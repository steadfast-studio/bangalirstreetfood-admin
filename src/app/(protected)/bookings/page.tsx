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
import { Baby, Mail, MessageSquare, PhoneCall, UserRound } from "lucide-react";
import BookingFilters from "../../_components/BookingFilter";
import { cleanupBookings, getBookingDetailsById, getTravelDates } from "@/app/_actions/bookings";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

  const handleCleanup = async () => {
    if(!params?.packageId || !params?.dateId) {
      toast.error("Please select a package and date to clean up bookings");
      return;
    };
    await cleanupBookings(params.packageId, params.dateId).then(()=>{
      toast.success("Pending bookings removed successfully");
    }).catch(()=>{
      toast.error("Failed to remove pending bookings");
    });
  }


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
        <Table>
          <TableCaption>
            <div className="flex justify-between mb-2 items-center px-4">
              <h2>Booking Details</h2>
              <Button variant={"destructive"} 
              // onClick={handleCleanup}
              >Remove Pending Bookings</Button>
            </div>
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Customer Name</TableHead>
              <TableHead>Customer Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Guests</TableHead>
              <TableHead>Additional Request</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment ID</TableHead>
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
                      icon={<Mail size={16} />}
                      color="text-red-600 bg-red-50"
                      data={booking.customerDetails.email}
                    />

                    <ContactItem
                      icon={<PhoneCall size={16} />}
                      color="text-blue-600 bg-blue-50"
                      data={booking.customerDetails.phone}
                    />

                    <ContactItem
                      icon={<MessageSquare size={16} />}
                      color="text-green-600 bg-green-50"
                      data={
                        booking.customerDetails.whatsapp ||
                        booking.customerDetails.phone
                      }
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

                <TableCell>
                  {booking.bookingDetails.additionalRequest}
                </TableCell>

                <TableCell>{booking.paymentDetails.paymentStatus}</TableCell>

                <TableCell>
                  Paid: {booking.paymentDetails.amountPaid}
                  <br />
                  Total: {booking.paymentDetails.totalPayable}
                </TableCell>

                <TableCell>
                  <span className="bg-muted rounded px-1 font-mono text-xs">
                    {booking.paymentDetails.paymentId}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No bookings found.</p>
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
