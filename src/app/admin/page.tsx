export default function AdminPage() {
  return (
    <section className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-[0_24px_80px_-24px_rgba(15,23,42,0.18)] backdrop-blur sm:p-12">
      <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
        Admin
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
        Admin dashboard
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
        This area is reserved for admin users. Add management tools, moderation
        controls, and internal reporting here.
      </p>
    </section>
  );
}
