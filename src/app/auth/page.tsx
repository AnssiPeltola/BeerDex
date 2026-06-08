import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import AuthLanding from "@/components/auth/auth-landing";
import { authOptions } from "@/lib/auth";

export default async function AuthPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return <AuthLanding />;
}
