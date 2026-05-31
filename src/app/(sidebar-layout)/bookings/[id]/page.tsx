import { getBookingDetailsById } from "@/app/_actions/bookings";
import PageTitle from "@/app/_components/PageTitle";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Baby, Mail, MessageSquare, PhoneCall, UserRound } from "lucide-react";
import { toast } from "sonner";

const ViewBookingsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  if (!id) {
    return (
      <div>
        <p>No booking ID provided.</p>
      </div>
    );
  }

  const bookingData = await getBookingDetailsById(id)
    .then((data) => data)
    .catch((err) => {
      toast.error("Error fetching booking details: " + err.message);
      return [];
    });

  return (
    <div>
      <PageTitle title={`Booking Details::`}></PageTitle>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer Name</TableHead>
            {/* contact - email, phone, whatsapp */}
            <TableHead>Customer Contact</TableHead>
            <TableHead>Status</TableHead>
            {/* booking details */}
            {/* no of guests=> adults, children */}
            <TableHead>Guests</TableHead>
            {/* additional details */}
            <TableHead>Additional Request</TableHead>
            {/* payment related details */}
            <TableHead>Payment Status</TableHead>
            {/* amount -> paid, due, total payable */}
            <TableHead>Amount </TableHead>
            <TableHead>Payment ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookingData.length > 0 ? (
            bookingData.map((booking, idx) => (
              <TableRow key={booking.paymentDetails.paymentId || idx}>
                <TableCell>
                  {booking.customerDetails.firstName}{" "}
                  {booking.customerDetails.lastName}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-red-50 text-red-600">
                        <Mail size={16} />
                      </div>
                      <span className="text-muted-foreground text-sm">
                        {booking.customerDetails.email}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                        <PhoneCall size={16} />
                      </div>
                      <span className="text-muted-foreground text-sm">
                        {booking.customerDetails.phone}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-50 text-green-600">
                        <MessageSquare size={16} />
                      </div>
                      <span className="text-muted-foreground text-sm">
                        {booking.customerDetails.whatsapp ||
                          booking.customerDetails.phone}
                      </span>
                    </div>
                  </div>
                </TableCell>
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
                <TableCell>
                  <div className="flex flex-col items-center gap-4">
                    <div className="bg-muted/50 flex items-center gap-2 rounded-md px-2 py-1">
                      <UserRound size={16} className="text-indigo-600" />
                      <span className="text-sm font-medium">
                        {booking.bookingDetails.noOfAdults}
                      </span>
                    </div>

                    <div className="bg-muted/50 flex items-center gap-2 rounded-md px-2 py-1">
                      <Baby size={16} className="text-pink-600" />
                      <span className="text-sm font-medium">
                        {booking.bookingDetails.noOfChildren}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {booking.bookingDetails.additionalRequest}
                </TableCell>
                <TableCell>{/* payment status */}</TableCell>
                <TableCell>
                  Paid: {booking.paymentDetails.amountPaid}
                  <br />
                  Total Payable: {booking.paymentDetails.totalPayable}
                </TableCell>
                <TableCell>
                  <span className="bg-gray-100 p-0.5 font-mono">
                    {booking.paymentDetails.paymentId}
                  </span>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9}>No booking details found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

// const ContactItem = ({ data, icon }) => {
//   return (
//     <div className="flex items-center gap-3">
//       <div className="flex h-8 w-8 items-center justify-center rounded-md bg-red-50 text-red-600">
//         <Mail size={16} />
//       </div>
//       <span className="text-muted-foreground text-sm">{data}</span>
//     </div>
//   );
// };

export default ViewBookingsPage;
