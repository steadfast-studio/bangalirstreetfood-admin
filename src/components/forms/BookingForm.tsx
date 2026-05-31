"use client";
import { bookingSchema, IBookingFormData } from "@/types/booking";
import { useForm, useWatch, Controller, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldContent, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { createBooking } from "@/actions/booking.action";
import Payment from "../Payment";
import { toast } from "sonner";

const BookingForm = ({
  packageId,
  packageDetails,
}: {
  packageId: string;
  packageDetails: {
    title: string;
    minBookingAmount: number;
    pricePerAdult: number;
    pricePerChild: number;
    duration: string;
    availableDates: {
      id: string;
      startDate: string;
    }[];
  };
}) => {
  const [checkedSameWhatsapp, setCheckedSameWhatsapp] = useState(true);

  const form = useForm<IBookingFormData>({
    resolver: zodResolver(bookingSchema) as Resolver<IBookingFormData>,
    defaultValues: {
      bookingAmount: 500,
      foodPreference: "Non-Veg",
      noOfChildren: 0,
      noOfAdults: 1,
      primaryContactFirstName: "",
      primaryContactLastName: "",
      primaryContactEmail: "",
      primaryContactPhone: "",
      primaryContactWhatsApp: "",
      additionalInformation: "",
      travelDate: "",
    },
  });
  const phoneNumberWatch = useWatch({
    name: "primaryContactPhone",
    control: form.control,
  });
  const watchedFormData = useWatch({ control: form.control });
  const onSubmit = async (data: IBookingFormData) => {
    // Here you can handle the form submission, e.g., send the data to an API endpoint
    try {
      await createBooking(packageId, data);
      console.log(data);
    } catch (_error) {
      console.log(_error || "Error");
    }
  };

  const handleWhatsappCheckboxChange = (value: boolean) => {
    setCheckedSameWhatsapp(value);
    if (value) {
      const phoneValue = form.getValues("primaryContactPhone");
      form.setValue("primaryContactWhatsApp", phoneValue);
    } else {
      form.setValue("primaryContactWhatsApp", "");
    }
  };

  // Sync WhatsApp number with phone number if checkbox is checked
  useEffect(() => {
    if (checkedSameWhatsapp) {
      form.setValue("primaryContactWhatsApp", phoneNumberWatch || "");
    }
  }, [phoneNumberWatch, checkedSameWhatsapp, form.setValue, form]);

  return (
    <div className="flex gap-4">
      <Card className="mx-auto w-full max-w-3xl bg-white">
        <CardHeader className="sr-only">
          <CardTitle className="px-8">
            Book Your Package : {packageDetails.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            id="booking-form"
            className="mx-auto flex flex-col gap-1 p-8 pt-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* No of Adult & No of Children */}
            <div className="flex justify-between gap-2">
              <Controller
                name="noOfAdults"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="noOfAdults">No. Of Adults</FieldLabel>
                    <Input
                      {...field}
                      type="number"
                      id="noOfAdults"
                      min={1}
                      aria-invalid={fieldState.invalid}
                      aria-describedby="noOfAdults-error"
                      placeholder="e.g. 2"
                      autoComplete="off"
                    />
                    <div className="min-h-5" id="noOfAdults-error">
                      <FieldError errors={[fieldState.error]} />
                    </div>
                  </Field>
                )}
              />
              <Controller
                name="noOfChildren"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="noOfChildren">
                      No. Of Children
                    </FieldLabel>
                    <Input
                      {...field}
                      type="number"
                      id="noOfChildren"
                      min={0}
                      aria-invalid={fieldState.invalid}
                      aria-describedby="noOfChildren-error"
                      placeholder="e.g. 1"
                      autoComplete="off"
                    />
                    <div className="min-h-5" id="noOfChildren-error">
                      <FieldError errors={[fieldState.error]} />
                    </div>
                  </Field>
                )}
              />
              {/* Travel Date */}
              <Controller
                name="travelDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="mb-1" htmlFor="travelDate">
                        Travel Date
                      </FieldLabel>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger
                          id="travelDate"
                          aria-invalid={fieldState.invalid}
                          aria-describedby="travelDate-error"
                          className="w-full"
                        >
                          <SelectValue placeholder="Select travel date" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          {packageDetails.availableDates.map((avlDate) => (
                            <SelectItem key={avlDate.id} value={avlDate.id}>
                              {new Date(avlDate.startDate).toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="min-h-5" id="travelDate-error">
                        <FieldError errors={[fieldState.error]} />
                      </div>
                    </FieldContent>
                  </Field>
                )}
              />
            </div>
            <div className="flex justify-between gap-2">
              <Controller
                name="primaryContactFirstName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="primaryContactFirstName">
                      First Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="primaryContactFirstName"
                      aria-invalid={fieldState.invalid}
                      aria-describedby="primaryContactFirstName-error"
                      placeholder="e.g. John"
                      autoComplete="given-name"
                    />
                    <div className="min-h-5" id="primaryContactFirstName-error">
                      <FieldError errors={[fieldState.error]} />
                    </div>
                  </Field>
                )}
              />
              <Controller
                name="primaryContactLastName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="primaryContactLastName">
                      Last Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="primaryContactLastName"
                      aria-invalid={fieldState.invalid}
                      aria-describedby="primaryContactLastName-error"
                      placeholder="e.g. Doe"
                      autoComplete="family-name"
                    />
                    <div className="min-h-5" id="primaryContactLastName-error">
                      <FieldError errors={[fieldState.error]} />
                    </div>
                  </Field>
                )}
              />
              <Controller
                name="primaryContactEmail"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="primaryContactEmail">Email</FieldLabel>
                    <Input
                      {...field}
                      id="primaryContactEmail"
                      type="email"
                      aria-invalid={fieldState.invalid}
                      aria-describedby="primaryContactEmail-error"
                      placeholder="e.g. john@example.com"
                      autoComplete="email"
                    />
                    <div className="min-h-5" id="primaryContactEmail-error">
                      <FieldError errors={[fieldState.error]} />
                    </div>
                  </Field>
                )}
              />
            </div>

            {/* Phone Number */}
            <div className="flex">
              <Controller
                name="primaryContactPhone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    className="w-full max-w-50"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel htmlFor="primaryContactPhone">
                      Phone Number
                    </FieldLabel>
                    <Input
                      {...field}
                      id="primaryContactPhone"
                      type="tel"
                      aria-invalid={fieldState.invalid}
                      aria-describedby="primaryContactPhone-error"
                      placeholder="e.g. 9876543210"
                      autoComplete="tel"
                      className="max-w-48"
                    />
                    <div className="min-h-5" id="primaryContactPhone-error">
                      <FieldError errors={[fieldState.error]} />
                    </div>
                  </Field>
                )}
              />
              <div className="flex grow items-center justify-start gap-2">
                <Controller
                  name="primaryContactWhatsApp"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="max-w-52"
                    >
                      <FieldLabel htmlFor="primaryContactWhatsApp">
                        WhatsApp Number
                      </FieldLabel>
                      <Input
                        {...field}
                        id="primaryContactWhatsApp"
                        type="tel"
                        aria-invalid={fieldState.invalid}
                        aria-describedby="primaryContactWhatsApp-error"
                        placeholder="e.g. 9876543210"
                        autoComplete="tel"
                        readOnly={checkedSameWhatsapp}
                        className="w-full max-w-48"
                      />
                      <div
                        className="min-h-5"
                        id="primaryContactWhatsApp-error"
                      >
                        <FieldError errors={[fieldState.error]} />
                      </div>
                    </Field>
                  )}
                />
                <div className="flex min-w-24 items-center gap-1">
                  <Checkbox
                    id="sameAsPhone"
                    checked={checkedSameWhatsapp}
                    onCheckedChange={handleWhatsappCheckboxChange}
                  />
                  <Label className="text-sm">Same as Phone Number</Label>
                </div>
              </div>
            </div>
            {/* Whatsapp number -> an input box at left and a button ("same as phone number") at right*/}
            {/* Booking Amount */}
            <Controller
              name="bookingAmount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="bookingAmount">
                    Booking Amount (₹) - Minimum ₹
                    {packageDetails.minBookingAmount} Per Person
                  </FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    id="bookingAmount"
                    aria-invalid={fieldState.invalid}
                    aria-describedby="bookingAmount-error"
                    placeholder={`e.g. ${packageDetails.minBookingAmount}`}
                    autoComplete="off"
                  />
                  <div className="min-h-5" id="bookingAmount-error">
                    <FieldError errors={[fieldState.error]} />
                  </div>
                </Field>
              )}
            />
            {/* Additional Information */}
            <Controller
              name="additionalInformation"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="additionalInformation">
                    Additional Information (Optional)
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="additionalInformation"
                    aria-invalid={fieldState.invalid}
                    aria-describedby="additionalInformation-error"
                    placeholder="Any specific requirements or information you'd like to share with us?"
                    rows={8}
                  />
                  <div className="min-h-5" id="additionalInformation-error">
                    <FieldError errors={[fieldState.error]} />
                  </div>
                </Field>
              )}
            />

            <Field orientation="horizontal" data-invalid>
              <Checkbox
                id="terms-checkbox-invalid"
                name="terms-checkbox-invalid"
                // aria-invalid
              />
              <FieldLabel htmlFor="terms-checkbox-invalid">
                Accept terms and conditions
              </FieldLabel>
            </Field>

            <Field orientation="horizontal" className="my-6">
              <Payment
                companyName="Bangalir Street Food"
                currency="INR"
                onPaymentSuccess={() => {
                  toast.success("Payment successful!");
                }}
                onPaymentFailure={() => {
                  toast.error("Payment failed!");
                }}
                description={`Booking advance payment for ${packageDetails.title} package`}
                amountInRupees={watchedFormData.bookingAmount || 0}
                customerData={{
                  firstName: watchedFormData.primaryContactFirstName || "",
                  lastName: watchedFormData.primaryContactLastName || "",
                  email: watchedFormData.primaryContactEmail || "",
                  phone: watchedFormData.primaryContactPhone || "",
                }}
                bookingData={{
                  noOfChildren: watchedFormData.noOfChildren || 0,
                  noOfAdults: watchedFormData.noOfAdults || 0,
                  bookingAmount: watchedFormData.bookingAmount || 0,
                  primaryContactFirstName:
                    watchedFormData.primaryContactFirstName || "",
                  primaryContactLastName:
                    watchedFormData.primaryContactLastName || "",
                  primaryContactEmail:
                    watchedFormData.primaryContactEmail || "",
                  primaryContactPhone:
                    watchedFormData.primaryContactPhone || "",
                  primaryContactWhatsApp:
                    watchedFormData.primaryContactWhatsApp || "",
                  foodPreference: watchedFormData.foodPreference || "Non-Veg",
                  additionalInformation:
                    watchedFormData.additionalInformation || "",
                  travelDate: watchedFormData.travelDate || "",
                }}
                totalAmountPayable={
                  // (children * amount per children) + (adult * amount per adult)
                  (watchedFormData.noOfAdults || 0) *
                    packageDetails.pricePerAdult +
                  (watchedFormData.noOfChildren || 0) *
                    packageDetails.pricePerChild
                }
                handleValidateFormData={async () => {
                  const isValid = await form.trigger();
                  return isValid;
                }}
              >
                Proceed to Pay
                {/* </Button> */}
              </Payment>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
            </Field>
          </form>
        </CardContent>
      </Card>
      {/* Booking Summary */}
      <BookingSummary packageDetails={packageDetails} control={form.control} />
    </div>
  );
};

export default BookingForm;

function BookingSummary({
  packageDetails,
  control,
}: {
  packageDetails: {
    title: string;
    minBookingAmount: number;
    pricePerAdult: number;
    pricePerChild: number;
    duration: string;
    availableDates: {
      id: string;
      startDate: string;
    }[];
  };
  control: ReturnType<typeof useForm<IBookingFormData>>["control"];
}) {
  const noOfAdults = useWatch({ control, name: "noOfAdults" });
  const noOfChildren = useWatch({ control, name: "noOfChildren" });
  const travelDate = useWatch({ control, name: "travelDate" });
  const bookingAmount = useWatch({ control, name: "bookingAmount" });

  const totalAmount =
    noOfAdults * packageDetails.pricePerAdult +
    noOfChildren * packageDetails.pricePerChild;
  const dueAmount = totalAmount - bookingAmount;

  const selectedDate = packageDetails.availableDates.find(
    (date) => date.id === travelDate,
  )?.startDate;

  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Not selected";

  return (
    <div className="max-w-md space-y-4 rounded-xl border-2 border-teal-600 bg-teal-50 p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Booking Summary</h3>
        <Badge variant="secondary" className="bg-teal-200 text-teal-900">
          {packageDetails.duration}
        </Badge>
      </div>

      <Separator className="bg-teal-500" />

      {/* Package Name */}
      <p className="font-semibold text-teal-900">{packageDetails.title}</p>

      {/* Details Grid */}
      <div className="grid grid-cols-3 gap-3">
        <SummaryItem label="Adults" value={String(noOfAdults)} />
        <SummaryItem label="Children" value={String(noOfChildren)} />
        <SummaryItem label="Travel Date" value={formattedDate} />
      </div>

      <Separator className="bg-teal-600" />

      {/* Pricing Breakdown */}
      <div className="space-y-2 text-sm">
        {noOfAdults > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>
              {noOfAdults} Adult{noOfAdults > 1 ? "s" : ""} × ₹
              {packageDetails.pricePerAdult.toLocaleString("en-IN")}
            </span>
            <span>
              ₹
              {(noOfAdults * packageDetails.pricePerAdult).toLocaleString(
                "en-IN",
              )}
            </span>
          </div>
        )}
        {noOfChildren > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>
              {noOfChildren} Child{noOfChildren > 1 ? "ren" : ""} × ₹
              {packageDetails.pricePerChild.toLocaleString("en-IN")}
            </span>
            <span>
              ₹
              {(noOfChildren * packageDetails.pricePerChild).toLocaleString(
                "en-IN",
              )}
            </span>
          </div>
        )}
      </div>

      <Separator className="bg-teal-600" />

      {/* Total */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-gray-900">Total Amount</span>
        <span className="text-xl font-bold text-teal-600">
          ₹{totalAmount.toLocaleString("en-IN")}
        </span>
      </div>

      {/* Payment Split */}
      <div className="space-y-1.5 rounded-lg border-2 border-teal-500 bg-white p-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Paying Now</span>
          <span className="font-medium text-gray-900">
            ₹{bookingAmount.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Due Later</span>
          <span className="font-medium text-gray-900">
            ₹{dueAmount.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Note */}
      <p className="text-xs leading-relaxed text-gray-500">
        Pay a minimum of ₹
        {packageDetails.minBookingAmount.toLocaleString("en-IN")} per person to
        confirm your booking. The remaining amount can be paid later.
      </p>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border-2 border-teal-500 bg-white/70 px-3 py-2 text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
  );
}
