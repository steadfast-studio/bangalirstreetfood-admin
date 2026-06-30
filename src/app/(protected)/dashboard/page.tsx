import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, CalendarCheck } from "lucide-react";
import Link from "next/link";

const AdminDashboard = () => {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {/* Manage Packages */}
      <Card className="cursor-pointer hover:shadow-md transition">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6" />
            <CardTitle>Manage Packages</CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            Add new packages, update existing packages, and manage your
            travel offerings.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="success" asChild>
            <Link href="/packages">Go to Packages</Link>
          </Button>
        </CardFooter>
      </Card>

      {/* View Bookings */}
      <Card className="cursor-pointer hover:shadow-md transition">
        <CardHeader>
          <div className="flex items-center gap-3">
            <CalendarCheck className="h-6 w-6" />
            <CardTitle>View Bookings</CardTitle>
          </div>
        </CardHeader>

        <CardContent >
          <p className="text-sm text-muted-foreground">
            View customer bookings, payment details, and booking status.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="success" asChild>
            <Link href="/bookings">View Bookings</Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Manage Users */}
      <Card className="cursor-pointer hover:shadow-md transition">
        <CardHeader>
          <div className="flex items-center gap-3">
            <CalendarCheck className="h-6 w-6" />
            <CardTitle>View Users</CardTitle>
          </div>
        </CardHeader>

        <CardContent >
          <p className="text-sm text-muted-foreground">
            View & manage Admins for your Admin Panel.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="success" asChild>
            <Link href="/users">View Users</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminDashboard;