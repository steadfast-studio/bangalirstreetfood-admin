"use client";
import { deleteUser } from "@/app/_actions/users";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DeleteUserButton = ({ userId, isDev = false }: { userId: string, isDev?: boolean }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteUser(userId);
      // Optionally, you can add a success message or refresh the user list here
    } catch (error) {
      console.error("Failed to delete user:", error);
      // Optionally, you can show an error message to the user here
    } finally {
      setIsDeleting(false);
      router.refresh(); // Refresh the page to reflect the changes
    }
  };
  return (
    <DropdownMenuItem
      disabled={isDeleting || isDev}
      onClick={handleDelete}
      variant="destructive"
      className="cursor-pointer"
    >
      {isDeleting ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        "Delete"
      )}
    </DropdownMenuItem>
  );
};

export default DeleteUserButton;
