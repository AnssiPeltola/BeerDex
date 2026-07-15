import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  await requireAdmin();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#f8fafc,#ffffff_45%,#eef2ff)] px-6 py-12 text-slate-900 sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-5xl">{children}</div>
    </main>
  );
}
