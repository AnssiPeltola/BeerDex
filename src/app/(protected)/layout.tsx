import { requireUser } from "@/lib/auth/requireUser";
import Navbar from "@/components/navigation/navbar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireUser();

  return (
    <>
      <Navbar username={session.user.username} role={session.user.role} />
      <main>{children}</main>
    </>
  );
}
