"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import SubmitButton from "@/components/submit-button";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/actions/auth.action";

const formSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export default function LoginForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = React.useState(false);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const parsed = formSchema.safeParse(data);

    if (!parsed.success) {
      toast.error("Validation Error: " + parsed.error.message);
      return;
    }
    // TODO: Implement actual login logic here
    await adminLogin(data.email, data.password)
      .then(() => {
        form.reset();
        // Redirect to dashboard or home page after successful login
        router.push("/dashboard");
      })
      .catch(() => {
        toast.error("Login Error:", {
          description: "Invalid email or password. Please try again.",
        });
      });
    // delay is just to simulate an async operation
  }

  return (
    <div className="flex items-center justify-center bg-gray-100 h-svh p-12">
      <Card className="m-12 w-full max-w-md">
        <CardHeader>
          <CardTitle>
            <h1 className="font-semibold text-center">Login</h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="">
              {/* Email */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="login-email">Email</FieldLabel>
                    <FieldContent>
                      <Input
                        {...field}
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        aria-invalid={fieldState.invalid}
                        autoComplete="email"
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
                    <FieldLabel htmlFor="login-password">Password</FieldLabel>
                    <FieldContent className="relative">
                      <Input
                        {...field}
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        aria-invalid={fieldState.invalid}
                        autoComplete="current-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        className="absolute top-1/2 right-2 -translate-y-1/2 p-1"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </FieldContent>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <SubmitButton
            // isSpinnerActive={form.formState.isSubmitting}
            type="submit"
            form="login-form"
            className="w-full"
            isLoading={form.formState.isSubmitting}
          >
            Login
          </SubmitButton>
        </CardFooter>
      </Card>
    </div>
  );
}
