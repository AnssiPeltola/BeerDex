import Link from "next/link";

export default function BeerNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-slate-900">Beer not found</h1>

      <p className="mt-4 text-slate-600">
        {`The beer you're looking for doesn't exist or isn't publicly available.`}
      </p>

      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
          Go to homepage
        </Link>

        <Link
          href="/profile/collection"
          className="rounded-lg border border-slate-300 px-4 py-2 transition hover:bg-slate-50"
        >
          My collection
        </Link>
      </div>
    </div>
  );
}
