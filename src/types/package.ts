import z from "zod";

export const packageFormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  duration: z.string().min(1, "Duration is required."),
  amountChild: z.coerce.number().min(0),
  amountAdult: z.coerce
    .number({
      error: "Please enter a valid amount for adults",
    })
    .min(0)
    .refine((val) => val > 0 && Number.isInteger(val), {
      message: "Amount per adult must be a positive integer",
    }),
  minBookingAmount: z.coerce.number().min(0),
  maxGroupSize: z.coerce.number().min(1),

  highlights: z.array(z.string()).min(1, "Add at least one highlight."),
  included: z.array(z.string()).default([]),
  excluded: z.array(z.string()).default([]),
  notes: z.string().optional(),

  itinerary: z
    .array(
      z.object({
        day: z.coerce.number().min(1, "Day is required"),
        description: z.string().min(1, "Description required"),
      }),
    )
    .min(1, "Add at least one itinerary entry."),

  journeyDates: z.array(z.date()).min(1, "Add at least one departure date."),

  thumbnail: z.any().optional(),
  images: z.any().optional(),
});

export type IPackageFrom = z.infer<typeof packageFormSchema>;

export type ItineraryItem = {
  day: number;
  description: string;
};

export type PackageEditData = {
  id: string;
  title: string;
  description: string;
  duration: string;
  amountPerAdult: number;
  amountPerChild: number;
  minimumBookingAmountPerPerson: number;
  maxGroupSize: number;
  highlights: string[];
  included: string[];
  excluded: string[];
  notes: string | null;
  thumbnail: string | null;
  images: string[];
  itinerary: ItineraryItem[];
  journeyDates: Date[];
};
