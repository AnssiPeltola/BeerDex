import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UserDropdownMenu from "@/components/navigation/user-dropdown-menu";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth");
  }

  const username = session.user?.username ?? session.user?.name ?? "";
  const role = session.user?.role ?? "user";

  return (
    <main className="relative min-h-screen bg-[radial-gradient(circle_at_top,#f5f7fb,#ffffff_45%,#eef2ff)] px-6 py-12 text-slate-900 sm:px-8 lg:px-12">
      <div className="absolute right-6 top-6 sm:right-8 lg:right-12">
        <UserDropdownMenu username={username} role={role} />
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-4xl items-center justify-center">
        <section className="w-full rounded-3xl border border-white/70 bg-white/85 p-8 shadow-[0_24px_80px_-24px_rgba(15,23,42,0.18)] backdrop-blur sm:p-12">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
            BeerDex
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Welcome back.
          </h1>
          {username ? (
            <p className="mt-4 text-lg text-slate-600">
              You are signed in as{" "}
              <span className="font-semibold text-slate-900">{username}</span>.
            </p>
          ) : (
            <p className="mt-4 text-lg text-slate-600">
              You are signed in and ready to continue.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
