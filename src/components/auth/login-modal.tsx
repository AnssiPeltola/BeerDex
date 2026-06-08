"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) {
    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const result = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });

      if (!result?.ok) {
        setErrorMessage("Invalid email/username or password.");
        return;
      }

      onClose();
      router.replace("/");
      router.refresh();
    } catch {
      setErrorMessage("Failed to log in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Log in</h2>
            <p className="mt-1 text-sm text-slate-500">
              Use your email address or username.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-2 py-1 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Close
          </button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">
              Email or username
            </span>
            <input
              type="text"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
              placeholder="you@example.com or yourname"
              autoComplete="username"
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
              placeholder="Your password"
              autoComplete="current-password"
              required
            />
          </label>

          {errorMessage ? (
            <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}
