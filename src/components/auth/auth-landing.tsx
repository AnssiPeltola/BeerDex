"use client";

import Link from "next/link";
import { useState } from "react";
import LoginModal from "./login-modal";

export default function AuthLanding() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#f5f7fb,#ffffff_45%,#eef2ff)] px-6 py-12 text-slate-900 sm:px-8 lg:px-12">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-4xl items-center justify-center">
        <section className="w-full rounded-3xl border border-white/70 bg-white/85 p-8 shadow-[0_24px_80px_-24px_rgba(15,23,42,0.18)] backdrop-blur sm:p-12">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
            BeerDex
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Sign in to continue.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-slate-600">
            Create an account or log in with your email address or username.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Register
            </Link>
            <button
              type="button"
              onClick={() => setIsLoginOpen(true)}
              className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Login
            </button>
          </div>
        </section>
      </div>

      <LoginModal
        key={isLoginOpen ? "open" : "closed"}
        open={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </main>
  );
}
