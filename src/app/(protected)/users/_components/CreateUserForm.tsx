"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import SubmitButton from "@/components/submit-button";
import { toast } from "sonner";
import { createUser } from "@/app/_actions/users";

const formSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  name: z.string().min(2, "Name must be at least 2 characters."),
  role: z.literal(["user", "admin"]),
});

export default function CreateUserForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      role: "admin",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const parsed = formSchema.safeParse(data);

    if (!parsed.success) {
      toast.error("Validation failed");
      return;
    }

    try {
      console.log(data);

      // API/server action here
      await createUser(data)

      form.reset();
      toast.success("User created successfully");
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <div>
      <form id="user-form" className="mb-4 max-w-md" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          {/* Name */}
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Name</FieldLabel>

                <FieldContent>
                  <Input {...field} placeholder="James Smith" />
                </FieldContent>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Email */}
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Email</FieldLabel>

                <FieldContent>
                  <Input
                    {...field}
                    type="email"
                    placeholder="user@example.com"
                  />
                </FieldContent>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Password */}
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Password</FieldLabel>

                <FieldContent>
                  <Input
                    {...field}
                    type="password"
                    placeholder="some-secure-password"
                  />
                </FieldContent>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </form>

      <SubmitButton
        type="submit"
        form="user-form"
        className="w-full max-w-md"
        isLoading={form.formState.isSubmitting}
      >
        Create User
      </SubmitButton>
    </div>
  );
}
