import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession();

  if (!session) {
    redirect("/sign-in");
  } else {
    redirect("/dashboard");
  }
}
