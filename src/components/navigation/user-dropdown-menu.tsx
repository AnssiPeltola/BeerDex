"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { handleLogout } from "@/actions/auth/logout";

type UserDropdownMenuProps = {
  username: string;
  role: "user" | "admin";
};

export default function UserDropdownMenu({
  username,
  role,
}: UserDropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-label="Open user menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
      >
        <span className="flex flex-col gap-1.5" aria-hidden="true">
          <span className="block h-0.5 w-4 rounded-full bg-current" />
          <span className="block h-0.5 w-4 rounded-full bg-current" />
          <span className="block h-0.5 w-4 rounded-full bg-current" />
        </span>
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-full z-9999 mt-3 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.35)]">
          <div className="px-3 py-2">
            <p className="text-sm font-semibold text-slate-900">
              {username || "Account"}
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              {role}
            </p>
          </div>

          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
          >
            Profile
          </Link>

          <Link
            href="/beers/add"
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
          >
            Add Beer
          </Link>

          {role === "admin" ? (
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
            >
              Admin panel
            </Link>
          ) : null}

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
          >
            Logoff
          </button>
        </div>
      ) : null}
    </div>
  );
}
