import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-primary/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20  aria-invalid:border-destructive file:text-background file:p-1  placeholder:text-muted-foreground h-9 w-full min-w-0 rounded-md border-2 bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-6 file:cursor-pointer file:border-0 file:bg-primary file:text-sm file:font-medium focus-visible:ring-3  read-only:pointer-events-none read-only:cursor-not-allowed read-only:bg-gray-100 read-only:text-gray-800  disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
