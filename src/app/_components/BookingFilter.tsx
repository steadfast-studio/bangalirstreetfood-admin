"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BookingFilters({
  travelDates,
  selectedPackage,
  selectedDate,
}: {
  travelDates: {
    id: string;
    packageName: string;
    date: string;
  }[];
  selectedPackage?: string;
  selectedDate?: string;
}) {
  const [pkg, setPkg] = useState(selectedPackage || "");
  const [date, setDate] = useState(selectedDate || "");

  const packages = useMemo(() => {
    return [...new Map(travelDates.map((t) => [t.packageName, t])).keys()];
  }, [travelDates]);

  const filteredDates = useMemo(() => {
    if (!pkg) return [];
    return travelDates.filter((t) => t.packageName === pkg);
  }, [pkg, travelDates]);

  return (
    <form method="GET" className="flex flex-wrap items-end gap-4">
      {/* PACKAGE */}
      <div className="flex flex-col gap-1">
        <Label>Package</Label>

        <Select
          value={pkg}
          onValueChange={(val) => {
            setPkg(val);
            setDate("");
          }}
        >
          <SelectTrigger className="w-62.5 bg-white">
            <SelectValue placeholder="Select Package" />
          </SelectTrigger>

          <SelectContent position="popper">
            <SelectGroup>
              {packages.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <input type="hidden" name="packageId" value={pkg} />
      </div>

      {/* DATE */}
      <div className="flex flex-col gap-1">
        <Label>Date</Label>

        <Select value={date} onValueChange={setDate} disabled={!pkg}>
          <SelectTrigger className="w-55 bg-white">
            <SelectValue placeholder="Select Date" />
          </SelectTrigger>

          <SelectContent position="popper">
            <SelectGroup>
              {filteredDates.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {/* show date as 12 Mar, 2026 */}
                  {new Date(d.date).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <input type="hidden" name="dateId" value={date} />
      </div>

      <Button type="submit">View Bookings</Button>
    </form>
  );
}
