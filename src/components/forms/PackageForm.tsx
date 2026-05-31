"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  Resolver,
  useForm,
  UseFormReturn,
  useWatch,
} from "react-hook-form";
import { toast } from "sonner";
import Image from "next/image";
import { XIcon, PlusIcon, X, Upload, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format, startOfDay } from "date-fns";
import {
  IPackageFrom,
  packageFormSchema,
  PackageEditData,
} from "@/types/package";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Badge } from "../ui/badge";
import { Calendar } from "../ui/calendar";
import { createPackage, updatePackage } from "@/actions/package.action";
import { InsertPackage } from "@/db/schema";
import { useRouter } from "next/navigation";
import { useS3Upload } from "@/lib/file-upload/useS3Upload";

type TourFormProps = {
  initialData?: PackageEditData;
};

export function TourForm({ initialData }: TourFormProps) {
  const router = useRouter();
  const isEditMode = Boolean(initialData);
  const { uploadFile, uploadMultiple, uploading } = useS3Upload();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Track original images for cleanup during update
  const originalImagesRef = React.useRef<string[]>(initialData?.images ?? []);
  const originalThumbnailRef = React.useRef<string | null>(
    initialData?.thumbnail ?? null,
  );

  const form = useForm<IPackageFrom>({
    resolver: zodResolver(packageFormSchema) as Resolver<IPackageFrom>,
    defaultValues: {
      highlights: initialData?.highlights ?? [],
      included: initialData?.included ?? [],
      excluded: initialData?.excluded ?? [],
      notes: initialData?.notes ?? "",
      itinerary: initialData?.itinerary ?? [{ day: 1, description: "Pick up" }],
      images: [],
      thumbnail: undefined,
      amountAdult: initialData?.amountPerAdult ?? 0,
      amountChild: initialData?.amountPerChild ?? 0,
      minBookingAmount: initialData?.minimumBookingAmountPerPerson ?? 0,
      maxGroupSize: initialData?.maxGroupSize ?? 0,
      journeyDates: initialData?.journeyDates ?? [],
      description: initialData?.description ?? "",
      duration: initialData?.duration ?? "",
      title: initialData?.title ?? "",
    },
  });

  const highlights = useWatch({
    control: form.control,
    name: "highlights",
  });

  const included = useWatch({
    control: form.control,
    name: "included",
  });

  const excluded = useWatch({
    control: form.control,
    name: "excluded",
  });

  const itinerary = useWatch({
    control: form.control,
    name: "itinerary",
  });

  // Thumbnail state - stores either existing URL or File
  const [thumbnailPreview, setThumbnailPreview] = React.useState<string | null>(
    initialData?.thumbnail ?? null,
  );
  const [thumbnailFile, setThumbnailFile] = React.useState<File | null>(null);

  // Images state - stores existing URLs and new Files separately
  const [existingImages, setExistingImages] = React.useState<string[]>(
    initialData?.images ?? [],
  );
  const [newImageFiles, setNewImageFiles] = React.useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = React.useState<string[]>([]);

  // Total images count (existing + new) must be multiple of 3
  const totalImagesCount = existingImages.length + newImageFiles.length;

  function handleThumbnailUpload(files: FileList | null) {
    if (!files || files.length === 0) return;

    const file = files[0];
    setThumbnailFile(file);
    const preview = URL.createObjectURL(file);
    setThumbnailPreview(preview);
    form.setValue("thumbnail", file);
  }

  function removeThumbnail() {
    if (thumbnailPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnailPreview);
    }
    setThumbnailPreview(null);
    setThumbnailFile(null);
    form.setValue("thumbnail", undefined);
  }

  function handleImageUpload(files: FileList | null) {
    if (!files) return;

    const fileArray = Array.from(files);
    setNewImageFiles((prev) => [...prev, ...fileArray]);

    const previews = fileArray.map((file) => URL.createObjectURL(file));
    setNewImagePreviews((prev) => [...prev, ...previews]);
  }

  function removeExistingImage(index: number) {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  }

  function removeNewImage(index: number) {
    const removedPreview = newImagePreviews[index];
    if (removedPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(removedPreview);
    }
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }

  // Store refs for cleanup
  const newImagePreviewsRef = React.useRef<string[]>([]);
  const thumbnailPreviewRef = React.useRef<string | null>(null);

  // Keep refs in sync
  React.useEffect(() => {
    newImagePreviewsRef.current = newImagePreviews;
    thumbnailPreviewRef.current = thumbnailPreview;
  }, [newImagePreviews, thumbnailPreview]);

  // Cleanup blob URLs on unmount
  React.useEffect(() => {
    return () => {
      newImagePreviewsRef.current.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
      if (thumbnailPreviewRef.current?.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailPreviewRef.current);
      }
    };
  }, []);

  async function onSubmit(data: IPackageFrom) {
    // Validate images count is multiple of 3
    if (totalImagesCount > 0 && totalImagesCount % 3 !== 0) {
      toast.error("Number of images must be a multiple of 3");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload thumbnail if new file selected
      let finalThumbnailUrl: string | null = null;
      if (thumbnailFile) {
        finalThumbnailUrl = await uploadFile(thumbnailFile);
      } else if (
        thumbnailPreview &&
        !thumbnailPreview.startsWith("blob:") &&
        thumbnailPreview !== ""
      ) {
        // Keep existing thumbnail if no new one selected
        finalThumbnailUrl = thumbnailPreview;
      }

      // Upload new images and combine with existing ones
      let finalImageUrls: string[] = [...existingImages];
      if (newImageFiles.length > 0) {
        const uploadedUrls = await uploadMultiple(newImageFiles);
        finalImageUrls = [...existingImages, ...uploadedUrls];
      }

      const parsedData: InsertPackage = {
        packageTitle: data.title,
        packageDescription: data.description,
        amountPerAdult: data.amountAdult,
        amountPerChild: data.amountChild,
        minimumBookingAmountPerPerson: data.minBookingAmount,
        maxGroupSize: data.maxGroupSize,
        duration: data.duration,
        highlights: data.highlights,
        included: data.included,
        excluded: data.excluded,
        notes: data.notes || null,
        thumbnail: finalThumbnailUrl,
        images: finalImageUrls,
      };

      if (isEditMode && initialData) {
        // Update existing package
        await updatePackage(
          initialData.id,
          parsedData,
          data.itinerary,
          data.journeyDates,
          originalImagesRef.current,
          finalImageUrls,
          originalThumbnailRef.current,
          finalThumbnailUrl,
        );
        toast.success("Tour Updated");
      } else {
        // Create new package
        await createPackage(parsedData, data.itinerary, data.journeyDates);
        toast.success("Tour Created");
        form.reset();
      }

      router.push("/packages");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      toast.error(
        `Failed to ${isEditMode ? "update" : "create"} tour: ${errorMessage}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="border-t-primary mx-auto w-full max-w-3xl border-t-4 shadow-lg">
      <CardHeader className="bg-muted/40 border-b pb-6">
        <CardTitle className="text-2xl font-bold tracking-tight">
          {isEditMode ? "Edit Tour Package" : "Create Tour Package"}
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          {isEditMode
            ? "Update tour details including pricing, highlights and itinerary."
            : "Add tour details including pricing, highlights and itinerary."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id="tour-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="">
            {/* Title */}
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Title</FieldLabel>
                  <FieldContent>
                    <Input {...field} placeholder="Amazing Bali Trip" />
                  </FieldContent>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            {/* Description */}
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Description</FieldLabel>
                  <FieldContent>
                    <Textarea {...field} placeholder="Tour details..." />
                  </FieldContent>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="journeyDates"
              control={form.control}
              render={({ field, fieldState }) => {
                const dates = field.value || [];

                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Departure Dates</FieldLabel>

                    <FieldContent>
                      <div className="flex flex-wrap gap-2">
                        {/* Existing Date Badges */}
                        {dates.map((date: Date, index: number) => (
                          <Badge
                            key={index}
                            variant="default"
                            className="flex items-center gap-2 pr-1"
                          >
                            {format(date, "PPP")}

                            <button
                              type="button"
                              onClick={() => {
                                const updated = dates.filter(
                                  (_: Date, i: number) => i !== index,
                                );
                                field.onChange(updated);
                              }}
                              className="ml-1"
                            >
                              <XIcon className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}

                        {/* Add Button Badge */}
                        <Popover>
                          <PopoverTrigger asChild>
                            <Badge
                              variant="success"
                              className="flex cursor-pointer items-center gap-1"
                            >
                              <PlusIcon className="h-3 w-3" />
                              Add
                            </Badge>
                          </PopoverTrigger>

                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              startMonth={new Date(2026, 0)}
                              endMonth={new Date(2036, 0)}
                              mode="multiple"
                              selected={dates}
                              captionLayout="dropdown"
                              onSelect={(selected) => {
                                if (!selected) return;
                                const normalized = selected.map((date) =>
                                  startOfDay(date),
                                );
                                field.onChange(normalized);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </FieldContent>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Duration */}
            <Controller
              name="duration"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Duration</FieldLabel>
                  <FieldContent>
                    <Input {...field} placeholder="3 Nights 4 Days" />
                  </FieldContent>
                </Field>
              )}
            />

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-4 rounded-lg border border-amber-200/60 bg-amber-50/40 p-4 dark:border-amber-800/30 dark:bg-amber-950/20">
              <Controller
                name="amountAdult"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Amount per Adult</FieldLabel>
                    <FieldContent>
                      <Input type="number" required {...field} />
                    </FieldContent>
                  </Field>
                )}
              />
              <Controller
                name="amountChild"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Amount per Child</FieldLabel>
                    <FieldContent>
                      <Input type="number" required {...field} />
                    </FieldContent>
                  </Field>
                )}
              />
            </div>

            {/* Min booking + max group */}
            <div className="grid grid-cols-2 gap-4 rounded-lg border border-sky-200/60 bg-sky-50/40 p-4 dark:border-sky-800/30 dark:bg-sky-950/20">
              <Controller
                name="minBookingAmount"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Minimum Booking Amount</FieldLabel>
                    <FieldContent>
                      <Input type="number" {...field} />
                    </FieldContent>
                  </Field>
                )}
              />
              <Controller
                name="maxGroupSize"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Max Group Size</FieldLabel>
                    <FieldContent>
                      <Input type="number" {...field} />
                    </FieldContent>
                  </Field>
                )}
              />
            </div>

            {/* Highlights Array */}
            <FieldSet className="bg-muted/20 border-border rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <FieldLegend className="text-primary text-xs font-semibold tracking-wide uppercase">
                  Highlights
                </FieldLegend>
                <AddStringItemDialog
                  form={form}
                  fieldName="highlights"
                  dialogTitle="Add Highlight"
                  placeholder="e.g. Beach sunset cruise"
                />
              </div>

              <div className="border-border flex flex-col overflow-hidden rounded-md border">
                {highlights.length === 0 && (
                  <p className="text-muted-foreground py-6 text-center text-sm italic">
                    No highlights yet
                  </p>
                )}
                {highlights.map((item, index) => (
                  <div
                    key={index}
                    className="hover:bg-accent/50 border-border flex w-full items-center justify-between gap-1 border-b py-2 px-3 last:border-b-0"
                  >
                    <span className="text-foreground font-medium">{item}</span>
                    <div className="flex gap-1">
                      <EditStringItemDialog
                        form={form}
                        fieldName="highlights"
                        index={index}
                        defaultValue={item}
                        dialogTitle="Edit Highlight"
                      />
                      <Button
                        variant={"destructive"}
                        type="button"
                        size="icon-sm"
                        onClick={() => {
                          const updated = highlights.filter(
                            (_, i) => i !== index,
                          );
                          form.setValue("highlights", updated, {
                            shouldValidate: true,
                          });
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {form.formState.errors.highlights && (
                <FieldError errors={[form.formState.errors.highlights]} />
              )}
            </FieldSet>

            {/* Included Array */}
            <FieldSet className="bg-muted/20 border-border rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <FieldLegend className="text-primary text-xs font-semibold tracking-wide uppercase">
                  What&apos;s Included
                </FieldLegend>
                <AddStringItemDialog
                  form={form}
                  fieldName="included"
                  dialogTitle="Add Included Item"
                  placeholder="e.g. Breakfast included"
                />
              </div>

              <div className="border-border flex flex-col overflow-hidden rounded-md border">
                {included.length === 0 && (
                  <p className="text-muted-foreground py-6 text-center text-sm italic">
                    No items added yet
                  </p>
                )}
                {included.map((item, index) => (
                  <div
                    key={index}
                    className="hover:bg-accent/50 border-border flex w-full items-center justify-between gap-1 border-b py-2 px-3 last:border-b-0"
                  >
                    <span className="text-foreground font-medium">{item}</span>
                    <div className="flex gap-1">
                      <EditStringItemDialog
                        form={form}
                        fieldName="included"
                        index={index}
                        defaultValue={item}
                        dialogTitle="Edit Included Item"
                      />
                      <Button
                        variant={"destructive"}
                        type="button"
                        size="icon-sm"
                        onClick={() => {
                          const updated = included.filter(
                            (_, i) => i !== index,
                          );
                          form.setValue("included", updated, {
                            shouldValidate: true,
                          });
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </FieldSet>

            {/* Excluded Array */}
            <FieldSet className="bg-muted/20 border-border rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <FieldLegend className="text-primary text-xs font-semibold tracking-wide uppercase">
                  What&apos;s Not Included
                </FieldLegend>
                <AddStringItemDialog
                  form={form}
                  fieldName="excluded"
                  dialogTitle="Add Excluded Item"
                  placeholder="e.g. Personal expenses"
                />
              </div>

              <div className="border-border flex flex-col overflow-hidden rounded-md border">
                {excluded.length === 0 && (
                  <p className="text-muted-foreground py-6 text-center text-sm italic">
                    No items added yet
                  </p>
                )}
                {excluded.map((item, index) => (
                  <div
                    key={index}
                    className="hover:bg-accent/50 border-border flex w-full items-center justify-between gap-1 border-b py-2 px-3 last:border-b-0"
                  >
                    <span className="text-foreground font-medium">{item}</span>
                    <div className="flex gap-1">
                      <EditStringItemDialog
                        form={form}
                        fieldName="excluded"
                        index={index}
                        defaultValue={item}
                        dialogTitle="Edit Excluded Item"
                      />
                      <Button
                        variant={"destructive"}
                        type="button"
                        size="icon-sm"
                        onClick={() => {
                          const updated = excluded.filter(
                            (_, i) => i !== index,
                          );
                          form.setValue("excluded", updated, {
                            shouldValidate: true,
                          });
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </FieldSet>

            {/* Notes */}
            <Controller
              name="notes"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Additional Notes</FieldLabel>
                  <FieldContent>
                    <Textarea
                      {...field}
                      placeholder="Any additional information or notes about the package..."
                      rows={4}
                    />
                  </FieldContent>
                </Field>
              )}
            />

            {/* Itinerary Array */}
            <FieldSet className="bg-muted/20 border-border rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <FieldLegend className="text-primary text-xs font-semibold tracking-wide uppercase">
                  Itinerary
                </FieldLegend>
                <FieldDescription>
                  <AddItineraryDialog form={form} />
                </FieldDescription>
              </div>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-primary/10 border-primary/20 border-b">
                    <tr>
                      <th className="text-primary px-4 py-3 text-left font-semibold">
                        Day
                      </th>
                      <th className="text-primary px-4 py-3 text-left font-semibold">
                        Description
                      </th>
                      <th className="text-primary px-4 py-3 text-right font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {itinerary.length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="text-muted-foreground px-4 py-8 text-center text-sm italic"
                        >
                          No itinerary added yet
                        </td>
                      </tr>
                    )}
                    {itinerary.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-3 font-medium">{item.day}</td>

                        <td className="text-muted-foreground px-4 py-3">
                          <span className="line-clamp-2">
                            {item.description}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <EditItineraryDialog
                              form={form}
                              index={index}
                              defaultValue={item}
                            />

                            <Button
                              type="button"
                              size="icon-sm"
                              variant="destructive"
                              onClick={() => {
                                const updated = itinerary.filter(
                                  (_, i) => i !== index,
                                );
                                form.setValue("itinerary", updated, {
                                  shouldValidate: true,
                                });
                              }}
                            >
                              ✕
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {form.formState.errors.itinerary && (
                <FieldError errors={[form.formState.errors.itinerary]} />
              )}
            </FieldSet>

            {/* Thumbnail Upload */}
            <Field>
              <FieldLabel>Thumbnail Image</FieldLabel>
              <FieldDescription className="text-muted-foreground mb-2 text-xs">
                Main image displayed on package cards
              </FieldDescription>
              <FieldContent>
                {thumbnailPreview ? (
                  <div className="relative inline-block">
                    <Image
                      src={thumbnailPreview}
                      alt="thumbnail preview"
                      width={200}
                      height={150}
                      className="rounded-md object-cover"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={removeThumbnail}
                      className="bg-destructive hover:bg-destructive/90 absolute -top-2 -right-2 rounded-full p-1 text-white shadow-md"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="hover:border-primary/50 relative cursor-pointer rounded-lg border-2 border-dashed p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleThumbnailUpload(e.target.files)}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                    <Upload className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
                    <p className="text-muted-foreground text-sm">
                      Click or drag to upload thumbnail
                    </p>
                  </div>
                )}
              </FieldContent>
            </Field>

            {/* Gallery Images Upload */}
            <Field>
              <FieldLabel>Gallery Images</FieldLabel>
              <FieldDescription className="text-muted-foreground mb-2 text-xs">
                Upload images for the gallery (must be a multiple of 3)
              </FieldDescription>
              <FieldContent>
                {/* Upload box */}
                <div className="hover:border-primary/50 relative cursor-pointer rounded-lg border-2 border-dashed p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                  <Upload className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
                  <p className="text-muted-foreground text-sm">
                    Click or drag to upload images
                  </p>
                </div>

                {/* Images count indicator */}
                {totalImagesCount > 0 && (
                  <p
                    className={`mt-2 text-sm ${
                      totalImagesCount % 3 === 0
                        ? "text-green-600"
                        : "text-amber-600"
                    }`}
                  >
                    {totalImagesCount} image{totalImagesCount !== 1 ? "s" : ""}{" "}
                    selected
                    {totalImagesCount % 3 !== 0 &&
                      ` (need ${3 - (totalImagesCount % 3)} more for multiple of 3)`}
                  </p>
                )}

                {/* Existing images preview */}
                {existingImages.length > 0 && (
                  <div className="mt-4">
                    <p className="text-muted-foreground mb-2 text-xs font-medium">
                      Existing Images
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      {existingImages.map((src, i) => (
                        <div key={`existing-${i}`} className="relative">
                          <Image
                            src={src}
                            alt={`existing image ${i + 1}`}
                            width={120}
                            height={120}
                            className="h-24 w-full rounded-md object-cover"
                            unoptimized
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(i)}
                            className="bg-destructive hover:bg-destructive/90 absolute -top-2 -right-2 rounded-full p-1 text-white shadow-md"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New images preview */}
                {newImagePreviews.length > 0 && (
                  <div className="mt-4">
                    <p className="text-muted-foreground mb-2 text-xs font-medium">
                      New Images (to be uploaded)
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      {newImagePreviews.map((src, i) => (
                        <div key={`new-${i}`} className="relative">
                          <Image
                            src={src}
                            alt={`new image ${i + 1}`}
                            width={120}
                            height={120}
                            className="h-24 w-full rounded-md object-cover"
                            unoptimized
                          />
                          <button
                            type="button"
                            onClick={() => removeNewImage(i)}
                            className="bg-destructive hover:bg-destructive/90 absolute -top-2 -right-2 rounded-full p-1 text-white shadow-md"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </FieldContent>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="bg-muted/40 border-t pt-6">
        <Button
          type="submit"
          form="tour-form"
          size="lg"
          className="w-full font-semibold tracking-wide"
          disabled={isSubmitting || uploading}
        >
          {isSubmitting || uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditMode ? "Updating..." : "Creating..."}
            </>
          ) : isEditMode ? (
            "Update Tour"
          ) : (
            "Create Tour"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

function AddStringItemDialog({
  form,
  fieldName,
  dialogTitle,
  placeholder,
}: {
  form: UseFormReturn<IPackageFrom>;
  fieldName: "highlights" | "included" | "excluded";
  dialogTitle: string;
  placeholder: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const items = form.watch(fieldName);

  function handleAdd() {
    if (!value.trim()) return;

    form.setValue(fieldName, [...items, value.trim()], {
      shouldValidate: true,
    });

    setValue("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm" variant="success">
          + Add
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>

        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleAdd}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditStringItemDialog({
  form,
  fieldName,
  index,
  defaultValue,
  dialogTitle,
}: {
  form: UseFormReturn<IPackageFrom>;
  fieldName: "highlights" | "included" | "excluded";
  index: number;
  defaultValue: string;
  dialogTitle: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);

  const items = form.watch(fieldName);

  function handleSave() {
    if (!value.trim()) return;

    const updated = [...items];
    updated[index] = value.trim();

    form.setValue(fieldName, updated, { shouldValidate: true });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon-sm" variant="secondary">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>

        <Input value={value} onChange={(e) => setValue(e.target.value)} />

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddItineraryDialog({
  form,
  day,
}: {
  form: UseFormReturn<IPackageFrom>;
  day?: number;
}) {
  const [open, setOpen] = React.useState(false);
  const [dayValue, setDayValue] = React.useState(day || 0);
  const [description, setDescription] = React.useState("");

  const itinerary = form.watch("itinerary");

  function handleAdd() {
    if (!dayValue || !description.trim()) return;

    form.setValue(
      "itinerary",
      [...itinerary, { day: dayValue, description: description.trim() }],
      { shouldValidate: true },
    );

    setDayValue(0);
    setDescription("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="success" size="sm">
          + Add
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Itinerary Day</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Day 1"
            value={dayValue}
            onChange={(e) => setDayValue(parseInt(e.target.value) || 0)}
          />

          <Textarea
            placeholder="Describe the day's activities..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditItineraryDialog({
  form,
  index,
  defaultValue,
}: {
  form: UseFormReturn<IPackageFrom>;
  index: number;
  defaultValue: { day: number; description: string };
}) {
  const [open, setOpen] = React.useState(false);
  const [day, setDay] = React.useState(defaultValue.day);
  const [description, setDescription] = React.useState(
    defaultValue.description,
  );

  const itinerary = form.watch("itinerary");

  function handleSave() {
    const updated = [...itinerary];
    updated[index] = { day: day, description: description.trim() };

    form.setValue("itinerary", updated, { shouldValidate: true });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Itinerary</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input value={day} onChange={(e) => setDay(e.target.valueAsNumber)} />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
