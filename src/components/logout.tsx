import { adminSignOut } from "@/actions/auth.action";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { Loader2 } from "lucide-react";

type LogoutButtonProps = {
  buttonVariant?: "default" | "outline" | "ghost" | "link";
  styleClassName?: string;
};

const LogoutButton = ({
  buttonVariant = "default",
  styleClassName = "",
}: LogoutButtonProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleLogoutButtonClick = async () => {
    setLoading(true);
    await authClient
      .signOut()
      .then(() => {
        router.push("/sign-in");
      })
      .catch(() => {
        toast.error("Error signing out. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Button
      variant={buttonVariant}
      className={styleClassName}
      onClick={handleLogoutButtonClick}
      disabled={loading}
    >
      {loading ? <Loader2 className="animate-spin size-4" /> : "Sign Out"}
    </Button>
  );
};

export default LogoutButton;
