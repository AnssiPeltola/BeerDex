import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import RegisterForm from "@/components/auth/register-form";
import { authOptions } from "@/lib/auth";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#f5f7fb,#ffffff_45%,#eef2ff)] px-6 py-12 text-slate-900 sm:px-8 lg:px-12">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-2xl items-center justify-center">
        <section className="w-full rounded-3xl border border-white/70 bg-white/85 p-8 shadow-[0_24px_80px_-24px_rgba(15,23,42,0.18)] backdrop-blur sm:p-12">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
            BeerDex
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Create your account.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-slate-600">
            Choose a username, add your email, and set a password.
          </p>

          <RegisterForm />
        </section>
      </div>
    </main>
  );
}
