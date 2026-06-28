import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Eye } from "lucide-react";

type BookingDetailsProp = {
  customerDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    whatsapp: string | null;
  };
  bookingDetails: {
    noOfAdults: number;
    noOfChildren: number;
    additionalRequest: string | null;
    bookedOn: Date;
    status: string;
  };
  paymentDetails: {
    amountPaid: number;
    totalPayable: number;
    paymentStatus: string;
    paymentId: string | null;
  };
};

export function BookingDetailsModal({ data }: { data: BookingDetailsProp }) {
  const { customerDetails, bookingDetails, paymentDetails } = data;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Eye className="h-5 w-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="">

        
        <DialogHeader>
          <DialogTitle className="font-bold">Booking Details</DialogTitle>
          <DialogDescription>
            Complete information about this booking.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-90">

        <div className="space-y-5">
          {/* Customer Details */}
          <section>
            <h3 className="font-semibold mb-3">Customer Details</h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p>
                  {customerDetails.firstName} {customerDetails.lastName}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">Phone</p>
                <p>{customerDetails.phone}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Email</p>
                <p>{customerDetails.email}</p>
              </div>

              <div>
                <p className="text-muted-foreground">WhatsApp</p>
                <p>{customerDetails.whatsapp ?? "N/A"}</p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Booking Details */}
          <section>
            <h3 className="font-semibold mb-3">Booking Details</h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Adults</p>
                <p>{bookingDetails.noOfAdults}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Children</p>
                <p>{bookingDetails.noOfChildren}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Booked On</p>
                <p>
                  {new Date(bookingDetails.bookedOn).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">Status</p>
                <p>{bookingDetails.status}</p>
              </div>

              <div className="col-span-2">
                <p className="text-muted-foreground">Additional Request</p>
                <p>
                  {bookingDetails.additionalRequest ?? "No request"}
                </p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Payment Details */}
          <section>
            <h3 className="font-semibold mb-3">Payment Details</h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Amount Paid</p>
                <p>₹{paymentDetails.amountPaid}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Total Payable</p>
                <p>₹{paymentDetails.totalPayable}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Payment Status</p>
                <p>{paymentDetails.paymentStatus}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Payment ID</p>
                <p>{paymentDetails.paymentId ?? "N/A"}</p>
              </div>
            </div>
          </section>
        </div>

        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}