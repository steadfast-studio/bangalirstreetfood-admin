"use server";

import db from "@/db";
import {
  InsertPackage,
  itineraryTable,
  packagesTable,
  travelDatesTable,
} from "@/db/schema";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { countDistinct, eq, inArray, min } from "drizzle-orm";
import { ItineraryItem, PackageEditData } from "@/types/package";

export const fetchPackages = async ({
  page,
  pageSize = 20,
}: {
  page?: number;
  pageSize?: number;
}) => {
  try {
    const offset = page && page > 0 ? (page - 1) * pageSize : 0;

    const packages = await db
      .select()
      .from(packagesTable)
      .limit(pageSize)
      .offset(offset);

    return packages;
  } catch (error) {
    console.error("Error fetching packages:", error);
    throw new Error("Failed to fetch packages");
  }
};

export const getTotalPackagesCount = async () => {
  try {
    const result = await db
      .select({ count: countDistinct(packagesTable.id) })
      .from(packagesTable);

    return result[0]?.count || 0;
  } catch (error) {
    console.error("Error counting packages:", error);
    throw new Error("Failed to count packages");
  }
};

export const fetchPackagesForGrid = async (
  page?: number,
  pageSize?: number,
) => {
  try {
    const limit = pageSize ? pageSize : 20;
    const offset = page && page > 0 ? (page - 1) * limit : 0;

    const [packages, totalCount] = await Promise.all([
      db
        .select({
          id: packagesTable.id,
          title: packagesTable.packageTitle,
          duration: packagesTable.duration,
          highlights: packagesTable.highlights,
          amountPerAdult: packagesTable.amountPerAdult,
          amountPerChild: packagesTable.amountPerChild,
          thumbnail: packagesTable.thumbnail,
          nextDate: min(travelDatesTable.startDate),
          noOfUpcomingDates: countDistinct(travelDatesTable.startDate),
        })
        .from(packagesTable)
        .innerJoin(
          travelDatesTable,
          eq(packagesTable.id, travelDatesTable.packageId),
        )
        .groupBy(packagesTable.id)
        .limit(limit)
        .offset(offset),
      getTotalPackagesCount(),
    ]);

    return { packages, totalCount };
  } catch (error) {
    console.error("Error fetching packages for grid:", error);
    throw new Error("Failed to fetch packages for grid");
  }
};

export const getPackageDetailsById = async (id: string) => {
  // PURPOSE:
  // Fetch full package details for /package/[id] detail page.
  //
  // ALGORITHM:
  // Step 1: Validate id (non-empty, valid UUID format)
  //
  // Step 2: Query packages table — fetch ALL fields:
  //   id, title, duration, fullDescription, itinerary, highlights,
  //   inclusions, exclusions, images (all), pricePerAdult, pricePerChild,
  //   maxParticipants, availableDates, pickup, drop, minBookingAmount
  //
  // Step 3: Ensure package status is ACTIVE
  // - If not found → return { success: false, error: "NOT_FOUND" }
  // - If not ACTIVE → return { success: false, error: "UNAVAILABLE" }
  //
  // Step 4 (Optional): Fetch availability summary
  // - Call checkPackageAvailability(id) or inline the query
  // - For each date, show remaining seats / status
  //
  // Step 5: Return complete package object with availability info

  try {
    if (!id || typeof id !== "string") {
      throw new Error("Invalid package ID");
    }

    const packageDetails = await db
      .select({
        id: packagesTable.id,
        thumbnail: packagesTable.thumbnail,
        imageGallery: packagesTable.images,
        title: packagesTable.packageTitle,
        description: packagesTable.packageDescription,
        duration: packagesTable.duration,
        highlights: packagesTable.highlights,
        startDates: travelDatesTable.startDate,
        maxGroupSize: packagesTable.maxGroupSize,
        minBookingAmount: packagesTable.minimumBookingAmountPerPerson,
        pricePerAdult: packagesTable.amountPerAdult,
        pricePerChild: packagesTable.amountPerChild,
        included: packagesTable.included,
        excluded: packagesTable.excluded,
        notes: packagesTable.notes,
        // itinerary
        itinerary: {
          day: itineraryTable.day,
          activities: itineraryTable.description,
        },
        // availableDates
        availableDates: {
          startDate: travelDatesTable.startDate,
        },
      })
      .from(packagesTable)
      .innerJoin(
        travelDatesTable,
        eq(packagesTable.id, travelDatesTable.packageId),
      )
      .leftJoin(itineraryTable, eq(packagesTable.id, itineraryTable.packageId))
      .where(eq(packagesTable.id, id));
    // send start dates as part of package details for now, since we need them on the details as an array
    // use .reduce to transform from [{startDate: '2026-03-10'}, {startDate: '2026-03-17'} to ['2026-03-10', '2026-03-17']
    if (packageDetails.length === 0) {
      return null;
    }

    const base = packageDetails[0];

    const result = packageDetails.reduce(
      (acc, row) => {
        // Dates
        if (row.availableDates?.startDate) {
          acc.availableDates.add(row.availableDates.startDate);
        }

        // Itinerary (dedupe by day)
        if (
          row.itinerary &&
          !acc.itinerary.some((i) => i.day === row.itinerary!.day)
        ) {
          acc.itinerary.push({
            day: row.itinerary.day,
            activities: row.itinerary.activities,
          });
        }

        return acc;
      },
      {
        id: base.id,
        thumbnail: base.thumbnail,
        title: base.title,
        description: base.description,
        duration: base.duration,
        highlights: base.highlights,
        maxGroupSize: base.maxGroupSize,
        minBookingAmount: base.minBookingAmount,
        pricePerAdult: base.pricePerAdult,
        pricePerChild: base.pricePerChild,
        imageGallery: base.imageGallery,
        included: base.included,
        excluded: base.excluded,
        notes: base.notes,

        availableDates: new Set<string>(),
        itinerary: [] as { day: number; activities: string }[],
      },
    );

    return {
      ...result,
      availableDates: Array.from(result.availableDates),
    };
  } catch (error) {
    console.error("Error fetching package details:", error);
    throw new Error("Failed to fetch package details");
  }
};

export const getPackageDetailsByIdForBooking = async (id: string) => {
  // PURPOSE:
  // Fetch only data needed for booking form. Keeps booking page fast.
  // Used by BookingForm component.
  //
  // WHY SEPARATE FROM FULL DETAILS:
  // - No itinerary, highlights, large images
  // - Includes availability per date (needed for seat validation)
  // - Includes minBookingAmount (needed for payment validation)
  //
  // ALGORITHM:
  // Step 1: Validate id (non-empty, valid UUID)
  //
  // Step 2: Query packages table — fetch ONLY:
  //   id, title, pricePerAdult, pricePerChild, maxParticipants,
  //   availableDates, minBookingAmount, status
  //
  // Step 3: Ensure package is ACTIVE
  // - If not found or not ACTIVE → return error
  //
  // Step 4: Fetch reserved seats grouped by date
  // - SELECT selectedDate, COALESCE(SUM(participantsCount), 0) AS reserved
  //   FROM bookings
  //   WHERE packageId = ? AND status IN ('PENDING', 'CONFIRMED')
  //   GROUP BY selectedDate
  //
  // Step 5: For each availableDate, compute:
  // - remainingSeats = maxParticipants - reserved
  // - status: "AVAILABLE" | "LIMITED" | "SOLD_OUT"
  // - Filter out past dates
  const query = await db
    .select({
      title: packagesTable.packageTitle,
      availableDates: {
        id: travelDatesTable.id,
        startDate: travelDatesTable.startDate,
      },
      minBookingAmount: packagesTable.minimumBookingAmountPerPerson,
      pricePerAdult: packagesTable.amountPerAdult,
      pricePerChild: packagesTable.amountPerChild,
      duration: packagesTable.duration,
    })

    .from(packagesTable)
    .innerJoin(
      travelDatesTable,
      eq(packagesTable.id, travelDatesTable.packageId),
    )
    .where(eq(packagesTable.id, id));

  if (!query || query.length === 0) {
    throw new Error("Package not found");
  }
  // send the availableDates as array of objects [{id:"", startDate: ""}, {id:"", startDate: ""}] using .reduce
  const base = query[0];

  const result = query.reduce(
    (acc, row) => {
      if (row.availableDates?.startDate) {
        acc.availableDates.push({
          id: row.availableDates.id,
          startDate: row.availableDates.startDate,
        });
      }
      return acc;
    },
    {
      title: base.title,
      minBookingAmount: base.minBookingAmount,
      pricePerAdult: base.pricePerAdult,
      pricePerChild: base.pricePerChild,
      duration: base.duration,
      availableDates: [] as { id: string; startDate: string }[],
    },
  );

  return result;

  //
  // IMPORTANT:
  // - Never return calculated total price — only base prices
  // - Include minBookingAmount for frontend validation
  // - Include PENDING bookings in seat count to prevent overselling
};

export const createPackage = async (
  packageData: InsertPackage,
  itineraryData: ItineraryItem[],
  journeyDates: Date[],
) => {
  try {
    if (itineraryData.length === 0) {
      throw new Error("At least one itinerary item is required");
    }

    if (journeyDates.length === 0) {
      throw new Error("At least one journey date is required");
    }

    await db.transaction(async (tx) => {
      const [newPackage] = await tx
        .insert(packagesTable)
        .values({
          ...packageData,
          id: randomUUID(),
        })
        .returning({ id: packagesTable.id });

      if (!newPackage) {
        throw new Error("Failed inserting package");
      }

      const packageId = newPackage.id;

      // Insert itinerary
      await tx
        .insert(itineraryTable)
        .values(
          itineraryData.map((item) => ({
            packageId,
            day: item.day,
            description: item.description,
          })),
        )
        .catch((err) => {
          console.error("Error inserting itinerary:", err);
          throw new Error("Failed to insert itinerary");
        });

      // Insert travel dates
      await tx
        .insert(travelDatesTable)
        .values(
          journeyDates.map((date) => ({
            packageId,
            startDate: date.toISOString().split("T")[0],
          })),
        )
        .catch((err) => {
          console.error("Error inserting travel dates:", err);
          throw new Error("Failed to insert travel dates");
        });
    });

    revalidatePath("/packages");
    revalidatePath("/packages");
  } catch (error) {
    console.error("Unknown Error::", error);
    throw new Error("Unknown Error"); // Let the caller handle the error (e.g., show toast)
  }
  // redirect("/packages");
};

// * ADMIN PANEL

export const fetchPackagesFormAdmin = async ({
  page,
  pageSize = 20,
}: {
  page?: number;
  pageSize?: number;
}) => {
  try {
    const offset = page && page > 0 ? (page - 1) * pageSize : 0;

    const packages = await db
      .select({
        id: packagesTable.id,
        packageTitle: packagesTable.packageTitle,
        duration: packagesTable.duration,
        amountPerAdult: packagesTable.amountPerAdult,
        amountPerChild: packagesTable.amountPerChild,
      })
      .from(packagesTable)
      .limit(pageSize)
      .offset(offset);

    const packageIds = packages.map((pkg) => pkg.id);

    const travelDates = await db
      .select({
        startDate: travelDatesTable.startDate,
        packageId: travelDatesTable.packageId,
      })
      .from(travelDatesTable)
      .where(inArray(travelDatesTable.packageId, packageIds));
    // const packages = await db.query.

    const groupedDates = travelDates.reduce(
      (acc, curr) => {
        if (!acc[curr.packageId]) {
          acc[curr.packageId] = [];
        }
        acc[curr.packageId].push(curr.startDate);
        return acc;
      },
      {} as Record<string, string[]>,
    );

    const result = packages.map((pkg) => ({
      ...pkg,
      availableDates: groupedDates[pkg.id] ?? [],
    }));

    return result;
  } catch (error) {
    console.error("Error fetching packages:", error);
    throw new Error("Failed to fetch packages");
  }
};

export const getPackageDataForEditing = async (
  id: string,
): Promise<PackageEditData | null> => {
  try {
    if (!id || typeof id !== "string") {
      throw new Error("Invalid package ID");
    }

    // Fetch main package data
    const packageData = await db
      .select()
      .from(packagesTable)
      .where(eq(packagesTable.id, id))
      .limit(1);

    if (packageData.length === 0) {
      return null;
    }

    const pkg = packageData[0];

    // Fetch itinerary
    const itineraryData = await db
      .select({
        day: itineraryTable.day,
        description: itineraryTable.description,
      })
      .from(itineraryTable)
      .where(eq(itineraryTable.packageId, id))
      .orderBy(itineraryTable.day);

    // Fetch travel dates
    const travelDatesData = await db
      .select({
        startDate: travelDatesTable.startDate,
      })
      .from(travelDatesTable)
      .where(eq(travelDatesTable.packageId, id));

    return {
      id: pkg.id,
      title: pkg.packageTitle,
      description: pkg.packageDescription,
      duration: pkg.duration,
      amountPerAdult: pkg.amountPerAdult,
      amountPerChild: pkg.amountPerChild,
      minimumBookingAmountPerPerson: pkg.minimumBookingAmountPerPerson,
      maxGroupSize: pkg.maxGroupSize,
      highlights: pkg.highlights,
      included: pkg.included,
      excluded: pkg.excluded,
      notes: pkg.notes,
      thumbnail: pkg.thumbnail,
      images: pkg.images,
      itinerary: itineraryData.map((item) => ({
        day: item.day,
        description: item.description,
      })),
      journeyDates: travelDatesData.map((d) => new Date(d.startDate)),
    };
  } catch (error) {
    console.error("Error fetching package for editing:", error);
    throw new Error("Failed to fetch package for editing");
  }
};

export const updatePackage = async (
  packageId: string,
  packageData: InsertPackage,
  itineraryData: ItineraryItem[],
  journeyDates: Date[],
  oldImages: string[],
  newImageUrls: string[],
  oldThumbnail: string | null,
  newThumbnailUrl: string | null,
) => {
  try {
    if (itineraryData.length === 0) {
      throw new Error("At least one itinerary item is required");
    }

    if (journeyDates.length === 0) {
      throw new Error("At least one journey date is required");
    }

    await db.transaction(async (tx) => {
      // Update main package data
      await tx
        .update(packagesTable)
        .set({
          ...packageData,
          thumbnail: newThumbnailUrl,
          images: newImageUrls,
          updatedAt: new Date(),
        })
        .where(eq(packagesTable.id, packageId));

      // Delete old itinerary and insert new
      await tx
        .delete(itineraryTable)
        .where(eq(itineraryTable.packageId, packageId));

      await tx.insert(itineraryTable).values(
        itineraryData.map((item) => ({
          packageId,
          day: item.day,
          description: item.description,
        })),
      );

      // Delete old travel dates and insert new
      await tx
        .delete(travelDatesTable)
        .where(eq(travelDatesTable.packageId, packageId));

      await tx.insert(travelDatesTable).values(
        journeyDates.map((date) => ({
          packageId,
          startDate: date.toISOString().split("T")[0],
        })),
      );
    });

    // Clean up old images that are no longer used
    const imagesToDelete = oldImages.filter(
      (img) => !newImageUrls.includes(img),
    );

    // Clean up old thumbnail if changed
    if (oldThumbnail && oldThumbnail !== newThumbnailUrl) {
      imagesToDelete.push(oldThumbnail);
    }

    // Delete removed images from S3
    for (const imageUrl of imagesToDelete) {
      try {
        const key = extractS3KeyFromUrl(imageUrl);
        if (key) {
          await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ""}/api/upload`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key }),
          });
        }
      } catch (err) {
        console.error("Failed to delete old image from S3:", err);
      }
    }

    revalidatePath("/packages");
    revalidatePath("/packages");
    revalidatePath(`/packages/${packageId}`);
  } catch (error) {
    console.error("Error updating package:", error);
    throw new Error("Failed to update package");
  }
};

function extractS3KeyFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    // Remove leading slash from pathname
    return urlObj.pathname.substring(1);
  } catch {
    return null;
  }
}
