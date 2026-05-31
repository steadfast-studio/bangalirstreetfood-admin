import { fetchPackagesFormAdmin } from "@/actions/package.action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import { Calendar, Edit } from "lucide-react";
import Link from "next/link";

const PackagesPage = async () => {
  const packages = await fetchPackagesFormAdmin({ page: 1 });

  return (
    <div className="">
      <div className="flex-header">
        <h1>Packages</h1>
        <Button variant="success" asChild>
          <Link href="/packages/add">Create New Package</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Available Dates</TableHead>
            <TableHead>
              Actions
              {/* add new dates, unpublish, edit */}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packages.map((pkg) => (
            <TableRow key={pkg.id}>
              <TableCell>{pkg.packageTitle}</TableCell>
              <TableCell className="flex flex-col gap-2">
                <span>Adult: ₹{pkg.amountPerAdult}</span>
                <span>Child: ₹{pkg.amountPerChild}</span>
              </TableCell>
              <TableCell>
                <div className="grid w-fit grid-cols-2 flex-wrap gap-1 gap-2">
                  {pkg.availableDates?.map((date, index) => (
                    <Badge
                      // variant based on date, if date is in past show red, if date is within next 7 days show yellow, else show green
                      variant={
                        new Date(date) < new Date()
                          ? "destructive"
                          : new Date(date) <=
                              new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                            ? "warning"
                            : "info"
                      }
                      key={index}
                      className="font-semibold"
                      asChild
                    >
                      <Link href={`/bookings/${pkg.id}`}>
                        {new Date(date).toLocaleDateString()}
                      </Link>
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex w-fit flex-col items-start gap-0.5">
                  <Button variant="link">
                    <Calendar className="h-4 w-4" />
                    Add Date
                  </Button>
                  <Button variant="link" asChild>
                    <Link href={`/packages/edit/${pkg.id}`}>
                      <Edit className="h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <Button variant="link" className="text-destructive">
                    Unpublish
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PackagesPage;
