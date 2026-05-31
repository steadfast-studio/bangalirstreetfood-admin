import z from "zod";

export const bookingSchema = z
  .object({
    noOfChildren: z.coerce
      .number({ error: "Please enter a valid number of children" })
      .min(0, "Number of children should be at least 0")
      .refine((val) => Number.isInteger(val), {
        message: "Number of children must be an integer",
      }),
    noOfAdults: z.coerce
      .number({ error: "Please enter a valid number of adults" })
      .min(1, "At least one adult must be present")
      .refine((val) => Number.isInteger(val), {
        message: "Number of adults must be an integer",
      }),
    bookingAmount: z.coerce
      .number({ error: "Please enter a valid booking amount" })
      .min(1, "Booking amount must be at least ₹1"),
    primaryContactFirstName: z
      .string({ error: "Please enter a valid first name" })
      .min(1, "Primary contact name is required"),
    primaryContactLastName: z
      .string()
      .min(1, "Primary contact last name is required"),
    primaryContactEmail: z
      .email("Invalid email address")
      .min(1, "Primary contact email is required"),
    primaryContactPhone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number is too long"),
    primaryContactWhatsApp: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(13, "WhatsApp number is too long"),
    foodPreference: z.enum(["Veg", "Non-Veg", "Mixed"]),
    additionalInformation: z.string().optional(),
    travelDate: z.string().min(1, "Travel date is required"),
  })
  .refine(
    (data) => {
      const totalParticipants = data.noOfAdults + data.noOfChildren;
      return totalParticipants > 0;
    },
    {
      message: "Total participants must be at least 1",
      path: ["noOfAdults"],
    },
  );

export type IBookingFormData = z.infer<typeof bookingSchema>;

// Server-side extended validation (used in createBooking action)
// Validates bookingAmount against package's minBookingAmount
export const validateBookingAmount = (
  bookingAmount: number,
  minBookingAmountPerPerson: number,
  totalParticipants: number,
  totalAmount: number,
) => {
  const minRequired = minBookingAmountPerPerson * totalParticipants;
  if (bookingAmount < minRequired) {
    return {
      valid: false,
      error: `Minimum booking amount is ₹${minRequired} (₹${minBookingAmountPerPerson} × ${totalParticipants} participants)`,
    };
  }
  if (bookingAmount > totalAmount) {
    return {
      valid: false,
      error: `Booking amount (₹${bookingAmount}) cannot exceed total amount (₹${totalAmount})`,
    };
  }
  return { valid: true, error: null };
};
