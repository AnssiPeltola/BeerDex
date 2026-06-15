import type { ReactNode } from "react";
import { requireUser } from "@/lib/auth/requireUser";

// layout.tsx: Provides a shared UI container and a layout-level auth guard for creating a new beer.

export default async function NewBeerLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Authenticate the user before rendering the layout wrapper.
  // If no valid session is found, requireUser() will trigger a server-side redirect to /login.
  await requireUser();

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 to-white px-6 py-10">
      <div className="mx-auto max-w-3xl">{children}</div>
    </main>
  );
}
