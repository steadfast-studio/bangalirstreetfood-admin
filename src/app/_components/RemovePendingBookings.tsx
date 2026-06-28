"use client";
import { Button } from "@/components/ui/button";
import { cleanupBookings } from "../_actions/bookings";
import { toast } from "sonner";

const RemovePendingBookings = ({
  packageId,
  dateId,
  disabled=false,
}: {
  packageId: string;
  dateId: string;
  disabled?: boolean;
}) => {
  const handleCleanup = async () => {
    await cleanupBookings(packageId, dateId)
      .then(() => {
        toast.success("Pending bookings removed successfully");
      })
      .catch((e: Error) => {
        toast.error(e.message || "Failed to remove pending bookings");
      });
  };
  return (
    <Button variant={"destructive"} onClick={handleCleanup} disabled={disabled}>
      Remove Pending Bookings
    </Button>
  );
};

export default RemovePendingBookings;
