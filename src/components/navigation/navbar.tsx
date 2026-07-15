import Link from "next/link";
import UserDropdownMenu from "./user-dropdown-menu";

type NavbarProps = {
  username: string;
  role: "user" | "admin";
};

export default function Navbar({ username, role }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-slate-950"
        >
          BeerDex
        </Link>

        <UserDropdownMenu username={username} role={role} />
      </div>
    </header>
  );
}
