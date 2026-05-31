import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

const SubmitButton = ({
  children,
  isLoading = false,
  asChild = false,
  type = "button",
  ...props
}: {
  children: React.ReactNode;
  asChild?: boolean;
  isLoading?: boolean;
  type?: "button" | "submit" | "reset";
} & React.ComponentPropsWithoutRef<typeof Button>) => {
  return (
    <Button {...props} disabled={isLoading} asChild={asChild} type={type}>
      {isLoading ? <Loader2 className="animate-spin" /> : children}
    </Button>
  );
};

export default SubmitButton;
